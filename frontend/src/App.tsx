import "./App.css";
import Login from "./pages/auth/Login";
import { Routes, Route } from "react-router-dom";
import Signup from "./pages/auth/Signup";
import Me from "./pages/auth/Me";
import ForgotPassword from "./pages/auth/ForgotPassword";
import Home from "./pages/auth/Home";
import ResetPassword from "./pages/auth/ResetPassword";
import AuthLayout from "./pages/auth/ layout/AuthLayout";

function App() {
  return (
    <Routes element={<AuthLayout />}>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/me" element={<Me />} />
      <Route path="/forgotPassword" element={<ForgotPassword />} />
      <Route path="/resetPassword" element={<ResetPassword />} />
    </Routes>
  );
}

export default App;
