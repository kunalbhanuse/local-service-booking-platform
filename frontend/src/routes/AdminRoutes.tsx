import { Route } from "react-router-dom";
import AdminDashboard from "../pages/admin/AdminDashboard.tsx";

const AdminRoutes = (
  <>
    <Route path="/admin" element={<AdminDashboard />} />
  </>
);

export default AdminRoutes;
