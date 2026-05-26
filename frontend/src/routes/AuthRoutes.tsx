import React from "react";
import { Route } from "react-router-dom";
import Home from "../pages/auth/Home";
import Login from "../pages/auth/Login";
import Signup from "../pages/auth/Signup";
import Me from "../pages/auth/Me";
import ForgotPassword from "../pages/auth/ForgotPassword";
import ResetPassword from "../pages/auth/ResetPassword";

const AuthRoutes = (
  <>
    <Route path="/" element={<Home />} />
    <Route path="/login" element={<Login />} />
    <Route path="/signup" element={<Signup />} />
    <Route path="/me" element={<Me />} />
    <Route path="/forgotPassword" element={<ForgotPassword />} />
    <Route path="/resetPassword" element={<ResetPassword />} />
  </>
);

export default AuthRoutes;
