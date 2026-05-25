import { Router } from "express";
import { isLoggedIn } from "../auth/auth.middleware.js";
import * as controller from "./provider.controller.js";

const provider = Router();

provider.post("/apply", isLoggedIn, controller.applyService);
provider.get("/allProvider", isLoggedIn, controller.allProvider);

export default provider;
