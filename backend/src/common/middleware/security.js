import helmet from "helmet";
import rateLimit from "express-rate-limit";

export const securityHeaders = helmet();

// Generic API limiter – generous, protects against runaway clients.
export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 600,
  standardHeaders: "draft-7",
  legacyHeaders: false,
  message: { error: { message: "Too many requests, please try again later" } },
});

// Tight limiter for credential endpoints (login, signup, password reset).
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 30,
  standardHeaders: "draft-7",
  legacyHeaders: false,
  message: {
    error: { message: "Too many authentication attempts, try again in 15 minutes" },
  },
});
