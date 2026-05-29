import { useState, useEffect } from "react";
import { api } from "../../api/axios";
import { useNavigate } from "react-router-dom";

function AdminDashboard() {
  const [providers, setProviders] = useState([]);
  const [status, setStatus] = useState("PENDING");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const fetchProviders = async () => {
      try {
        setLoading(true);

        const response = await api.get(`/admin/providers?status=${status}`);

        setProviders(response.data.data);
      } catch (error: any) {
        console.log(error);
        console.log(error.response?.data);

        setError(error.response?.data?.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    fetchProviders();
  }, [status]);

  const updateStatus = async (id: number, newStatus: string) => {
    try {
      await api.post(`/admin/provider/${id}/update`, { status: newStatus });

      setProviders((prev: any[]) => prev.filter((p) => p.id !== id));
    } catch (error) {
      console.log(error);
    }
  };

  const statusConfig: Record<
    string,
    { bg: string; text: string; dot: string }
  > = {
    PENDING: {
      bg: "#fffbeb",
      text: "#92400e",
      dot: "#f59e0b",
    },
    APPROVED: {
      bg: "#f0fdf4",
      text: "#166534",
      dot: "#16a34a",
    },
    REJECTED: {
      bg: "#fef2f2",
      text: "#991b1b",
      dot: "#dc2626",
    },
  };

  const tabs = [
    { key: "PENDING", label: "Pending" },
    { key: "APPROVED", label: "Approved" },
    { key: "REJECTED", label: "Rejected" },
  ];

  return (
    <div
      style={{
        padding: "32px",
        maxWidth: 1100,
        margin: "0 auto",
      }}
    >
      {/* Header */}
      <div style={{ marginBottom: 28 }}>
        <h1
          style={{
            margin: 0,
            fontSize: 20,
            fontWeight: 600,
            color: "#111",
            letterSpacing: "-0.4px",
          }}
        >
          Provider Management
        </h1>

        <p
          style={{
            margin: "4px 0 0",
            fontSize: 14,
            color: "#888",
          }}
        >
          Review and manage provider applications
        </p>
      </div>

      {/* Error */}
      {error && (
        <div
          style={{
            marginBottom: 20,
            background: "#fef2f2",
            border: "1px solid #fecaca",
            color: "#991b1b",
            padding: "12px 16px",
            borderRadius: 10,
            fontSize: 13,
          }}
        >
          {error}
        </div>
      )}

      {/* Stats */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: 14,
          marginBottom: 28,
        }}
      >
        {tabs.map((t) => {
          const cfg = statusConfig[t.key];

          return (
            <div
              key={t.key}
              onClick={() => setStatus(t.key)}
              style={{
                background: status === t.key ? "#111" : "#fff",
                border: `1px solid ${status === t.key ? "#111" : "#e8e8e8"}`,
                borderRadius: 12,
                padding: "16px 20px",
                cursor: "pointer",
                transition: "all 0.15s",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  marginBottom: 4,
                }}
              >
                <span
                  style={{
                    width: 7,
                    height: 7,
                    borderRadius: "50%",
                    background: status === t.key ? "#fff" : cfg.dot,
                    display: "inline-block",
                  }}
                />

                <span
                  style={{
                    fontSize: 12,
                    fontWeight: 500,
                    color: status === t.key ? "#aaa" : "#999",
                    textTransform: "uppercase",
                    letterSpacing: "0.5px",
                  }}
                >
                  {t.label}
                </span>
              </div>

              <p
                style={{
                  margin: 0,
                  fontSize: 22,
                  fontWeight: 600,
                  color: status === t.key ? "#fff" : "#111",
                }}
              >
                {status === t.key ? providers.length : "—"}
              </p>
            </div>
          );
        })}
      </div>

      {/* Table */}
      <div
        style={{
          background: "#fff",
          border: "1px solid #e8e8e8",
          borderRadius: 12,
          overflow: "hidden",
        }}
      >
        {/* Toolbar */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "14px 20px",
            borderBottom: "1px solid #f0f0f0",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
            }}
          >
            <span
              style={{
                fontSize: 14,
                fontWeight: 500,
                color: "#111",
              }}
            >
              {tabs.find((t) => t.key === status)?.label} Providers
            </span>

            <span
              style={{
                background: "#f4f4f4",
                color: "#666",
                fontSize: 12,
                fontWeight: 500,
                padding: "2px 8px",
                borderRadius: 20,
              }}
            >
              {providers.length}
            </span>
          </div>

          <div style={{ display: "flex", gap: 4 }}>
            {tabs.map((t) => (
              <button
                key={t.key}
                onClick={() => setStatus(t.key)}
                style={{
                  border: "1px solid",
                  borderColor: status === t.key ? "#111" : "#e8e8e8",
                  background: status === t.key ? "#111" : "#fff",
                  color: status === t.key ? "#fff" : "#666",
                  borderRadius: 8,
                  padding: "5px 14px",
                  fontSize: 13,
                  cursor: "pointer",
                }}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {/* Loader */}
        {loading ? (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              padding: "60px 0",
            }}
          >
            <div
              style={{
                width: 20,
                height: 20,
                border: "2px solid #e8e8e8",
                borderTopColor: "#111",
                borderRadius: "50%",
                animation: "spin 0.7s linear infinite",
              }}
            />

            <style>
              {`
                @keyframes spin {
                  to {
                    transform: rotate(360deg);
                  }
                }
              `}
            </style>
          </div>
        ) : (
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              fontSize: 13,
            }}
          >
            <thead>
              <tr style={{ background: "#fafafa" }}>
                {[
                  "Provider",
                  "Email",
                  "Role",
                  "Joined",
                  "Status",
                  "Actions",
                ].map((h) => (
                  <th
                    key={h}
                    style={{
                      padding: "10px 20px",
                      textAlign: "left",
                      fontWeight: 500,
                      color: "#999",
                      fontSize: 12,
                      borderBottom: "1px solid #f0f0f0",
                    }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {providers.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    style={{
                      textAlign: "center",
                      padding: "52px 0",
                      color: "#bbb",
                    }}
                  >
                    No {status.toLowerCase()} providers found
                  </td>
                </tr>
              ) : (
                providers.map((p: any) => {
                  const cfg = statusConfig[status];

                  return (
                    <tr
                      key={p.id}
                      style={{
                        borderBottom: "1px solid #f8f8f8",
                      }}
                    >
                      {/* Provider */}
                      <td
                        style={{
                          padding: "14px 20px",
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 10,
                          }}
                        >
                          <div
                            style={{
                              width: 34,
                              height: 34,
                              borderRadius: "50%",
                              background: "#111",
                              color: "#fff",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              fontSize: 13,
                              fontWeight: 600,
                            }}
                          >
                            {p.user?.name?.charAt(0)?.toUpperCase() || "?"}
                          </div>

                          <div>
                            <p
                              style={{
                                margin: 0,
                                fontWeight: 500,
                              }}
                            >
                              {p.user?.name}
                            </p>

                            <p
                              style={{
                                margin: "1px 0 0",
                                fontSize: 11,
                                color: "#aaa",
                              }}
                            >
                              ID #{p.id}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Email */}
                      <td
                        style={{
                          padding: "14px 20px",
                          color: "#555",
                        }}
                      >
                        {p.user?.email}
                      </td>

                      {/* Role */}
                      <td
                        style={{
                          padding: "14px 20px",
                        }}
                      >
                        <span
                          style={{
                            background: "#f4f4f4",
                            color: "#555",
                            fontSize: 12,
                            padding: "3px 10px",
                            borderRadius: 20,
                          }}
                        >
                          {p.user?.role || "Provider"}
                        </span>
                      </td>

                      {/* Joined */}
                      <td
                        style={{
                          padding: "14px 20px",
                          color: "#999",
                          fontSize: 12,
                        }}
                      >
                        {p.createdAt
                          ? new Date(p.createdAt).toLocaleDateString("en-IN", {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            })
                          : "—"}
                      </td>

                      {/* Status */}
                      <td
                        style={{
                          padding: "14px 20px",
                        }}
                      >
                        <span
                          style={{
                            background: cfg.bg,
                            color: cfg.text,
                            fontSize: 12,
                            fontWeight: 500,
                            padding: "3px 10px",
                            borderRadius: 20,
                            display: "inline-flex",
                            alignItems: "center",
                            gap: 5,
                          }}
                        >
                          <span
                            style={{
                              width: 6,
                              height: 6,
                              borderRadius: "50%",
                              background: cfg.dot,
                            }}
                          />

                          {status}
                        </span>
                      </td>

                      {/* Actions */}
                      <td
                        style={{
                          padding: "14px 20px",
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            gap: 8,
                          }}
                        >
                          <button
                            onClick={() => navigate(`/admin/provider/${p.id}`)}
                            style={{
                              background: "#fff",
                              color: "#111",
                              border: "1px solid #ddd",
                              borderRadius: 8,
                              padding: "6px 14px",
                              fontSize: 12,
                              cursor: "pointer",
                            }}
                          >
                            View
                          </button>

                          {status === "PENDING" && (
                            <>
                              <button
                                onClick={() => updateStatus(p.id, "APPROVED")}
                                style={{
                                  background: "#111",
                                  color: "#fff",
                                  border: "none",
                                  borderRadius: 8,
                                  padding: "6px 14px",
                                  fontSize: 12,
                                  cursor: "pointer",
                                }}
                              >
                                Approve
                              </button>

                              <button
                                onClick={() => updateStatus(p.id, "REJECTED")}
                                style={{
                                  background: "#fff",
                                  color: "#dc2626",
                                  border: "1px solid #fca5a5",
                                  borderRadius: 8,
                                  padding: "6px 14px",
                                  fontSize: 12,
                                  cursor: "pointer",
                                }}
                              >
                                Reject
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default AdminDashboard;
