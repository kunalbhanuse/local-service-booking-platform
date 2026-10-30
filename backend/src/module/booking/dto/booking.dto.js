import { z } from "zod";

export const BOOKING_STATUSES = ["PENDING", "CONFIRMED", "COMPLETED", "CANCELLED"];

export const createBookingSchema = z.object({
  serviceId: z.coerce.number().int().positive(),
  scheduledAt: z.coerce
    .date({ error: "Enter a valid date and time" })
    .refine(
      (d) => d.getTime() > Date.now() + 60 * 60 * 1000,
      "Booking must be at least 1 hour in the future",
    ),
  address: z
    .string()
    .trim()
    .min(5, "Address must be at least 5 characters")
    .max(200, "Address cannot exceed 200 characters"),
  notes: z.string().trim().max(500, "Notes cannot exceed 500 characters").optional(),
});

export const updateBookingStatusSchema = z.object({
  status: z.enum(["CONFIRMED", "COMPLETED", "CANCELLED"]),
});

export const bookingQuerySchema = z.object({
  status: z.enum(BOOKING_STATUSES).optional(),
});
