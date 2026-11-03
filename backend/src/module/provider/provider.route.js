import { Router } from "express";
import { isLoggedIn } from "../auth/auth.middleware.js";
import * as controller from "./provider.controller.js";
import { isProvider } from "../service/service.middleware.js";

const provider = Router();

provider.post("/apply", isLoggedIn, controller.applyService);
provider.get("/allProvider", isLoggedIn, controller.allProvider);

provider.get("/me", isLoggedIn, controller.getMyProviderProfile);
provider.patch("/availability", isLoggedIn, isProvider, controller.updateAvailability);

export default provider;
