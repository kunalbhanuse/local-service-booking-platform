import { ZodError } from "zod";
import { Prisma } from "@prisma/client";

/**
 * Maps thrown errors to a consistent HTTP response.
 * Validation -> 400, unique/foreign-key conflicts -> 409, missing rows -> 404, else 500.
 */
export function handleError(res, error) {
  if (error instanceof ZodError) {
    return res.status(400).json({
      error: {
        message: "Validation failed",
        details: error.issues.map((issue) => ({
          path: issue.path.join("."),
          message: issue.message,
        })),
      },
    });
  }

  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    if (error.code === "P2002") {
      return res.status(409).json({
        error: { message: "A record with these values already exists" },
      });
    }
    if (error.code === "P2025") {
      return res.status(404).json({ error: { message: "Record not found" } });
    }
    if (error.code === "P2003") {
      return res.status(409).json({
        error: { message: "This record is still referenced by other records" },
      });
    }
  }

  console.error(error);
  return res.status(500).json({
    error: { message: "Internal server error" },
  });
}
