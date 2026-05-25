import { Outlet } from "react-router-dom";

export default function AuthLayout() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <h1>Navbar</h1>
      <Outlet />
    </div>
  );
}
