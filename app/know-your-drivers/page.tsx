"use client";

import { useState } from "react";
import Nav from "@/components/Nav";
import AuthModal from "@/components/AuthModal";
import { DRIVERS, Driver } from "@/data/drivers";
import Link from "next/link";

const ERAS = [
  { key: "all", label: "All Eras" },
  { key: "1950s", label: "1950s Legends" },
  { key: "1960s", label: "1960s Heroes" },
  { key: "1970s", label: "1970s Icons" },
  { key: "1980s", label: "1980s Warriors" },
  { key: "1990s", label: "1990s Stars" },
  { key: "2000s", label: "2000s Champions" },
  { key: "modern", label: "Modern Era" },
];

const ATTRS: [keyof Driver, string, string][] = [
  ["pace", "🏎", "Pace"],
  ["quali", "⚡", "Qualifying"],
  ["racecraft", "🏁", "Racecraft"],
  ["wet", "☁️", "Wet"],
  ["tyres", "🛞", "Tyres"],
  ["consistency", "🚩", "Consistency"],
];

function statColor(v: number) {
  if (v >= 97) return "fill-blue";
  if (v >= 95) return "fill-green";
  if (v >= 91) return "fill-yellow";
  return "fill-red";
}
function valColor(v: number) {
  if (v >= 97) return "#818cf8";
  if (v >= 95) return "#34d399";
  if (v >= 91) return "#fcd34d";
  return "#f87171";
}

export default function KnowYourDriversPage() {
  const [authOpen, setAuthOpen] = useState(false);
  const [era, setEra] = useState("all");
  const [selected, setSelected] = useState<Driver | null>(null);

  const filtered = era === "all" ? DRIVERS : DRIVERS.filter(d => d.era === era);

  return (
    <>
      <div className="dotted-surface" />
      <Nav onLoginClick={() => setAuthOpen(true)} />
      <AuthModal open={authOpen} onClose={() => setAuthOpen(false)} />

      {/* Profile Modal */}
      {selected && (
        <div onClick={(e) => e.target === e.currentTarget && setSelected(null)} style={{
          position: "fixed", inset: 0, zIndex: 50000,
          background: "rgba(0,0,0,0.85)", backdropFilter: "blur(12px)",
          display: "flex", alignItems: "flex-start", justifyContent: "center",
          overflowY: "auto", padding: "20px 16px",
        }}>
          <div style={{
            background: "#0e0c1f", border: "1px solid rgba(177,151,252,0.2)",
            borderRadius: 28, width: "100%", maxWidth: 600, position: "relative",
            boxShadow: "0 24px 80px rgba(0,0,0,0.9)",
          }}>
            {/* Hero */}
            <div style={{ position: "relative", height: 200, overflow: "hidden", borderRadius: "28px 28px 0 0", background: "#0d2137" }}>
              <img src={selected.car} alt="" style={{ position: "absolute", right: 0, bottom: 0, height: "90%", objectFit: "contain", opacity: 0.5 }} onError={e => (e.currentTarget.style.display = "none")} />
              <img src={selected.photo} alt={selected.name} style={{ position: "absolute", left: 24, bottom: 0, height: "95%", objectFit: "contain" }} onError={e => (e.currentTarget.style.display = "none")} />
              <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, background: "linear-gradient(to top, rgba(14,12,31,1) 0%, transparent 100%)", height: 80 }} />
              <div style={{ position: "absolute", bottom: 14, left: 24 }}>
                <div style={{ fontFamily: "var(--font-jetbrains)", fontSize: 9, letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(255,255,255,0.5)", marginBottom: 2 }}>{selected.country}</div>
                <div style={{ fontFamily: "var(--font-archivo)", fontWeight: 900, fontSize: 26, textTransform: "uppercase", color: "#fff", lineHeight: 1 }}>{selected.name}</div>
              </div>
              <button onClick={() => setSelected(null)} style={{ position: "absolute", top: 16, right: 16, background: "rgba(255,255,255,0.1)", border: "none", borderRadius: "50%", width: 36, height: 36, color: "#fff", fontSize: 16, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>✕</button>
            </div>

            {/* Pills */}
            <div style={{ display: "flex", gap: 10, padding: "16px 24px", flexWrap: "wrap" }}>
              {[
                { icon: "🏆", val: selected.titles, lbl: "Titles" },
                { icon: "🏁", val: selected.wins, lbl: "Wins" },
                { icon: "⚡", val: selected.poles, lbl: "Poles" },
                { icon: "📅", val: selected.peak, lbl: "Peak" },
              ].map(p => (
                <div key={p.lbl} style={{ display: "flex", alignItems: "center", gap: 8, background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 14, padding: "8px 14px", flex: "0 0 auto" }}>
                  <span style={{ fontSize: 16 }}>{p.icon}</span>
                  <div>
                    <div style={{ fontFamily: "var(--font-archivo-narrow)", fontWeight: 800, fontSize: 18, color: "#fff", lineHeight: 1 }}>{p.val}</div>
                    <div style={{ fontFamily: "var(--font-jetbrains)", fontSize: 9, color: "rgba(255,255,255,0.4)", letterSpacing: "0.1em", textTransform: "uppercase" }}>{p.lbl}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Body */}
            <div style={{ padding: "0 24px 24px" }}>
              <SectionTitle>Performance Ratings</SectionTitle>
              <div style={{ display: "grid", gap: 8, marginBottom: 20 }}>
                {ATTRS.map(([attr, icon, lbl]) => {
                  const v = selected[attr] as number;
                  const pct = ((v - 70) / 30 * 100).toFixed(1);
                  return (
                    <div key={lbl} style={{ display: "grid", gridTemplateColumns: "20px 90px 1fr 32px", alignItems: "center", gap: 8 }}>
                      <span style={{ fontSize: 13, textAlign: "center" }}>{icon}</span>
                      <span style={{ fontFamily: "var(--font-jetbrains)", fontWeight: 700, fontSize: 10, letterSpacing: "0.08em", textTransform: "uppercase", color: "rgba(255,255,255,0.6)" }}>{lbl}</span>
                      <div style={{ height: 12, background: "rgba(0,0,0,0.3)", borderRadius: 99, overflow: "hidden", border: "1.5px solid rgba(255,255,255,0.08)" }}>
                        <div className={statColor(v)} style={{ height: "100%", borderRadius: 99, width: pct + "%" }} />
                      </div>
                      <span style={{ fontFamily: "var(--font-jetbrains)", fontSize: 14, fontWeight: 800, textAlign: "right", color: valColor(v) }}>{v}</span>
                    </div>
                  );
                })}
              </div>

              <SectionTitle>Career Story</SectionTitle>
              <p style={{ fontFamily: "var(--font-inter)", fontSize: 14, color: "rgba(255,255,255,0.7)", lineHeight: 1.7, marginBottom: 20, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 14, padding: "14px 16px" }}>{selected.bio}</p>

              <SectionTitle>Key Stats</SectionTitle>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, marginBottom: 20 }}>
                {selected.facts.map(f => (
                  <div key={f.k} style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 12, padding: "10px 12px", textAlign: "center" }}>
                    <div style={{ fontFamily: "var(--font-archivo-narrow)", fontWeight: 800, fontSize: 20, color: "#fff", lineHeight: 1, marginBottom: 4 }}>{f.v}</div>
                    <div style={{ fontFamily: "var(--font-jetbrains)", fontSize: 9, letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(255,255,255,0.4)" }}>{f.k}</div>
                  </div>
                ))}
              </div>

              <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderLeft: "3px solid rgba(255,255,255,0.25)", borderRadius: 14, padding: "14px 18px", marginBottom: 20, fontFamily: "var(--font-inter)", fontSize: 14, fontStyle: "italic", color: "rgba(255,255,255,0.6)", lineHeight: 1.6 }}>
                "{selected.quote}"
              </div>

              <Link href="/goat-simulator" style={{ display: "block", width: "100%", textAlign: "center", background: "linear-gradient(135deg, #e8303a 0%, #ff6b6b 100%)", color: "#fff", textDecoration: "none", borderRadius: 14, padding: "14px 24px", fontFamily: "var(--font-archivo-narrow)", fontWeight: 800, fontSize: 15, textTransform: "uppercase", letterSpacing: "0.05em" }}>
                ▶ Compare in the GOAT Simulator
              </Link>
            </div>
          </div>
        </div>
      )}

      <div className="page-content">
        <div className="ambient-bg" />

        <div style={{ maxWidth: 980, margin: "0 auto", padding: "40px 24px 80px", position: "relative", zIndex: 2 }}>

          <header style={{ textAlign: "center", marginBottom: 32 }}>
            <div style={{ fontFamily: "var(--font-saira)", fontWeight: 600, fontSize: 11, letterSpacing: "0.32em", color: "rgba(255,255,255,0.45)", textTransform: "uppercase", marginBottom: 10 }}>From Fangio to Verstappen · The Complete Guide</div>
            <h1 style={{ fontFamily: "var(--font-archivo)", fontWeight: 900, fontSize: "clamp(36px,8vw,68px)", lineHeight: 0.92, letterSpacing: "-0.02em", textTransform: "uppercase", color: "#fff" }}>
              Know Your <span style={{ color: "#e8303a" }}>Drivers</span>
            </h1>
            <div style={{ color: "rgba(255,255,255,0.4)", fontSize: 14, marginTop: 10, fontFamily: "var(--font-saira)", fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase" }}>
              Tap any driver to explore their stats, career & legacy
            </div>
          </header>

          {/* Era Filter */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 28, justifyContent: "center" }}>
            {ERAS.map(e => (
              <button key={e.key} onClick={() => setEra(e.key)} style={{
                fontFamily: "var(--font-saira)", fontWeight: 700, fontSize: 10, letterSpacing: "0.18em", textTransform: "uppercase",
                padding: "7px 18px", borderRadius: 8, cursor: "pointer", transition: "all 0.18s ease",
                background: era === e.key ? "#5a1aff" : "rgba(255,255,255,0.06)",
                color: era === e.key ? "#fff" : "rgba(255,255,255,0.5)",
                border: `1.5px solid ${era === e.key ? "#5a1aff" : "rgba(255,255,255,0.12)"}`,
                boxShadow: era === e.key ? "0 4px 16px rgba(90,26,255,0.3)" : "none",
              }}>
                {e.label}
              </button>
            ))}
          </div>

          {/* Driver Grid */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))", gap: 14 }}>
            {filtered.map(drv => (
              <div key={drv.key} onClick={() => setSelected(drv)} style={{
                background: "linear-gradient(160deg,#0e2a2a 0%,#0d2137 100%)",
                border: "1px solid rgba(0,200,180,0.2)", borderRadius: 20, overflow: "hidden",
                cursor: "pointer", transition: "transform 0.2s ease, box-shadow 0.2s ease",
                boxShadow: "0 4px 20px rgba(0,0,0,0.4), 0 0 20px rgba(0,200,180,0.06)",
                display: "flex", flexDirection: "column",
              }} className="driver-card-hover">
                <div style={{ height: 140, overflow: "hidden", position: "relative", background: "rgba(255,255,255,0.04)" }}>
                  <img src={drv.photo} alt={drv.name} style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "top center", display: "block" }} onError={e => (e.currentTarget.style.display = "none")} />
                </div>
                <div style={{ height: 4, background: drv.teamColor }} />
                <div style={{ padding: "10px 12px 14px" }}>
                  <div style={{ fontFamily: "var(--font-archivo)", fontWeight: 900, fontSize: 15, color: "#fff", lineHeight: 1.1, marginBottom: 2 }}>
                    {drv.name.split(" ").pop()}
                    <br />
                    <span style={{ fontSize: 10, color: "rgba(255,255,255,0.45)", fontFamily: "var(--font-saira)", fontWeight: 600, letterSpacing: 0 }}>{drv.name.split(" ").slice(0, -1).join(" ")}</span>
                  </div>
                  <div style={{ fontFamily: "var(--font-jetbrains)", fontSize: 9, letterSpacing: "0.12em", textTransform: "uppercase", color: "rgba(0,200,180,0.7)", marginBottom: 6 }}>{drv.team.split("·")[0].trim()}</div>
                  <div style={{ fontFamily: "var(--font-jetbrains)", fontSize: 9, color: "rgba(255,255,255,0.45)", letterSpacing: "0.06em" }}>
                    {drv.titles > 0 ? `🏆 ${drv.titles} Championship${drv.titles > 1 ? "s" : ""}` : `🎯 ${drv.wins} Race Wins`}
                  </div>
                  <div style={{ fontFamily: "var(--font-jetbrains)", fontSize: 8, letterSpacing: "0.08em", textTransform: "uppercase", color: "rgba(255,255,255,0.25)", marginTop: 4 }}>{drv.era.toUpperCase()} · {drv.peak}</div>
                </div>
              </div>
            ))}
          </div>

        </div>
      </div>

      <footer style={{ textAlign: "center", fontFamily: "var(--font-jetbrains)", fontWeight: 500, fontSize: 10, color: "rgba(255,255,255,0.25)", letterSpacing: "0.15em", textTransform: "uppercase", padding: "28px 0 36px", borderTop: "1px solid rgba(255,255,255,0.07)", position: "relative", zIndex: 1 }}>
        KNOW YOUR DRIVERS · <span style={{ color: "#f87171" }}>F1 PROJECT</span> · DATA BASED ON HISTORICAL RECORDS
      </footer>

      <style>{`
        .driver-card-hover:hover { transform:translateY(-3px) !important; box-shadow:0 10px 32px rgba(0,0,0,0.5), 0 0 30px rgba(0,200,180,0.1) !important; }
        @media(max-width:480px) { [style*="auto-fill"] { grid-template-columns:repeat(2,1fr) !important; } }
      `}</style>
    </>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return <div style={{ fontFamily: "var(--font-jetbrains)", fontWeight: 700, fontSize: 10, letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(255,255,255,0.35)", marginBottom: 12 }}>{children}</div>;
}
