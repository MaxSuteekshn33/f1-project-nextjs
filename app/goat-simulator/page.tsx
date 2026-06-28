"use client";

import { useState, useCallback, useEffect } from "react";
import Nav from "@/components/Nav";
import AuthModal from "@/components/AuthModal";
import { GOAT_DRIVERS, Driver } from "@/data/drivers";
import { useSimulation } from "@/lib/useSimulation";
import { QUIZ_QUESTIONS } from "@/data/quiz";

type WeatherKey = "dry" | "damp" | "wet";

interface CircuitInfo {
  name: string;
  wetFactor: number;
  tyreDemand: number;
  overtakeFreq: number;
  paceWeight: number;
  qualiWeight: number;
  racecraftWeight: number;
  trackPath: string; // SVG path for animated track
}

const CIRCUITS: Record<string, CircuitInfo> = {
  monaco:      { name:"Monaco",       wetFactor:1.9, tyreDemand:1.1, overtakeFreq:0.5, paceWeight:0.25, qualiWeight:0.45, racecraftWeight:0.3,  trackPath:"M 20 80 L 20 30 Q 20 20 30 20 L 100 20 Q 130 20 140 40 L 160 70 L 180 70 Q 200 70 200 50 L 200 30 Q 200 15 215 15 L 260 15 Q 270 15 270 30 L 270 80 Q 270 95 255 95 L 35 95 Q 20 95 20 80 Z" },
  silverstone: { name:"Silverstone",  wetFactor:1.3, tyreDemand:1.2, overtakeFreq:1.2, paceWeight:0.4,  qualiWeight:0.3,  racecraftWeight:0.3,  trackPath:"M 30 60 L 30 30 Q 30 20 45 20 L 90 20 Q 115 20 130 35 L 160 55 Q 175 65 200 60 L 240 50 Q 260 45 265 30 L 265 25 Q 265 15 250 15 L 180 15 Q 165 10 155 25 L 140 45 Q 125 60 100 60 L 30 60 Z" },
  spa:         { name:"Spa",          wetFactor:1.6, tyreDemand:1.1, overtakeFreq:1.3, paceWeight:0.4,  qualiWeight:0.3,  racecraftWeight:0.3,  trackPath:"M 25 70 L 25 40 Q 25 15 55 15 L 120 15 L 180 35 Q 210 45 240 30 L 260 20 Q 275 12 275 30 L 275 55 Q 275 75 255 80 L 160 85 Q 130 90 110 75 L 80 55 Q 55 40 40 65 L 35 70 Q 30 80 25 70 Z" },
  monza:       { name:"Monza",        wetFactor:1.1, tyreDemand:0.9, overtakeFreq:1.5, paceWeight:0.5,  qualiWeight:0.3,  racecraftWeight:0.2,  trackPath:"M 20 75 L 20 25 Q 20 12 35 12 L 265 12 Q 280 12 280 25 L 280 45 Q 280 58 265 58 L 220 58 L 220 75 Q 220 90 205 90 L 35 90 Q 20 90 20 75 Z" },
  suzuka:      { name:"Suzuka",       wetFactor:1.4, tyreDemand:1.2, overtakeFreq:0.8, paceWeight:0.4,  qualiWeight:0.35, racecraftWeight:0.25, trackPath:"M 25 75 L 25 40 Q 25 15 50 15 L 100 15 Q 130 15 145 35 L 155 55 Q 165 70 180 60 L 220 35 Q 245 20 265 30 L 270 35 Q 278 50 265 65 L 200 85 Q 175 95 155 80 L 130 60 Q 115 48 95 55 L 60 70 L 40 80 Q 30 85 25 75 Z" },
  nurburgring: { name:"Nürburgring", wetFactor:1.7, tyreDemand:1.3, overtakeFreq:0.9, paceWeight:0.35, qualiWeight:0.3,  racecraftWeight:0.35, trackPath:"M 20 70 L 20 40 Q 20 20 40 15 L 80 12 Q 110 10 130 25 L 160 45 Q 175 55 195 50 L 225 40 Q 250 30 265 45 L 275 60 Q 280 75 265 82 L 200 88 Q 175 92 155 78 L 120 55 Q 100 42 75 50 L 50 65 Q 35 75 20 70 Z" },
  interlagos:  { name:"Interlagos",  wetFactor:1.5, tyreDemand:1.1, overtakeFreq:1.1, paceWeight:0.35, qualiWeight:0.3,  racecraftWeight:0.35, trackPath:"M 30 72 L 30 35 Q 30 18 50 15 L 130 12 Q 155 10 170 28 L 185 50 Q 195 65 215 60 L 255 48 Q 272 42 272 60 L 272 72 Q 272 88 255 88 L 50 88 Q 30 88 30 72 Z" },
  imola:       { name:"Imola",       wetFactor:1.3, tyreDemand:1.1, overtakeFreq:0.7, paceWeight:0.35, qualiWeight:0.35, racecraftWeight:0.3,  trackPath:"M 22 78 L 22 35 Q 22 18 40 15 L 100 12 Q 130 10 150 28 L 175 52 Q 190 68 215 62 L 255 45 Q 272 38 272 56 L 272 78 Q 272 92 255 92 L 40 92 Q 22 92 22 78 Z" },
};

const WEATHER_LABELS: Record<WeatherKey, string> = { dry: "Dry", damp: "Damp / Mixed", wet: "Wet" };

function simulateRace(d1: Driver, d2: Driver, circuit: CircuitInfo, weather: WeatherKey, runs = 100000): [number, number] {
  let w1 = 0, w2 = 0;
  const wetM = weather === "dry" ? 0 : weather === "damp" ? 0.5 : 1.0;
  for (let i = 0; i < runs; i++) {
    const s1 = calcScore(d1, circuit, wetM);
    const s2 = calcScore(d2, circuit, wetM);
    if (s1 > s2) w1++; else w2++;
  }
  return [w1, w2];
}

function calcScore(d: Driver, c: CircuitInfo, wetM: number): number {
  const base = (
    d.pace       * c.paceWeight +
    d.quali      * c.qualiWeight +
    d.racecraft  * c.racecraftWeight +
    d.wet        * wetM * c.wetFactor * 0.15 +
    d.tyres      * c.tyreDemand   * 0.1  +
    d.consistency               * 0.05
  );
  return base + (Math.random() - 0.5) * 12;
}

function statColor(v: number): string {
  if (v >= 97) return "fill-blue";
  if (v >= 95) return "fill-green";
  if (v >= 91) return "fill-yellow";
  return "fill-red";
}
function valColor(v: number): string {
  if (v >= 97) return "#818cf8";
  if (v >= 95) return "#34d399";
  if (v >= 91) return "#fcd34d";
  return "#f87171";
}

const ATTRS: [keyof Driver, string, string][] = [
  ["pace", "🏎", "Pace"],
  ["quali", "⚡", "Qualifying"],
  ["racecraft", "🏁", "Racecraft"],
  ["wet", "☁️", "Wet"],
  ["tyres", "🛞", "Tyres"],
  ["consistency", "🚩", "Consistency"],
];

/* ─── Quiz Modal ─────────────────────────────────────────── */
function QuizModal({ onClose, onPass }: { onClose: () => void; onPass: () => void }) {
  const [idx, setIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [chosen, setChosen] = useState<number | null>(null);
  const [done, setDone] = useState(false);

  const q = QUIZ_QUESTIONS[idx];
  const total = QUIZ_QUESTIONS.length;

  function pick(i: number) {
    if (chosen !== null) return;
    const correct = i === q.a;
    setChosen(i);
    if (correct) setScore(s => s + 1);
    setTimeout(() => {
      if (idx + 1 < total) {
        setIdx(idx + 1);
        setChosen(null);
      } else {
        setDone(true);
      }
    }, 900);
  }

  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 9000,
      background: "rgba(4,3,10,0.92)", backdropFilter: "blur(14px)",
      display: "flex", alignItems: "center", justifyContent: "center", padding: 20,
    }}>
      <div style={{
        background: "linear-gradient(160deg,#0e1a2a,#0a0f1e)",
        border: "1px solid rgba(0,200,180,0.25)", borderRadius: 24,
        maxWidth: 560, width: "100%", padding: 36, position: "relative",
        boxShadow: "0 24px 80px rgba(0,0,0,0.7), 0 0 40px rgba(0,200,180,0.1)",
      }}>
        <button onClick={onClose} style={{ position: "absolute", top: 14, right: 14, background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.12)", color: "#fff", borderRadius: "50%", width: 32, height: 32, cursor: "pointer", fontSize: 14 }}>✕</button>

        {!done ? (
          <>
            <div style={{ fontFamily: "var(--font-jetbrains)", fontSize: 10, letterSpacing: "0.2em", color: "#00c8b4", textTransform: "uppercase", marginBottom: 8 }}>
              QUESTION {idx + 1} / {total}
            </div>
            <div style={{ background: "rgba(0,200,180,0.08)", borderRadius: 6, height: 4, marginBottom: 24 }}>
              <div style={{ height: "100%", borderRadius: 6, background: "#00c8b4", width: `${((idx) / total) * 100}%`, transition: "width 0.3s" }} />
            </div>
            <div style={{ fontFamily: "var(--font-archivo)", fontWeight: 800, fontSize: 20, color: "#fff", marginBottom: 24, lineHeight: 1.3 }}>{q.q}</div>
            <div style={{ display: "grid", gap: 10 }}>
              {q.opts.map((opt, i) => {
                let bg = "rgba(255,255,255,0.05)";
                let border = "rgba(255,255,255,0.12)";
                let color = "rgba(255,255,255,0.8)";
                if (chosen !== null) {
                  if (i === q.a) { bg = "rgba(0,200,100,0.15)"; border = "#00c864"; color = "#6ee7b7"; }
                  else if (i === chosen) { bg = "rgba(232,48,58,0.15)"; border = "#e8303a"; color = "#f87171"; }
                }
                return (
                  <button key={i} onClick={() => pick(i)} style={{
                    background: bg, border: `1.5px solid ${border}`, borderRadius: 12,
                    padding: "14px 18px", color, textAlign: "left",
                    fontFamily: "var(--font-saira)", fontWeight: 700, fontSize: 14,
                    cursor: chosen !== null ? "default" : "pointer",
                    transition: "all 0.2s",
                  }}>{opt}</button>
                );
              })}
            </div>
          </>
        ) : (
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: 48, marginBottom: 12 }}>{score >= 7 ? "🏆" : score >= 5 ? "🎯" : "📚"}</div>
            <div style={{ fontFamily: "var(--font-archivo)", fontWeight: 900, fontSize: 28, color: "#fff", marginBottom: 8 }}>
              {score} / {total}
            </div>
            <div style={{ fontFamily: "var(--font-saira)", color: "rgba(255,255,255,0.6)", fontSize: 15, marginBottom: 24 }}>
              {score >= 7 ? "Brilliant! You earned 20 boost points." : score >= 5 ? "Good effort! You earned 10 boost points." : "Keep studying. You earned 5 boost points."}
            </div>
            <button onClick={() => { onPass(); onClose(); }} style={{
              background: "linear-gradient(135deg,#00c8b4,#00e8d0)",
              border: "none", borderRadius: 12, padding: "14px 32px",
              fontFamily: "var(--font-archivo)", fontWeight: 900, fontSize: 16,
              color: "#0a0a0a", cursor: "pointer",
            }}>
              ✓ Claim {score >= 7 ? 20 : score >= 5 ? 10 : 5} Boost Points
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

/* ─── Lock Modal ─────────────────────────────────────────── */
function LockModal({ driver, runsLeft, onClose }: { driver: Driver; runsLeft: number; onClose: () => void }) {
  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 9000,
      background: "rgba(4,3,10,0.92)", backdropFilter: "blur(14px)",
      display: "flex", alignItems: "center", justifyContent: "center", padding: 20,
    }}>
      <div style={{
        background: "linear-gradient(160deg,#1a0e2a,#0f0a1e)",
        border: "1px solid rgba(232,48,58,0.3)", borderRadius: 24,
        maxWidth: 420, width: "100%", padding: 36, textAlign: "center",
        boxShadow: "0 24px 80px rgba(0,0,0,0.7), 0 0 40px rgba(232,48,58,0.1)",
      }}>
        <div style={{ fontSize: 48, marginBottom: 16 }}>🔒</div>
        <div style={{ fontFamily: "var(--font-archivo)", fontWeight: 900, fontSize: 26, color: "#fff", marginBottom: 8 }}>{driver.name}</div>
        <div style={{ fontFamily: "var(--font-saira)", color: "rgba(255,255,255,0.55)", fontSize: 14, marginBottom: 24, lineHeight: 1.6 }}>
          This driver is locked. Run <span style={{ color: "#00c8b4", fontWeight: 700 }}>{runsLeft} more simulation{runsLeft !== 1 ? "s" : ""}</span> to unlock {driver.name.split(" ")[0]}.
        </div>
        <div style={{ fontFamily: "var(--font-jetbrains)", fontSize: 11, color: "rgba(255,255,255,0.3)", fontStyle: "italic", marginBottom: 24 }}>
          "{driver.quote}"
        </div>
        <button onClick={onClose} style={{
          background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.15)",
          borderRadius: 12, padding: "12px 28px", color: "rgba(255,255,255,0.7)",
          fontFamily: "var(--font-saira)", fontWeight: 700, fontSize: 14, cursor: "pointer",
        }}>Close</button>
      </div>
    </div>
  );
}

/* ─── Animated Track ─────────────────────────────────────── */
function AnimatedTrack({ circuitKey, running, winner, d1, d2 }: {
  circuitKey: string; running: boolean; winner: Driver | null; d1: Driver; d2: Driver;
}) {
  const circuit = CIRCUITS[circuitKey];
  const [offset1, setOffset1] = useState(0);
  const [offset2, setOffset2] = useState(50);

  useEffect(() => {
    if (!running && !winner) return;
    setOffset1(0);
    setOffset2(50);
  }, [circuitKey, running, winner]);

  return (
    <div style={{
      background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)",
      borderRadius: 20, padding: "20px 24px", marginBottom: 18,
    }}>
      <div style={{ fontFamily: "var(--font-jetbrains)", fontSize: 9, letterSpacing: "0.2em", color: "rgba(255,255,255,0.35)", textTransform: "uppercase", marginBottom: 12 }}>
        🏁 {circuit.name} — Track Preview
      </div>
      <svg viewBox="0 0 300 105" width="100%" style={{ display: "block", overflow: "visible" }}>
        {/* Track outline (thick grey) */}
        <path d={circuit.trackPath} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="18" strokeLinejoin="round" />
        {/* Track surface */}
        <path d={circuit.trackPath} fill="none" stroke="rgba(255,255,255,0.18)" strokeWidth="12" strokeLinejoin="round" />
        {/* Centre line */}
        <path d={circuit.trackPath} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="1" strokeDasharray="4 4" strokeLinejoin="round" />

        {/* Car 1 — teal */}
        {(running || winner) && (
          <circle r="5" fill={d1.teamColor || "#00c8b4"} style={{ filter: "drop-shadow(0 0 4px #00c8b4)" }}>
            <animateMotion
              dur={running ? "2.4s" : "3.2s"}
              repeatCount="indefinite"
              path={circuit.trackPath}
              calcMode="linear"
            />
          </circle>
        )}
        {/* Car 2 — red, offset */}
        {(running || winner) && (
          <circle r="5" fill={d2.teamColor || "#e8303a"} style={{ filter: "drop-shadow(0 0 4px #e8303a)" }}>
            <animateMotion
              dur={running ? "2.6s" : "3.8s"}
              repeatCount="indefinite"
              path={circuit.trackPath}
              calcMode="linear"
              begin="-1.3s"
            />
          </circle>
        )}
      </svg>

      {/* Legend */}
      <div style={{ display: "flex", gap: 16, marginTop: 10, justifyContent: "center" }}>
        {[{ d: d1, color: d1.teamColor || "#00c8b4" }, { d: d2, color: d2.teamColor || "#e8303a" }].map(({ d, color }) => (
          <div key={d.key} style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <div style={{ width: 10, height: 10, borderRadius: "50%", background: color, boxShadow: `0 0 6px ${color}` }} />
            <span style={{ fontFamily: "var(--font-jetbrains)", fontSize: 9, color: "rgba(255,255,255,0.45)", textTransform: "uppercase", letterSpacing: "0.1em" }}>
              {d.name.split(" ").pop()}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── Driver Pick Panel ─────────────────────────────────── */
function DriverPick({
  slot, value, onChange, driver, accentColor, isUnlocked, onLockedClick,
}: {
  slot: number; value: string; onChange: (v: string) => void;
  driver: Driver; accentColor: string;
  isUnlocked: (key: string) => boolean;
  onLockedClick: (d: Driver) => void;
}) {
  const [tooltip, setTooltip] = useState<string | null>(null);

  return (
    <div style={{
      background: "linear-gradient(160deg,#0e2a2a 0%,#0d2137 100%)",
      border: `1px solid ${accentColor}33`, borderTop: `5px solid ${accentColor}`,
      borderRadius: 24, padding: "22px 22px 20px",
      boxShadow: `0 6px 28px rgba(0,0,0,0.4), 0 0 30px ${accentColor}10`,
    }}>
      <label style={{ fontFamily: "var(--font-saira)", fontWeight: 700, fontSize: 10, letterSpacing: "0.26em", textTransform: "uppercase", color: accentColor + "cc", display: "block", marginBottom: 12 }}>
        DRIVER {slot}
      </label>
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
        <div style={{ width: 64, height: 64, borderRadius: "50%", overflow: "hidden", border: "2px solid rgba(177,151,252,0.4)", background: "rgba(255,255,255,0.05)", flexShrink: 0 }}>
          <img src={driver.photo} alt={driver.name} style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "top center" }} onError={(e) => (e.currentTarget.style.display = "none")} />
        </div>
        <div>
          <div style={{ fontFamily: "var(--font-archivo)", fontWeight: 900, fontSize: 15, color: "#fff" }}>{driver.name}</div>
          <div style={{ fontFamily: "var(--font-saira)", fontWeight: 600, fontSize: 9, letterSpacing: "0.16em", color: "rgba(255,255,255,0.5)", marginTop: 2, textTransform: "uppercase" }}>{driver.team.split("·")[0].trim()}</div>
        </div>
      </div>

      {/* Driver selector — locked drivers shown with 🔒 */}
      <select value={value} onChange={e => {
        const key = e.target.value;
        const d = GOAT_DRIVERS.find(dr => dr.key === key)!;
        if (!isUnlocked(key)) { onLockedClick(d); return; }
        onChange(key);
      }} style={{ width: "100%", background: "#fff", color: "#111", border: "1px solid rgba(0,160,160,0.3)", borderRadius: 4, padding: 12, fontFamily: "var(--font-saira)", fontWeight: 600, fontSize: 15, cursor: "pointer", marginBottom: 14 }}>
        {GOAT_DRIVERS.map(d => (
          <option key={d.key} value={d.key}>
            {!isUnlocked(d.key) ? "🔒 " : ""}{d.name}
          </option>
        ))}
      </select>

      {/* Stat bars with rationale tooltip */}
      <div style={{ display: "grid", gap: 7 }}>
        {ATTRS.map(([attr, icon, lbl]) => {
          const v = driver[attr] as number;
          const pct = ((v - 70) / 30 * 100).toFixed(1);
          const rationale = driver.rationale?.[attr as string];
          const isHovered = tooltip === `${slot}-${attr}`;

          return (
            <div key={lbl} style={{ position: "relative" }}>
              <div
                style={{ display: "grid", gridTemplateColumns: "22px 46px 1fr 32px", alignItems: "center", gap: 6, cursor: rationale ? "help" : "default" }}
                onMouseEnter={() => rationale && setTooltip(`${slot}-${attr}`)}
                onMouseLeave={() => setTooltip(null)}
              >
                <span style={{ fontSize: 13, textAlign: "center" }}>{icon}</span>
                <span style={{ fontFamily: "var(--font-saira)", fontWeight: 900, color: "rgba(255,255,255,0.7)", letterSpacing: "0.07em", fontSize: 9, textTransform: "uppercase" }}>{lbl}</span>
                <div style={{ height: 14, background: "rgba(0,0,0,0.3)", borderRadius: 5, overflow: "hidden", border: "1.5px solid rgba(0,200,180,0.15)" }}>
                  <div className={statColor(v)} style={{ height: "100%", borderRadius: 4, width: pct + "%" }} />
                </div>
                <span style={{ fontFamily: "var(--font-space-mono,monospace)", textAlign: "right", fontSize: 13, fontWeight: 900, color: valColor(v) }}>{v}</span>
              </div>

              {/* Rationale tooltip */}
              {isHovered && rationale && (
                <div style={{
                  position: "absolute", bottom: "calc(100% + 8px)", left: 0, right: 0, zIndex: 100,
                  background: "#0d1f3c", border: "1px solid rgba(0,200,180,0.4)",
                  borderRadius: 10, padding: "10px 12px",
                  fontFamily: "var(--font-saira)", fontWeight: 600, fontSize: 11,
                  color: "rgba(255,255,255,0.85)", lineHeight: 1.55,
                  boxShadow: "0 8px 24px rgba(0,0,0,0.6), 0 0 12px rgba(0,200,180,0.1)",
                  pointerEvents: "none",
                }}>
                  {rationale}
                  <div style={{ position: "absolute", bottom: -5, left: 20, width: 10, height: 10, background: "#0d1f3c", border: "1px solid rgba(0,200,180,0.4)", borderTop: "none", borderLeft: "none", transform: "rotate(45deg)" }} />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ─── Dashboard ─────────────────────────────────────────── */
function Dashboard({ simCount, unlockedDrivers, boostPoints, runsUntilSenna, onQuiz }: {
  simCount: number; unlockedDrivers: string[]; boostPoints: number; runsUntilSenna: number; onQuiz: () => void;
}) {
  return (
    <div style={{
      background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)",
      borderRadius: 20, padding: "18px 20px", marginBottom: 18,
      display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: 12,
    }}>
      {[
        { label: "Simulations Run", val: simCount.toString(), icon: "🔁" },
        { label: "Drivers Unlocked", val: `${13 - 1 + unlockedDrivers.length} / 13`, icon: "🏆" },
        { label: "Boost Points", val: boostPoints.toString(), icon: "⚡" },
        { label: "Senna Status", val: runsUntilSenna === 0 ? "UNLOCKED 🟢" : `${runsUntilSenna} runs left`, icon: "🔒" },
      ].map(({ label, val, icon }) => (
        <div key={label} style={{ textAlign: "center" }}>
          <div style={{ fontSize: 20, marginBottom: 4 }}>{icon}</div>
          <div style={{ fontFamily: "var(--font-archivo-narrow)", fontWeight: 800, fontSize: 20, color: "#00c8b4" }}>{val}</div>
          <div style={{ fontFamily: "var(--font-jetbrains)", fontSize: 8, color: "rgba(255,255,255,0.35)", textTransform: "uppercase", letterSpacing: "0.12em", marginTop: 2 }}>{label}</div>
        </div>
      ))}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
        <button onClick={onQuiz} style={{
          background: "rgba(0,200,180,0.1)", border: "1.5px solid rgba(0,200,180,0.4)",
          borderRadius: 10, padding: "10px 16px", color: "#00c8b4",
          fontFamily: "var(--font-jetbrains)", fontWeight: 700, fontSize: 10,
          letterSpacing: "0.12em", textTransform: "uppercase", cursor: "pointer",
          transition: "all 0.18s",
        }}>
          📝 Take Quiz<br />
          <span style={{ fontSize: 8, color: "rgba(0,200,180,0.6)" }}>Earn boost points</span>
        </button>
      </div>
    </div>
  );
}

/* ─── Main Page ─────────────────────────────────────────── */
const GLASS_PICK: React.CSSProperties = {
  background: "rgba(255,255,255,0.06)", backdropFilter: "blur(40px)",
  border: "1px solid rgba(255,255,255,0.1)", borderRadius: 20, padding: "18px 20px",
};
const PICK_LABEL: React.CSSProperties = {
  fontFamily: "var(--font-saira)", fontWeight: 700, fontSize: 10,
  letterSpacing: "0.26em", textTransform: "uppercase", color: "rgba(255,255,255,0.4)",
  display: "block", marginBottom: 12,
};
const SELECT_STYLE: React.CSSProperties = {
  width: "100%", background: "#fff", color: "#111",
  border: "1px solid rgba(0,160,160,0.3)", borderRadius: 4, padding: 12,
  fontFamily: "var(--font-saira)", fontWeight: 600, fontSize: 15, cursor: "pointer",
};

export default function GoatSimulator() {
  const [authOpen, setAuthOpen] = useState(false);
  const [d1Key, setD1Key] = useState("hamilton");
  const [d2Key, setD2Key] = useState("schumacher");
  const [circuitKey, setCircuitKey] = useState("spa");
  const [weather, setWeather] = useState<WeatherKey>("dry");
  const [result, setResult] = useState<{ w1: number; w2: number } | null>(null);
  const [running, setRunning] = useState(false);
  const [quizOpen, setQuizOpen] = useState(false);
  const [lockedDriver, setLockedDriver] = useState<Driver | null>(null);

  const sim = useSimulation();

  const d1 = GOAT_DRIVERS.find(d => d.key === d1Key)!;
  const d2 = GOAT_DRIVERS.find(d => d.key === d2Key)!;

  const runSim = useCallback(() => {
    if (!sim.isUnlocked(d1Key) || !sim.isUnlocked(d2Key)) return;
    setRunning(true);
    setResult(null);
    setTimeout(() => {
      const [w1, w2] = simulateRace(d1, d2, CIRCUITS[circuitKey], weather);
      setResult({ w1, w2 });
      setRunning(false);
      sim.recordRun();
    }, 800);
  }, [d1, d2, circuitKey, weather, sim, d1Key, d2Key]);

  const total = result ? result.w1 + result.w2 : 100000;
  const pct1 = result ? ((result.w1 / total) * 100).toFixed(1) : null;
  const pct2 = result ? ((result.w2 / total) * 100).toFixed(1) : null;
  const winner = result ? (result.w1 > result.w2 ? d1 : d2) : null;

  function handleQuizPass() {
    const q = sim.simCount; // use current score to determine pts
    sim.addBoostPoints(20);
  }

  return (
    <>
      <div className="dotted-surface" />
      <Nav onLoginClick={() => setAuthOpen(true)} />
      <AuthModal open={authOpen} onClose={() => setAuthOpen(false)} />
      {quizOpen && <QuizModal onClose={() => setQuizOpen(false)} onPass={handleQuizPass} />}
      {lockedDriver && <LockModal driver={lockedDriver} runsLeft={sim.runsUntilSenna} onClose={() => setLockedDriver(null)} />}

      <div style={{ paddingTop: 64, position: "relative", zIndex: 1 }}>
        <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0, background: "radial-gradient(ellipse 700px 600px at -5% -5%, rgba(92,45,145,0.4) 0%, transparent 60%), radial-gradient(ellipse 600px 500px at 108% 8%, rgba(185,28,28,0.35) 0%, transparent 60%)" }} />

        <div style={{ maxWidth: 960, margin: "0 auto", padding: "28px 24px 80px", position: "relative", zIndex: 2 }}>

          {/* Header */}
          <header style={{ textAlign: "center", marginBottom: 26 }}>
            <div style={{ fontFamily: "var(--font-saira)", fontWeight: 600, fontSize: 11, letterSpacing: "0.32em", color: "rgba(255,255,255,0.45)", textTransform: "uppercase", marginBottom: 10 }}>100,000 Race Simulation Engine</div>
            <h1 style={{ fontFamily: "var(--font-archivo)", fontWeight: 900, fontSize: "clamp(38px,9vw,76px)", lineHeight: 0.92, letterSpacing: "-0.02em", textTransform: "uppercase", color: "#fff" }}>
              <span style={{ color: "#e8303a" }}>GOAT</span> SIMULATOR
            </h1>
            <div style={{ color: "rgba(255,255,255,0.5)", fontSize: 14, marginTop: 10, fontFamily: "var(--font-saira)", fontWeight: 800, letterSpacing: "0.08em", textTransform: "uppercase" }}>
              WHO REALLY IS THE GREATEST? · HOVER STATS FOR RATIONALE
            </div>
          </header>

          {/* Dashboard */}
          <Dashboard
            simCount={sim.simCount}
            unlockedDrivers={sim.unlockedDrivers}
            boostPoints={sim.boostPoints}
            runsUntilSenna={sim.runsUntilSenna}
            onQuiz={() => setQuizOpen(true)}
          />

          {/* Animated Track */}
          <AnimatedTrack
            circuitKey={circuitKey}
            running={running}
            winner={winner}
            d1={d1}
            d2={d2}
          />

          {/* Driver pickers */}
          <div className="sim-setup">
            <DriverPick slot={1} value={d1Key} onChange={setD1Key} driver={d1} accentColor="#00c8b4" isUnlocked={sim.isUnlocked} onLockedClick={setLockedDriver} />
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "var(--font-archivo)", fontWeight: 900, fontSize: 30, color: "rgba(255,255,255,0.3)", fontStyle: "italic" }}>VS</div>
            <DriverPick slot={2} value={d2Key} onChange={setD2Key} driver={d2} accentColor="#e8303a" isUnlocked={sim.isUnlocked} onLockedClick={setLockedDriver} />
          </div>

          {/* Circuit & Weather */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, margin: "18px 0" }} className="cw-grid">
            <div style={GLASS_PICK}>
              <label style={PICK_LABEL}>🏁 CIRCUIT</label>
              <select value={circuitKey} onChange={e => setCircuitKey(e.target.value)} style={SELECT_STYLE}>
                {Object.entries(CIRCUITS).map(([k, c]) => (
                  <option key={k} value={k}>{c.name}</option>
                ))}
              </select>
            </div>
            <div style={GLASS_PICK}>
              <label style={PICK_LABEL}>☁️ WEATHER</label>
              <div style={{ display: "flex", gap: 8 }}>
                {(["dry", "damp", "wet"] as WeatherKey[]).map(w => (
                  <button key={w} onClick={() => setWeather(w)} style={{
                    flex: 1, padding: "10px 6px", borderRadius: 10, border: "1.5px solid",
                    borderColor: weather === w ? "#00c8b4" : "rgba(255,255,255,0.12)",
                    background: weather === w ? "rgba(0,200,180,0.12)" : "rgba(255,255,255,0.04)",
                    color: weather === w ? "#00e8d0" : "rgba(255,255,255,0.5)",
                    fontFamily: "var(--font-saira)", fontWeight: 700, fontSize: 11,
                    letterSpacing: "0.1em", textTransform: "uppercase", cursor: "pointer",
                    transition: "all 0.18s",
                  }}>{WEATHER_LABELS[w]}</button>
                ))}
              </div>
            </div>
          </div>

          {/* Run button */}
          <div style={{ textAlign: "center", margin: "24px 0" }}>
            <button onClick={runSim} disabled={running || d1Key === d2Key} style={{
              background: "linear-gradient(135deg, #e8303a 0%, #ff6b6b 100%)",
              color: "#fff", border: "none", borderRadius: 16,
              padding: "18px 48px", fontFamily: "var(--font-archivo)", fontWeight: 900,
              fontSize: 18, letterSpacing: "0.05em", textTransform: "uppercase",
              cursor: running || d1Key === d2Key ? "not-allowed" : "pointer",
              opacity: d1Key === d2Key ? 0.5 : 1,
              boxShadow: "0 8px 32px rgba(232,48,58,0.4)",
              transition: "transform 0.2s, box-shadow 0.2s",
            }}>
              {running ? "⏱ Simulating 100,000 races..." : "▶ Run 100,000 Races"}
            </button>
            {d1Key === d2Key && <div style={{ marginTop: 8, fontFamily: "var(--font-jetbrains)", fontSize: 11, color: "#f87171" }}>Select two different drivers</div>}
            {sim.runsUntilSenna > 0 && (
              <div style={{ marginTop: 10, fontFamily: "var(--font-jetbrains)", fontSize: 10, color: "rgba(0,200,180,0.6)", letterSpacing: "0.08em" }}>
                🔒 {sim.runsUntilSenna} more run{sim.runsUntilSenna !== 1 ? "s" : ""} to unlock Senna
              </div>
            )}
          </div>

          {/* Result */}
          {result && (
            <div style={{
              background: "rgba(255,255,255,0.06)", backdropFilter: "blur(40px)",
              border: "1px solid rgba(255,255,255,0.12)", borderTopColor: "rgba(255,255,255,0.22)",
              borderRadius: 28, padding: 32, textAlign: "center",
              boxShadow: "0 12px 48px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.12)",
              marginBottom: 32,
            }}>
              <div style={{ fontFamily: "var(--font-jetbrains)", fontSize: 10, letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(255,255,255,0.35)", marginBottom: 12 }}>
                SIMULATION RESULT · {CIRCUITS[circuitKey].name} · {WEATHER_LABELS[weather]}
              </div>
              <div style={{ fontFamily: "var(--font-archivo)", fontWeight: 900, fontSize: "clamp(24px,5vw,44px)", textTransform: "uppercase", color: "#fff", marginBottom: 6 }}>
                <span style={{ color: "#00e8d0" }}>{winner?.name.split(" ").pop()}</span> WINS
              </div>
              <div style={{ fontFamily: "var(--font-jetbrains)", fontSize: 12, color: "rgba(255,255,255,0.45)", marginBottom: 24 }}>
                out of 100,000 simulated races
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 20 }}>
                <div style={{ flex: 1, textAlign: "right" }}>
                  <div style={{ fontFamily: "var(--font-archivo-narrow)", fontWeight: 800, fontSize: 28, color: "#00e8d0" }}>{pct1}%</div>
                  <div style={{ fontFamily: "var(--font-jetbrains)", fontSize: 10, color: "rgba(255,255,255,0.4)", textTransform: "uppercase", letterSpacing: "0.1em" }}>{d1.name.split(" ").pop()}</div>
                </div>
                <div style={{ flex: 2 }}>
                  <div style={{ height: 16, background: "rgba(255,255,255,0.1)", borderRadius: 99, overflow: "hidden", display: "flex" }}>
                    <div style={{ width: pct1 + "%", background: "linear-gradient(90deg,#00c8b4,#00e8d0)", borderRadius: "99px 0 0 99px", transition: "width 0.8s cubic-bezier(0.2,0.8,0.2,1)" }} />
                    <div style={{ flex: 1, background: "linear-gradient(90deg,#e8303a,#f87171)", borderRadius: "0 99px 99px 0" }} />
                  </div>
                </div>
                <div style={{ flex: 1, textAlign: "left" }}>
                  <div style={{ fontFamily: "var(--font-archivo-narrow)", fontWeight: 800, fontSize: 28, color: "#f87171" }}>{pct2}%</div>
                  <div style={{ fontFamily: "var(--font-jetbrains)", fontSize: 10, color: "rgba(255,255,255,0.4)", textTransform: "uppercase", letterSpacing: "0.1em" }}>{d2.name.split(" ").pop()}</div>
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, maxWidth: 600, margin: "0 auto" }}>
                {[
                  { label: d1.name.split(" ").pop()! + " Wins", val: result.w1.toLocaleString(), color: "#00e8d0" },
                  { label: d2.name.split(" ").pop()! + " Wins", val: result.w2.toLocaleString(), color: "#f87171" },
                ].map(s => (
                  <div key={s.label} style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 16, padding: "16px 20px" }}>
                    <div style={{ fontFamily: "var(--font-jetbrains)", fontSize: 9, letterSpacing: "0.15em", textTransform: "uppercase", color: "rgba(255,255,255,0.4)", marginBottom: 6 }}>{s.label}</div>
                    <div style={{ fontFamily: "var(--font-archivo-narrow)", fontWeight: 800, fontSize: 28, color: s.color }}>{s.val}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      </div>

      <style>{`
        .sim-setup { display:grid; grid-template-columns:1fr auto 1fr; gap:14px; margin-top:18px; align-items:stretch; }
        @media(max-width:640px) { .sim-setup { grid-template-columns:1fr; gap:10px; } .cw-grid { grid-template-columns:1fr !important; } }
        .fill-blue { background: linear-gradient(90deg,#1a5fd4,#3b8ef8,#6ab4ff); box-shadow:0 0 8px rgba(59,142,248,0.55); }
        .fill-green { background: linear-gradient(90deg,#0a8c3a,#1ec95a,#5de88a); box-shadow:0 0 8px rgba(30,201,90,0.5); }
        .fill-yellow { background: linear-gradient(90deg,#c47000,#f0a000,#fdd05a); box-shadow:0 0 8px rgba(240,160,0,0.5); }
        .fill-red { background: linear-gradient(90deg,#b81518,#e83030,#ff7070); box-shadow:0 0 8px rgba(232,48,48,0.5); }
      `}</style>
    </>
  );
}
