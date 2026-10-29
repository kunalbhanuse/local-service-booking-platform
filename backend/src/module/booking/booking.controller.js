import { prisma } from "../../common/db/prisma.js";
import { handleError } from "../../common/utility/http.js";
import {
  createBookingSchema,
  updateBookingStatusSchema,
  bookingQuerySchema,
} from "./dto/booking.dto.js";

const SLOT_WINDOW_MS = 60 * 60 * 1000;

const customerInclude = {
  service: { select: { id: true, name: true, category: true, price: true } },
  provider: {
    select: { id: true, businessName: true, city: true, area: true, phone: true },
  },
};

const providerInclude = {
  service: { select: { id: true, name: true, category: true, price: true } },
  customer: { select: { id: true, name: true, email: true } },
};

// Who may move a booking from one status to another, by their relationship to it.
const TRANSITIONS = {
  customer: { PENDING: ["CANCELLED"], CONFIRMED: ["CANCELLED"] },
  provider: {
    PENDING: ["CONFIRMED", "CANCELLED"],
    CONFIRMED: ["COMPLETED", "CANCELLED"],
  },
  admin: { PENDING: ["CANCELLED"], CONFIRMED: ["CANCELLED"] },
};

async function resolveActor(user, booking) {
  if (booking.customerId === user.id) return "customer";
  const provider = await prisma.provider.findUnique({
    where: { userId: user.id },
    select: { id: true },
  });
  if (provider && provider.id === booking.providerId) return "provider";
  if (user.role === "ADMIN") return "admin";
  return null;
}

export async function createBooking(req, res) {
  try {
    const { serviceId, scheduledAt, address, notes } =
      await createBookingSchema.parseAsync(req.body);

    const service = await prisma.service.findUnique({
      where: { id: serviceId },
      include: { provider: true },
    });
    if (!service || !service.isActive) {
      return res.status(404).json({ error: { message: "Service not available" } });
    }
    if (service.provider.status !== "APPROVED") {
      return res
        .status(409)
        .json({ error: { message: "This provider is not accepting bookings" } });
    }
    if (!service.provider.isAvailable) {
      return res.status(409).json({
        error: { message: "This provider is currently unavailable" },
      });
    }
    if (service.provider.userId === req.user.id) {
      return res
        .status(400)
        .json({ error: { message: "You cannot book your own service" } });
    }

    const clash = await prisma.booking.findFirst({
      where: {
        providerId: service.providerId,
        status: { in: ["PENDING", "CONFIRMED"] },
        scheduledAt: {
          gt: new Date(scheduledAt.getTime() - SLOT_WINDOW_MS),
          lt: new Date(scheduledAt.getTime() + SLOT_WINDOW_MS),
        },
      },
      select: { id: true },
    });
    if (clash) {
      return res.status(409).json({
        error: { message: "That time slot is already taken, choose another" },
      });
    }

    const booking = await prisma.booking.create({
      data: {
        customerId: req.user.id,
        providerId: service.providerId,
        serviceId: service.id,
        scheduledAt,
        address,
        notes,
        priceAtBooking: service.price,
      },
      include: customerInclude,
    });

    return res.status(201).json({
      success: true,
      message: "Booking requested",
      data: booking,
    });
  } catch (error) {
    return handleError(res, error);
  }
}

export async function getMyBookings(req, res) {
  try {
    const { status } = await bookingQuerySchema.parseAsync(req.query);
    const bookings = await prisma.booking.findMany({
      where: { customerId: req.user.id, ...(status && { status }) },
      include: customerInclude,
      orderBy: { scheduledAt: "desc" },
    });
    return res.status(200).json({ success: true, data: bookings });
  } catch (error) {
    return handleError(res, error);
  }
}

export async function getProviderBookings(req, res) {
  try {
    const { status } = await bookingQuerySchema.parseAsync(req.query);
    const provider = await prisma.provider.findUnique({
      where: { userId: req.user.id },
      select: { id: true },
    });
    if (!provider) {
      return res.status(404).json({ error: { message: "Provider Not Found" } });
    }
    const bookings = await prisma.booking.findMany({
      where: { providerId: provider.id, ...(status && { status }) },
      include: providerInclude,
      orderBy: { scheduledAt: "asc" },
    });
    return res.status(200).json({ success: true, data: bookings });
  } catch (error) {
    return handleError(res, error);
  }
}

export async function getAllBookings(req, res) {
  try {
    const { status } = await bookingQuerySchema.parseAsync(req.query);
    const bookings = await prisma.booking.findMany({
      where: { ...(status && { status }) },
      include: {
        ...providerInclude,
        provider: { select: { id: true, businessName: true, city: true } },
      },
      orderBy: { createdAt: "desc" },
    });
    return res.status(200).json({ success: true, data: bookings });
  } catch (error) {
    return handleError(res, error);
  }
}

export async function getBookingById(req, res) {
  try {
    const id = Number(req.params.id);
    if (!Number.isInteger(id) || id <= 0) {
      return res.status(400).json({ error: { message: "Invalid booking id" } });
    }
    const booking = await prisma.booking.findUnique({
      where: { id },
      include: { ...customerInclude, ...providerInclude },
    });
    if (!booking) {
      return res.status(404).json({ error: { message: "Booking not found" } });
    }
    const actor = await resolveActor(req.user, booking);
    if (!actor) {
      return res.status(403).json({ error: { message: "Forbidden" } });
    }
    return res.status(200).json({ success: true, data: booking });
  } catch (error) {
    return handleError(res, error);
  }
}

export async function updateBookingStatus(req, res) {
  try {
    const id = Number(req.params.id);
    if (!Number.isInteger(id) || id <= 0) {
      return res.status(400).json({ error: { message: "Invalid booking id" } });
    }
    const { status } = await updateBookingStatusSchema.parseAsync(req.body);

    const booking = await prisma.booking.findUnique({ where: { id } });
    if (!booking) {
      return res.status(404).json({ error: { message: "Booking not found" } });
    }

    const actor = await resolveActor(req.user, booking);
    if (!actor) {
      return res.status(403).json({ error: { message: "Forbidden" } });
    }

    const allowed = TRANSITIONS[actor][booking.status] || [];
    if (!allowed.includes(status)) {
      return res.status(409).json({
        error: {
          message: `Cannot change a ${booking.status.toLowerCase()} booking to ${status.toLowerCase()}`,
        },
      });
    }

    const updated = await prisma.booking.update({
      where: { id },
      data: { status },
      include: { ...customerInclude, ...providerInclude },
    });
    return res.status(200).json({
      success: true,
      message: `Booking ${status.toLowerCase()}`,
      data: updated,
    });
  } catch (error) {
    return handleError(res, error);
  }
}
