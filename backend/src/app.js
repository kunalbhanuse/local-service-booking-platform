import "dotenv/config";
import express from "express";
const app = express();
import cookieParser from "cookie-parser";
import authRouter from "./module/auth/auth.route.js";
import provider from "./module/provider/provider.route.js";
import adminRouter from "./module/admin/admin.route.js";
import serviceRouter from "./module/service/service.route.js";
import cors from "cors";
import bookingRouter from "./module/booking/booking.route.js";
import {
  securityHeaders,
  apiLimiter,
  authLimiter,
} from "./common/middleware/security.js";
import { notFound, errorHandler } from "./common/middleware/error.js";

app.set("trust proxy", Number(process.env.TRUST_PROXY || 0));
app.use(securityHeaders);

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  }),
);
app.use(express.json());
app.use(cookieParser());

app.use("/api", apiLimiter);
app.use(
  [
    "/api/auth/login",
    "/api/auth/signup",
    "/api/auth/forgetPassword",
    "/api/auth/resetPassword",
  ],
  authLimiter,
);

app.use("/api/auth", authRouter);
app.use("/api/provider", provider);
app.use("/api/admin", adminRouter);
app.use("/api/service", serviceRouter);
app.use("/api/booking", bookingRouter);

app.get("/", (req, res) => {
  res.json({
    message: "Local Service API Running",
  });
});

app.get("/health", (req, res) => {
  res.json({ status: "ok", uptime: process.uptime() });
});

app.use(notFound);
app.use(errorHandler);

export default app;
