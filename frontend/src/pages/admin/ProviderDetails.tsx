import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { api } from "../../api/axios";

function ProviderDetails() {
  const { id } = useParams();

  const [provider, setProvider] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProvider = async () => {
      try {
        setLoading(true);

        const response = await api.get(`/admin/provider/${id}`);

        setProvider(response.data.data);
      } catch (error: any) {
        console.log(error);

        setError(error.response?.data?.message || "Failed to fetch provider");
      } finally {
        setLoading(false);
      }
    };

    fetchProvider();
  }, [id]);

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

  if (loading) {
    return (
      <div
        style={{
          minHeight: "80vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            width: 24,
            height: 24,
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
    );
  }

  if (error) {
    return (
      <div
        style={{
          padding: 40,
          color: "#991b1b",
        }}
      >
        {error}
      </div>
    );
  }

  if (!provider) return null;

  const cfg = statusConfig[provider.status];

  return (
    <div
      style={{
        maxWidth: 1100,
        margin: "0 auto",
        padding: "32px",
      }}
    >
      {/* Header */}
      <div
        style={{
          marginBottom: 28,
        }}
      >
        <h1
          style={{
            margin: 0,
            fontSize: 28,
            fontWeight: 700,
            color: "#111",
            letterSpacing: "-0.8px",
          }}
        >
          Provider Details
        </h1>

        <p
          style={{
            marginTop: 6,
            color: "#777",
            fontSize: 14,
          }}
        >
          Review provider information and profile
        </p>
      </div>

      {/* Top Card */}
      <div
        style={{
          background: "#fff",
          border: "1px solid #e8e8e8",
          borderRadius: 18,
          padding: 28,
          marginBottom: 22,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "space-between",
            gap: 20,
            flexWrap: "wrap",
          }}
        >
          {/* Left */}
          <div
            style={{
              display: "flex",
              gap: 18,
              alignItems: "center",
            }}
          >
            <div
              style={{
                width: 74,
                height: 74,
                borderRadius: "50%",
                background: "#111",
                color: "#fff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 28,
                fontWeight: 700,
              }}
            >
              {provider.businessName?.charAt(0)?.toUpperCase()}
            </div>

            <div>
              <h2
                style={{
                  margin: 0,
                  fontSize: 24,
                  fontWeight: 600,
                  color: "#111",
                }}
              >
                {provider.businessName}
              </h2>

              <p
                style={{
                  margin: "6px 0 0",
                  color: "#888",
                  fontSize: 14,
                }}
              >
                Provider ID #{provider.id}
              </p>

              <div
                style={{
                  marginTop: 12,
                }}
              >
                <span
                  style={{
                    background: cfg.bg,
                    color: cfg.text,
                    padding: "6px 12px",
                    borderRadius: 999,
                    fontSize: 12,
                    fontWeight: 600,
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 6,
                  }}
                >
                  <span
                    style={{
                      width: 7,
                      height: 7,
                      borderRadius: "50%",
                      background: cfg.dot,
                    }}
                  />

                  {provider.status}
                </span>
              </div>
            </div>
          </div>

          {/* Right */}
          <div
            style={{
              display: "flex",
              gap: 10,
            }}
          >
            <button
              style={{
                background: "#111",
                color: "#fff",
                border: "none",
                borderRadius: 10,
                padding: "10px 18px",
                fontSize: 13,
                fontWeight: 500,
                cursor: "pointer",
              }}
            >
              Approve
            </button>

            <button
              style={{
                background: "#fff",
                color: "#dc2626",
                border: "1px solid #fecaca",
                borderRadius: 10,
                padding: "10px 18px",
                fontSize: 13,
                fontWeight: 500,
                cursor: "pointer",
              }}
            >
              Reject
            </button>
          </div>
        </div>
      </div>

      {/* Info Grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1.3fr 0.7fr",
          gap: 22,
        }}
      >
        {/* Left Section */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 22,
          }}
        >
          {/* About */}
          <div
            style={{
              background: "#fff",
              border: "1px solid #e8e8e8",
              borderRadius: 18,
              padding: 24,
            }}
          >
            <h3
              style={{
                marginTop: 0,
                marginBottom: 16,
                fontSize: 16,
                color: "#111",
              }}
            >
              About
            </h3>

            <p
              style={{
                margin: 0,
                color: "#666",
                lineHeight: 1.7,
                fontSize: 14,
              }}
            >
              {provider.bio}
            </p>
          </div>

          {/* Contact */}
          <div
            style={{
              background: "#fff",
              border: "1px solid #e8e8e8",
              borderRadius: 18,
              padding: 24,
            }}
          >
            <h3
              style={{
                marginTop: 0,
                marginBottom: 18,
                fontSize: 16,
                color: "#111",
              }}
            >
              Contact Information
            </h3>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
                gap: 18,
              }}
            >
              <div>
                <p
                  style={{
                    margin: 0,
                    color: "#999",
                    fontSize: 12,
                  }}
                >
                  Phone
                </p>

                <h4
                  style={{
                    margin: "6px 0 0",
                    color: "#111",
                    fontSize: 15,
                  }}
                >
                  {provider.phone}
                </h4>
              </div>

              <div>
                <p
                  style={{
                    margin: 0,
                    color: "#999",
                    fontSize: 12,
                  }}
                >
                  Experience
                </p>

                <h4
                  style={{
                    margin: "6px 0 0",
                    color: "#111",
                    fontSize: 15,
                  }}
                >
                  {provider.experience} Years
                </h4>
              </div>

              <div>
                <p
                  style={{
                    margin: 0,
                    color: "#999",
                    fontSize: 12,
                  }}
                >
                  City
                </p>

                <h4
                  style={{
                    margin: "6px 0 0",
                    color: "#111",
                    fontSize: 15,
                  }}
                >
                  {provider.city}
                </h4>
              </div>

              <div>
                <p
                  style={{
                    margin: 0,
                    color: "#999",
                    fontSize: 12,
                  }}
                >
                  Area
                </p>

                <h4
                  style={{
                    margin: "6px 0 0",
                    color: "#111",
                    fontSize: 15,
                  }}
                >
                  {provider.area}
                </h4>
              </div>
            </div>
          </div>
        </div>

        {/* Right Section */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 22,
          }}
        >
          {/* Availability */}
          <div
            style={{
              background: "#fff",
              border: "1px solid #e8e8e8",
              borderRadius: 18,
              padding: 24,
            }}
          >
            <h3
              style={{
                marginTop: 0,
                marginBottom: 18,
                fontSize: 16,
                color: "#111",
              }}
            >
              Availability
            </h3>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
              }}
            >
              <div
                style={{
                  width: 10,
                  height: 10,
                  borderRadius: "50%",
                  background: provider.isAvailable ? "#16a34a" : "#dc2626",
                }}
              />

              <span
                style={{
                  fontSize: 14,
                  color: "#555",
                  fontWeight: 500,
                }}
              >
                {provider.isAvailable ? "Available" : "Unavailable"}
              </span>
            </div>
          </div>

          {/* Metadata */}
          <div
            style={{
              background: "#fff",
              border: "1px solid #e8e8e8",
              borderRadius: 18,
              padding: 24,
            }}
          >
            <h3
              style={{
                marginTop: 0,
                marginBottom: 18,
                fontSize: 16,
                color: "#111",
              }}
            >
              Metadata
            </h3>

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 18,
              }}
            >
              <div>
                <p
                  style={{
                    margin: 0,
                    color: "#999",
                    fontSize: 12,
                  }}
                >
                  Created At
                </p>

                <h4
                  style={{
                    margin: "6px 0 0",
                    color: "#111",
                    fontSize: 14,
                  }}
                >
                  {new Date(provider.createdAt).toLocaleString("en-IN")}
                </h4>
              </div>

              <div>
                <p
                  style={{
                    margin: 0,
                    color: "#999",
                    fontSize: 12,
                  }}
                >
                  Last Updated
                </p>

                <h4
                  style={{
                    margin: "6px 0 0",
                    color: "#111",
                    fontSize: 14,
                  }}
                >
                  {new Date(provider.updatedAt).toLocaleString("en-IN")}
                </h4>
              </div>

              <div>
                <p
                  style={{
                    margin: 0,
                    color: "#999",
                    fontSize: 12,
                  }}
                >
                  User ID
                </p>

                <h4
                  style={{
                    margin: "6px 0 0",
                    color: "#111",
                    fontSize: 14,
                  }}
                >
                  #{provider.userId}
                </h4>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProviderDetails;
