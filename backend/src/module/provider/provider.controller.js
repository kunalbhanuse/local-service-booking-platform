import { prisma } from "../../common/db/prisma.js";
import { handleError } from "../../common/utility/http.js";
import { z } from "zod";
export async function applyService(req, res) {
  try {
    const userId = req.user.id;
    if (!userId) {
      return res.status(403).json({ message: "Forbidden" });
    }
    const { businessName, bio, phone, city, area, experience } = req.body;

    const provider = await prisma.provider.findUnique({
      where: { userId },
    });
    if (provider) {
      return res.status(400).json({ message: "Already applied" });
    }

    const newProvider = await prisma.provider.create({
      data: {
        userId,
        businessName,
        bio,
        phone,
        city,
        area,
        experience,
      },
    });

    return res.status(201).json({
      message: "Application submitted",
      provider: newProvider,
    });
  } catch (error) {
    return res.status(500).json({
      error: {
        message: error.message || "Internal server error",
      },
    });
  }
}

export async function allProvider(req, res) {
  try {
    const allApprovedProvider = await prisma.provider.findMany({
      where: { status: "APPROVED" },
      include: { user: true },
    });
    res.status(200).json({
      success: true,
      message: "All Approved  provider featched succesfully ",
      data: allApprovedProvider,
    });
  } catch (error) {
    return res.status(500).json({
      error: {
        message: error.message || "Internal server error",
      },
    });
  }
}

// ---------------------------------------------------------------------------
// Provider self-service
// ---------------------------------------------------------------------------

const availabilitySchema = z.object({ isAvailable: z.boolean() });

export async function getMyProviderProfile(req, res) {
  try {
    const provider = await prisma.provider.findUnique({
      where: { userId: req.user.id },
      include: { _count: { select: { services: true, bookings: true } } },
    });
    return res.status(200).json({ success: true, data: provider ?? null });
  } catch (error) {
    return handleError(res, error);
  }
}

export async function updateAvailability(req, res) {
  try {
    const { isAvailable } = await availabilitySchema.parseAsync(req.body);
    const provider = await prisma.provider.findUnique({
      where: { userId: req.user.id },
    });
    if (!provider) {
      return res.status(404).json({ error: { message: "Provider Not Found" } });
    }
    if (provider.status !== "APPROVED") {
      return res.status(403).json({
        error: { message: "Your provider profile is not approved yet" },
      });
    }
    const updated = await prisma.provider.update({
      where: { id: provider.id },
      data: { isAvailable },
    });
    return res.status(200).json({
      success: true,
      message: isAvailable ? "You are now accepting bookings" : "You are now unavailable",
      data: updated,
    });
  } catch (error) {
    return handleError(res, error);
  }
}
