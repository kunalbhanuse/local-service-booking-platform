import { z } from "zod";

export const createServiceSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Service name must be at least 2 characters")
    .max(50, "Service name cannot exceed 50 characters"),

  description: z
    .string()
    .trim()
    .min(5, "Description must be at least 5 characters")
    .max(200, "Description cannot exceed 200 characters"),

  price: z.coerce.number().positive("Price must be greater than 0"),

  category: z.enum([
    "PLUMBING",
    "ELECTRICAL",
    "CLEANING",
    "CARPENTRY",
    "PAINTING",
  ]),

  isActive: z.boolean().optional().default(true),
});
export const updateServiceSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Service name must be at least 2 characters")
    .max(50, "Service name cannot exceed 50 characters")
    .optional(),

  description: z
    .string()
    .trim()
    .min(5, "Description must be at least 5 characters")
    .max(200, "Description cannot exceed 200 characters")
    .optional(),

  price: z.coerce.number().positive("Price must be greater than 0").optional(),

  category: z
    .enum(["PLUMBING", "ELECTRICAL", "CLEANING", "CARPENTRY", "PAINTING"])
    .optional(),

  isActive: z.boolean().optional(),
});
