import "dotenv/config";
import express from "express";
const app = express();
import authRouter from "./route/auth.route.js";
import cookieParser from "cookie-parser";

app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRouter);

app.get("/", (req, res) => {
  res.json({
    message: "Local Service API Running",
  });
});

export default app;
