import { z } from "zod";

const validateApply = z.object({
  businessName: z.string(),
  bio: z.string(),
  phone: z.number(),
  city: z.string(),
  area: z.string(),
  experience: z.number(),
});
