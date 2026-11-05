import { z } from "zod";

export const SERVICE_CATEGORIES = [
  "PLUMBING",
  "ELECTRICAL",
  "CLEANING",
  "CARPENTRY",
  "PAINTING",
];

export const publicServiceQuerySchema = z.object({
  category: z.enum(SERVICE_CATEGORIES).optional(),
  city: z.string().trim().min(1).max(50).optional(),
  q: z.string().trim().min(1).max(100).optional(),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(50).default(12),
});
