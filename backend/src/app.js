import "dotenv/config";
import express from "express";
const app = express();
import cookieParser from "cookie-parser";
import authRouter from "./module/auth/auth.route.js";
import provider from "./module/provider/provider.route.js";
import adminRouter from "./module/admin/admin.route.js";
import cors from "cors";

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  }),
);
app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRouter);
app.use("/api/provider", provider);
app.use("/api/admin", adminRouter);

app.get("/", (req, res) => {
  res.json({
    message: "Local Service API Running",
  });
});

export default app;
