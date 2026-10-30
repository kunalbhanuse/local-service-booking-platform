import { Router } from "express";
import * as controller from "./booking.controller.js";
import { isLoggedIn } from "../auth/auth.middleware.js";
import { isProvider } from "../service/service.middleware.js";
import { adminMiddleware } from "../admin/admin.middleware.js";

const bookingRouter = Router();

bookingRouter.post("/create", isLoggedIn, controller.createBooking);
bookingRouter.get("/my", isLoggedIn, controller.getMyBookings);
bookingRouter.get("/provider", isLoggedIn, isProvider, controller.getProviderBookings);
bookingRouter.get("/all", isLoggedIn, adminMiddleware, controller.getAllBookings);
bookingRouter.get("/:id", isLoggedIn, controller.getBookingById);
bookingRouter.patch("/:id/status", isLoggedIn, controller.updateBookingStatus);

export default bookingRouter;
