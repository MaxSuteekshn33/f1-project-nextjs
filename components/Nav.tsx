"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { onAuthStateChanged, signOut, User } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { Home, Trophy, MessageSquare, BookOpen, Users, X } from "@/components/Icons";

const NAV_ITEMS = [
  { href: "/",                  Icon: Home,          label: "HOME",    tooltip: "Home · About The Project" },
  { href: "/goat-simulator",    Icon: Trophy,        label: "GOAT",    tooltip: "GOAT Simulator" },
  { href: "/comments",          Icon: MessageSquare, label: "DISCUSS", tooltip: "Discussion · Debate Freely" },
  { href: "/f1-guide",          Icon: BookOpen,      label: "GUIDE",   tooltip: "F1 Beginner's Guide" },
  { href: "/know-your-drivers", Icon: Users,         label: "DRIVERS", tooltip: "Know Your Drivers" },
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
    <nav style={{
      position: "fixed", top: 0, left: 0, right: 0, zIndex: 10000,
      background: "rgba(4,3,10,0.92)", backdropFilter: "blur(24px)",
      WebkitBackdropFilter: "blur(24px)",
      borderBottom: "1px solid rgba(255,255,255,0.08)",
      boxShadow: "0 1px 0 rgba(255,255,255,0.04), 0 8px 32px rgba(0,0,0,0.6)",
      height: 60,
    }}>
      <div style={{ maxWidth: 980, margin: "0 auto", padding: "0 24px", display: "flex", alignItems: "center", justifyContent: "space-between", height: 60 }}>

        {/* Brand — Orbitron for F1 HUD feel */}
        <Link href="/" style={{ display: "flex", alignItems: "baseline", gap: 6, textDecoration: "none", flexShrink: 0 }}>
          <span style={{ fontFamily: "var(--font-orbitron)", fontWeight: 900, fontSize: 18, color: "#e8303a", letterSpacing: "-0.01em", lineHeight: 1 }}>F1</span>
          <span style={{ fontFamily: "var(--font-jetbrains)", fontWeight: 500, fontSize: 9, color: "rgba(255,255,255,0.35)", letterSpacing: "0.18em", textTransform: "uppercase" }}>PROJECT</span>
        </Link>

        {/* Center nav — icon + label */}
        <div style={{ display: "flex", alignItems: "center", gap: 2 }}>
          {NAV_ITEMS.map(({ href, Icon, label, tooltip }) => {
            const active = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                className="nav-tab"
                style={{
                  position: "relative", display: "flex", flexDirection: "column",
                  alignItems: "center", gap: 3, padding: "7px 13px",
                  textDecoration: "none", borderRadius: 12,
                  background: active ? "rgba(0,200,180,0.10)" : "transparent",
                  border: active ? "1px solid rgba(0,200,180,0.18)" : "1px solid transparent",
                  transition: "all 0.18s ease",
                }}
              >
                {/* SVG icon — 18px, clean stroke */}
                <Icon
                  size={16}
                  strokeWidth={active ? 2.2 : 1.8}
                  style={{ color: active ? "#00c8b4" : "rgba(255,255,255,0.42)", transition: "color 0.18s ease" }}
                />
                <span style={{
                  fontFamily: "var(--font-jetbrains)", fontWeight: 600, fontSize: 7,
                  letterSpacing: "0.14em", textTransform: "uppercase",
                  color: active ? "#00c8b4" : "rgba(255,255,255,0.35)",
                  transition: "color 0.18s ease",
                }}>
                  {label}
                </span>

                {/* Active underline */}
                {active && (
                  <span style={{
                    position: "absolute", bottom: -1, left: "50%", transform: "translateX(-50%)",
                    width: 16, height: 2, background: "#00c8b4",
                    borderRadius: "2px 2px 0 0",
                    boxShadow: "0 0 8px rgba(0,200,180,0.8)",
                  }} />
                )}

                {/* Hover tooltip */}
                <div className="nav-tooltip" style={{
                  position: "absolute", top: "calc(100% + 10px)", left: "50%",
                  transform: "translateX(-50%)",
                  background: "rgba(4,3,10,0.96)", border: "1px solid rgba(255,255,255,0.10)",
                  borderRadius: 10, padding: "7px 12px",
                  fontFamily: "var(--font-inter)", fontWeight: 500, fontSize: 11,
                  color: "rgba(255,255,255,0.85)", whiteSpace: "nowrap",
                  boxShadow: "0 8px 24px rgba(0,0,0,0.6)",
                  pointerEvents: "none", opacity: 0, transition: "opacity 0.15s ease",
                }}>
                  {tooltip}
                </div>
              </Link>
            );
          })}
        </div>

        {/* Auth */}
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          {user ? (
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <div style={{
                width: 32, height: 32, borderRadius: "50%", overflow: "hidden",
                border: "1.5px solid rgba(0,200,180,0.4)",
                background: "#e8303a", display: "flex", alignItems: "center", justifyContent: "center",
                fontFamily: "var(--font-archivo)", fontWeight: 900, fontSize: 12, color: "#fff",
                flexShrink: 0,
              }}>
                {user.photoURL
                  ? <img src={user.photoURL} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  : (user.displayName || user.email || "?")[0].toUpperCase()
                }
              </div>
              <button onClick={handleSignOut} style={{
                display: "flex", alignItems: "center", gap: 5,
                fontFamily: "var(--font-jetbrains)", fontWeight: 500, fontSize: 9,
                letterSpacing: "0.12em", textTransform: "uppercase",
                background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.10)",
                color: "rgba(255,255,255,0.45)", borderRadius: 8, padding: "6px 12px",
                cursor: "pointer", transition: "all 0.18s",
              }}>
                <X size={10} strokeWidth={2} />
                Sign Out
              </button>
            </div>
          ) : (
            <button onClick={onLoginClick} style={{
              fontFamily: "var(--font-jetbrains)", fontWeight: 700, fontSize: 10,
              letterSpacing: "0.1em", textTransform: "uppercase",
              background: "transparent", color: "#00c8b4",
              border: "1.5px solid rgba(0,200,180,0.45)", borderRadius: 8,
              padding: "8px 18px", cursor: "pointer",
              transition: "all 0.18s",
              boxShadow: "0 0 0 0 rgba(0,200,180,0)",
            }} className="nav-signin">
              Sign In
            </button>
          )}
        </div>
      </div>

      <style>{`
        .nav-tab:hover { background: rgba(255,255,255,0.06) !important; border-color: rgba(255,255,255,0.08) !important; }
        .nav-tab:hover .nav-tooltip { opacity: 1 !important; }
        .nav-signin:hover { background: rgba(0,200,180,0.10) !important; box-shadow: 0 0 16px rgba(0,200,180,0.2) !important; }
        @media (max-width: 640px) {
          .nav-tab span:last-child { display: none; }
          .nav-tab { padding: 8px 10px !important; }
        }
      `}</style>
    </nav>
  );
}
