import { Router } from "express";
import * as controller from "./service.controller.js";
import { isLoggedIn } from "../auth/auth.middleware.js";

const serviceRouter = Router();

serviceRouter.post("/register", isLoggedIn, controller.registerService);

export default serviceRouter;
