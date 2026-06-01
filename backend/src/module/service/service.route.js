import { Router } from "express";
import * as controller from "./service.controller.js";
import { isLoggedIn } from "../auth/auth.middleware.js";
import { isProvider } from "./service.middleware.js";

const serviceRouter = Router();

serviceRouter.post(
  "/register",
  isLoggedIn,
  isProvider,
  controller.registerService,
);
serviceRouter.get("/allServices", isLoggedIn, controller.getAllServices);
serviceRouter.patch(
  "/update/:id",
  isLoggedIn,
  isProvider,
  controller.updateService,
);

serviceRouter.delete(
  "/delete/:id",
  isLoggedIn,
  isProvider,
  controller.deleteService,
);

serviceRouter.get("/getServiceById/:id", isLoggedIn, controller.getServiceById);
export default serviceRouter;
