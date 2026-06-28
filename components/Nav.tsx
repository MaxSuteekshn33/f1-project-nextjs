"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { onAuthStateChanged, signOut, User } from "firebase/auth";
import { auth } from "@/lib/firebase";

const NAV_ITEMS = [
  { href: "/", icon: "🏠", label: "HOME", tooltip: "Home · About The Project" },
  { href: "/goat-simulator", icon: "🐐", label: "GOAT", tooltip: "GOAT Simulator" },
  { href: "/comments", icon: "💬", label: "DISCUSS", tooltip: "Discussion · Debate Freely" },
  { href: "/f1-guide", icon: "🏎", label: "GUIDE", tooltip: "F1 Beginner's Guide" },
  { href: "/know-your-drivers", icon: "⚡", label: "DRIVERS", tooltip: "Know Your Drivers" },
];

export default function Nav({ onLoginClick }: { onLoginClick?: () => void }) {
  const pathname = usePathname();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, setUser);
    return unsub;
  }, []);

  const handleSignOut = () => signOut(auth);

  return (
    <nav
      style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 10000,
        background: "rgba(12,11,24,0.94)", backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        borderBottom: "1px solid rgba(177,151,252,0.18)",
        boxShadow: "0 4px 32px rgba(0,0,0,0.5), 0 0 40px rgba(177,151,252,0.06)",
        height: 64,
      }}
    >
      <div style={{ maxWidth: 980, margin: "0 auto", padding: "0 28px", display: "flex", alignItems: "center", justifyContent: "space-between", height: 64 }}>
        {/* Brand */}
        <Link href="/" style={{ display: "flex", alignItems: "center", gap: 4, textDecoration: "none", flexShrink: 0 }}>
          <div style={{ display: "flex", flexDirection: "column", lineHeight: 1 }}>
            <span style={{ fontFamily: "var(--font-archivo-narrow)", fontWeight: 800, fontSize: 22, color: "#d0bfff", letterSpacing: "-0.02em" }}>F1</span>
            <span style={{ fontFamily: "var(--font-archivo-narrow)", fontWeight: 700, fontSize: 10, color: "#d4cef0", letterSpacing: "0.1em", textTransform: "uppercase" }}>PROJECT</span>
          </div>
        </Link>

        {/* Center tabs */}
        <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
          {NAV_ITEMS.map(({ href, icon, label, tooltip }) => {
            const active = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                style={{
                  position: "relative", display: "flex", flexDirection: "column",
                  alignItems: "center", gap: 2, padding: "8px 14px",
                  textDecoration: "none", borderRadius: 14,
                  background: active ? "rgba(177,151,252,0.25)" : "transparent",
                  boxShadow: active ? "0 0 16px rgba(177,151,252,0.2)" : "none",
                  transition: "all 0.2s ease",
                }}
                className="nav-tab-link"
              >
                <span style={{ fontSize: 18, lineHeight: 1 }}>{icon}</span>
                <span style={{
                  fontFamily: "var(--font-jetbrains)", fontWeight: 500, fontSize: 8,
                  letterSpacing: "0.12em", textTransform: "uppercase",
                  color: active ? "#d0bfff" : "rgba(155,148,192,1)",
                }}>
                  {label}
                </span>
                {active && (
                  <span style={{
                    position: "absolute", bottom: -1, left: "50%", transform: "translateX(-50%)",
                    width: 20, height: 2, background: "#d0bfff", borderRadius: "2px 2px 0 0",
                  }} />
                )}
                {/* Tooltip */}
                <div style={{
                  position: "absolute", top: "calc(100% + 10px)", left: "50%",
                  transform: "translateX(-50%)",
                  background: "rgba(14,12,31,0.95)", border: "1px solid rgba(177,151,252,0.22)",
                  borderRadius: 12, padding: "8px 14px",
                  fontFamily: "var(--font-inter)", fontWeight: 500, fontSize: 12,
                  color: "#fff", whiteSpace: "nowrap",
                  boxShadow: "0 8px 24px rgba(0,0,0,0.6), 0 0 16px rgba(177,151,252,0.15)",
                  pointerEvents: "none", opacity: 0, transition: "opacity 0.18s ease",
                }} className="nav-tooltip">
                  {tooltip}
                </div>
              </Link>
            );
          })}
        </div>

        {/* Right — auth */}
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          {user ? (
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{
                width: 36, height: 36, borderRadius: "50%", overflow: "hidden",
                border: "2px solid rgba(177,151,252,0.5)",
                background: "#e8303a", display: "flex", alignItems: "center", justifyContent: "center",
                fontFamily: "var(--font-archivo)", fontWeight: 900, fontSize: 14, color: "#fff",
                flexShrink: 0,
              }}>
                {user.photoURL
                  ? <img src={user.photoURL} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  : (user.displayName || user.email || "?")[0].toUpperCase()
                }
              </div>
              <button
                onClick={handleSignOut}
                style={{
                  fontFamily: "var(--font-jetbrains)", fontWeight: 500, fontSize: 9,
                  letterSpacing: "0.14em", textTransform: "uppercase",
                  background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)",
                  color: "rgba(255,255,255,0.55)", borderRadius: 8, padding: "6px 14px",
                  cursor: "pointer",
                }}
              >
                Sign Out
              </button>
            </div>
          ) : (
            <button
              onClick={onLoginClick}
              style={{
                fontFamily: "var(--font-archivo-narrow)", fontWeight: 800, fontSize: 12,
                letterSpacing: "0.06em", textTransform: "uppercase",
                background: "#e8303a", color: "#fff", border: "none",
                borderRadius: 9, padding: "9px 20px", cursor: "pointer",
              }}
            >
              Sign In
            </button>
          )}
        </div>
      </div>

      <style>{`
        .nav-tab-link:hover { background: rgba(177,151,252,0.15) !important; }
        .nav-tab-link:hover .nav-tooltip { opacity: 1 !important; }
        @media (max-width: 640px) {
          .nav-tab-link span:last-of-type { display: none; }
          .nav-tab-link { padding: 8px 10px !important; }
        }
      `}</style>
    </nav>
  );
}
