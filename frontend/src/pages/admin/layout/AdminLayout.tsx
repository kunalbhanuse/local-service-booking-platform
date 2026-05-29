import { useNavigate } from "react-router-dom";
import { api } from "../../../api/axios";
import { useState } from "react";

export default function AdminLayout({ children }) {
  const navigate = useNavigate();
  const [error, setError] = useState("");

  return (
    <div className="min-h-screen flex flex-col">
      <nav className="sticky top-0 z-50 bg-white flex items-center justify-between px-8 py-5 border-b border-[#e8e8e8]">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 bg-[#111] rounded-lg flex items-center justify-center">
            <span className="text-white text-lg">🔧</span>
          </div>

          <span className="font-medium text-[15px] tracking-[-0.3px] text-[#111]">
            KB
          </span>
        </div>

        <div className="flex gap-8">
          <a
            href="/admin"
            className="text-sm text-[#666] hover:text-[#111] transition"
          >
            AdminDashboard
          </a>
        </div>

        <div className="flex gap-3">
          <button
            onClick={async () => {
              try {
                const response = await api.post("/auth/logout");
                localStorage.removeItem("access_token");
                console.log(response);
                navigate("/login");
              } catch (error) {
                setError(
                  error.response?.data?.message || "Something went wrong",
                );
              }
            }}
            className="border border-[#ddd] bg-white rounded-lg px-[18px] py-2 text-[13px] cursor-pointer text-[#333]"
          >
            Logout
          </button>
        </div>
      </nav>

      <div className="flex-1">{children}</div>
    </div>
  );
}
