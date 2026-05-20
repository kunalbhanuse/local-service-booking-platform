import { Home } from "lucide-react";
import "./App.css";
import Login from "./pages/auth/Login";
import { Routes, Route } from "react-router-dom";
import Signup from "./pages/auth/Signup";
import Me from "./pages/auth/Me";
import ForgotPassword from "./pages/auth/ForgotPassword";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/me" element={<Me />} />
      <Route path="/forgotPassword" element={<ForgotPassword />} />
    </Routes>
  );
}

export default App;
