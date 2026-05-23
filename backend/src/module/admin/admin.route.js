import { Router } from "express";
import * as controller from "./admin.controller.js";
import { isLoggedIn } from "../auth/auth.middleware.js";
import { adminMiddleware } from "./admin.middleware.js";

const adminRouter = Router();

adminRouter.get(
  "/providers",
  isLoggedIn,
  adminMiddleware,
  controller.getAllProvider,
);

adminRouter.get(
  "/provider/:id",
  isLoggedIn,
  adminMiddleware,
  controller.getProviderById,
);
export default adminRouter;
