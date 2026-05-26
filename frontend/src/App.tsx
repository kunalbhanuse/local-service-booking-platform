import { Routes } from "react-router-dom";
import "./App.css";
import AuthRoutes from "./routes/AuthRoutes.tsx";
import AdminRoutes from "./routes/AdminRoutes.tsx";

function App() {
  return (
    <Routes>
      {AuthRoutes}
      {AdminRoutes}
    </Routes>
  );
}

export default App;
