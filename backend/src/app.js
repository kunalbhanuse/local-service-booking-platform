import "dotenv/config";
import express from "express";
const app = express();
import cookieParser from "cookie-parser";
import authRouter from "./module/auth/auth.route.js";
import provider from "./module/provider/provider.route.js";

app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRouter);
app.use("/api/provider", provider);

app.get("/", (req, res) => {
  res.json({
    message: "Local Service API Running",
  });
});

export default app;
