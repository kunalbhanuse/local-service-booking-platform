import { useState } from "react";
import { useNavigate } from "react-router-dom";

const services = [
  {
    icon: "💧",
    title: "Plumbing",
    desc: "Leak repairs, pipe installations & maintenance",
    count: "48 providers",
    color: "#f0f4ff",
    iconColor: "#2a45a0",
  },
  {
    icon: "⚡",
    title: "Electrical",
    desc: "Wiring, safety checks & appliance fitting",
    count: "62 providers",
    color: "#fffbf0",
    iconColor: "#a07020",
  },
  {
    icon: "✨",
    title: "Cleaning",
    desc: "Residential & commercial deep cleaning",
    count: "91 providers",
    color: "#f0faf5",
    iconColor: "#2d7a4f",
  },
  {
    icon: "🔨",
    title: "Carpentry",
    desc: "Custom furniture, repairs & installations",
    count: "37 providers",
    color: "#fdf0f0",
    iconColor: "#a03030",
  },
];

const activity = [
  {
    initials: "RK",
    name: "Rahul K.",
    desc: "completed a plumbing job at 14 Oak St",
    time: "Today, 10:32 AM",
    status: "Completed",
    statusStyle: { background: "#f0faf5", color: "#2d7a4f" },
  },
  {
    initials: "PM",
    name: "Priya M.",
    desc: "scheduled an electrical inspection for tomorrow",
    time: "Today, 9:14 AM",
    status: "Scheduled",
    statusStyle: { background: "#fffbf0", color: "#a07020" },
  },
  {
    initials: "AV",
    name: "Aryan V.",
    desc: "is on-site for a deep cleaning at 7 Maple Ave",
    time: "Today, 8:45 AM",
    status: "In progress",
    statusStyle: { background: "#f0f4ff", color: "#2a45a0" },
  },
  {
    initials: "NS",
    name: "Neha S.",
    desc: "New booking request — carpentry repair",
    time: "Yesterday, 6:00 PM",
    status: "Awaiting",
    statusStyle: { background: "#fffbf0", color: "#a07020" },
  },
];

const stats = [
  { num: "0k+", label: "Active providers" },
  { num: "0%", label: "Customer satisfaction" },
  { num: "0k", label: "Jobs completed" },
  { num: "0★", label: "Average rating" },
];

export default function Home() {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#fff",
        color: "#1a1a1a",
        fontFamily: "'DM Sans', sans-serif",
      }}
    >
      {/* Google Font */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display&family=DM+Sans:wght@400;500&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        a { text-decoration: none; color: #666; }
        a:hover { color: #111; }
      `}</style>

      {/* Navbar */}
      <nav
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "1.25rem 2rem",
          borderBottom: "0.5px solid #e8e8e8",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div
            style={{
              width: 36,
              height: 36,
              background: "#111",
              borderRadius: 8,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <span style={{ color: "#fff", fontSize: 18 }}>🔧</span>
          </div>
          <span
            style={{
              fontWeight: 500,
              fontSize: 15,
              letterSpacing: "-0.3px",
              color: "#111",
            }}
          >
            KB
          </span>
        </div>

        <div style={{ display: "flex", gap: "2rem" }}>
          {["Dashboard", "Services", "Bookings", "Reports"].map((link) => (
            <a key={link} href="#" style={{ fontSize: 14 }}>
              {link}
            </a>
          ))}
        </div>

        <div style={{ display: "flex", gap: 12 }}>
          <button
            onClick={() => navigate("/signup")}
            style={{
              border: "0.5px solid #ddd",
              background: "#fff",
              borderRadius: 8,
              padding: "8px 18px",
              fontSize: 13,
              cursor: "pointer",
              color: "#333",
            }}
          >
            Sign in
          </button>
          <button
            onClick={() => navigate("/login")}
            style={{
              border: "none",
              background: "#111",
              color: "#fff",
              borderRadius: 8,
              padding: "8px 18px",
              fontSize: 13,
              cursor: "pointer",
            }}
          >
            Login
          </button>
        </div>
      </nav>

      {/* Hero */}
      <div
        style={{
          padding: "5rem 2rem 3rem",
          maxWidth: 760,
          margin: "0 auto",
          textAlign: "center",
        }}
      >
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
            background: "#f5f5f5",
            border: "0.5px solid #e8e8e8",
            borderRadius: 20,
            padding: "5px 14px",
            fontSize: 12,
            color: "#555",
            marginBottom: "1.75rem",
          }}
        >
          <span
            style={{
              width: 6,
              height: 6,
              background: "#111",
              borderRadius: "50%",
              display: "inline-block",
            }}
          />
          Platform By <span className=" text-red-500"> KUNAL BHANUSE</span>
        </div>

        <h1
          style={{
            fontFamily: "'DM Serif Display', serif",
            fontSize: "clamp(2.4rem, 5vw, 3.8rem)",
            lineHeight: 1.12,
            letterSpacing: "-1px",
            color: "#111",
            marginBottom: "1.25rem",
          }}
        >
          Manage every local
          <br />
          service,{" "}
          <em style={{ fontStyle: "italic", color: "#555" }}>effortlessly</em>
        </h1>

        <p
          style={{
            fontSize: 16,
            color: "#666",
            lineHeight: 1.7,
            maxWidth: 500,
            margin: "0 auto 2.25rem",
          }}
        >
          One platform to schedule, track, and grow your local service business
          — from bookings to billing.
        </p>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 12,
            flexWrap: "wrap",
          }}
        >
          <button
            style={{
              background: "#111",
              color: "#fff",
              border: "none",
              borderRadius: 10,
              padding: "13px 28px",
              fontSize: 14,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: 8,
            }}
          >
            🚀 Start for free
          </button>
          <button
            style={{
              background: "#fff",
              color: "#333",
              border: "0.5px solid #ddd",
              borderRadius: 10,
              padding: "13px 28px",
              fontSize: 14,
              cursor: "pointer",
            }}
          >
            Watch demo
          </button>
        </div>
      </div>

      {/* Stats */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          gap: "3rem",
          padding: "2.5rem 2rem",
          borderTop: "0.5px solid #f0f0f0",
          borderBottom: "0.5px solid #f0f0f0",
          margin: "2rem 0",
          flexWrap: "wrap",
        }}
      >
        {stats.map((s) => (
          <div key={s.label} style={{ textAlign: "center" }}>
            <div
              style={{
                fontFamily: "'DM Serif Display', serif",
                fontSize: "2rem",
                color: "#111",
              }}
            >
              {s.num}
            </div>
            <div style={{ fontSize: 12, color: "#999", marginTop: 2 }}>
              {s.label}
            </div>
          </div>
        ))}
      </div>

      {/* Services */}
      <div
        style={{ padding: "2rem 2rem 3rem", maxWidth: 960, margin: "0 auto" }}
      >
        <div
          style={{
            fontSize: 11,
            letterSpacing: "1.5px",
            textTransform: "uppercase",
            color: "#aaa",
            marginBottom: "1.25rem",
          }}
        >
          Service categories
        </div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: 12,
          }}
        >
          {services.map((s) => (
            <div
              key={s.title}
              style={{
                background: "#fff",
                border: "0.5px solid #e8e8e8",
                borderRadius: 14,
                padding: "1.25rem",
                cursor: "pointer",
                transition: "border-color 0.2s",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.borderColor = "#bbb")}
              onMouseLeave={(e) =>
                (e.currentTarget.style.borderColor = "#e8e8e8")
              }
            >
              <div
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 10,
                  background: s.color,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: "1rem",
                  fontSize: 20,
                }}
              >
                {s.icon}
              </div>
              <h3
                style={{
                  fontSize: 14,
                  fontWeight: 500,
                  color: "#111",
                  marginBottom: 4,
                }}
              >
                {s.title}
              </h3>
              <p style={{ fontSize: 12, color: "#999", lineHeight: 1.5 }}>
                {s.desc}
              </p>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginTop: "1rem",
                }}
              >
                <span style={{ fontSize: 11, color: "#bbb" }}>{s.count}</span>
                <span style={{ fontSize: 16, color: "#ccc" }}>→</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      <div style={{ padding: "0 2rem 3rem", maxWidth: 960, margin: "0 auto" }}>
        <div
          style={{
            fontSize: 11,
            letterSpacing: "1.5px",
            textTransform: "uppercase",
            color: "#aaa",
            marginBottom: "1.25rem",
          }}
        >
          Recent activity
        </div>
        <div
          style={{
            border: "0.5px solid #e8e8e8",
            borderRadius: 14,
            overflow: "hidden",
          }}
        >
          {activity.map((a, i) => (
            <div
              key={i}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 14,
                padding: "1rem 1.25rem",
                borderBottom:
                  i < activity.length - 1 ? "0.5px solid #f5f5f5" : "none",
              }}
            >
              <div
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: "50%",
                  background: "#f0f0f0",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 12,
                  fontWeight: 500,
                  color: "#555",
                  flexShrink: 0,
                }}
              >
                {a.initials}
              </div>
              <div style={{ flex: 1 }}>
                <p style={{ fontSize: 13, color: "#333" }}>
                  <strong>{a.name}</strong> {a.desc}
                </p>
                <span style={{ fontSize: 11, color: "#bbb" }}>{a.time}</span>
              </div>
              <span
                style={{
                  fontSize: 11,
                  padding: "3px 10px",
                  borderRadius: 20,
                  ...a.statusStyle,
                }}
              >
                {a.status}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div
        style={{
          textAlign: "center",
          padding: "2rem",
          fontSize: 12,
          color: "#ccc",
          borderTop: "0.5px solid #f0f0f0",
        }}
      >
        © 2026 ServiQ · Local Service Management Platform
      </div>
    </div>
  );
}
