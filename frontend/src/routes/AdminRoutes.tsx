import { Route } from "react-router-dom";
import AdminDashboard from "../pages/admin/AdminDashboard.tsx";
import AdminLayout from "../pages/admin/layout/AdminLayout.tsx";
import ProviderDetails from "../pages/admin/ProviderDetails.tsx";

const AdminRoutes = (
  <>
    <Route
      path="/admin"
      element={
        <AdminLayout>
          <AdminDashboard />
        </AdminLayout>
      }
    />
    <Route
      path="/admin/provider/:id"
      element={
        <AdminLayout>
          <ProviderDetails />
        </AdminLayout>
      }
    />
  </>
);

export default AdminRoutes;
