import { Router } from "express";
import * as controller from "../auth/auth.controllers.js";
import { isLoggedIn } from "../auth/auth.middleware.js";

const authRouter = Router();

authRouter.post("/signup", controller.signup);
authRouter.post("/login", controller.login);
authRouter.get("/getme", isLoggedIn, controller.getme);
authRouter.post("/logout", isLoggedIn, controller.logout);

authRouter.post("/rotateToken", controller.rotateTokens);

authRouter.post("/forgetPassword", controller.forgetPassword);
authRouter.post("/resetPassword", controller.resetPassword);
export default authRouter;
