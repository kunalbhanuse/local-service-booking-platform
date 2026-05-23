import { z } from "zod";
export const updateProviderStatusSchema = z.object({
  status: z.enum(["PENDING", "APPROVED", "REJECTED"]),
});
