"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import Nav from "@/components/Nav";
import AuthModal from "@/components/AuthModal";
import { GOAT_DRIVERS, LOCKED_DRIVER_KEYS, Driver } from "@/data/drivers";
import { useSimulation } from "@/lib/useSimulation";
import { QUIZ_QUESTIONS } from "@/data/quiz";
import { auth } from "@/lib/firebase";
import { onAuthStateChanged, User } from "firebase/auth";
import {
  Gauge, Zap, Flag, Cloud, RotateCw, TrendingUp,
  RefreshCw, Trophy, Lock, Target, BookOpen, X, CheckCircle2,
  ChevronDown, Settings, LogIn,
} from "@/components/Icons";

type WeatherKey = "dry" | "damp" | "wet";

interface CircuitInfo {
  name: string;
  country: string;
  tagline: string;
  favours: string;
  wetFactor: number;
  tyreDemand: number;
  overtakeFreq: number;
  paceWeight: number;
  qualiWeight: number;
  racecraftWeight: number;
  trackPath: string;
}

const CIRCUITS: Record<string, CircuitInfo> = {
  monaco:      { name:"Monaco",          country:"Monaco",   tagline:"Nowhere to overtake. Pole is everything.", favours:"Quali · Racecraft", wetFactor:1.9, tyreDemand:1.1, overtakeFreq:0.5, paceWeight:0.25, qualiWeight:0.45, racecraftWeight:0.3,  trackPath:"M 20 80 L 20 30 Q 20 20 30 20 L 100 20 Q 130 20 140 40 L 160 70 L 180 70 Q 200 70 200 50 L 200 30 Q 200 15 215 15 L 260 15 Q 270 15 270 30 L 270 80 Q 270 95 255 95 L 35 95 Q 20 95 20 80 Z" },
  silverstone: { name:"Silverstone",     country:"England",  tagline:"Home of British motorsport.",              favours:"Pace · Racecraft",  wetFactor:1.3, tyreDemand:1.2, overtakeFreq:1.2, paceWeight:0.4,  qualiWeight:0.3,  racecraftWeight:0.3,  trackPath:"M 30 60 L 30 30 Q 30 20 45 20 L 90 20 Q 115 20 130 35 L 160 55 Q 175 65 200 60 L 240 50 Q 260 45 265 30 L 265 25 Q 265 15 250 15 L 180 15 Q 165 10 155 25 L 140 45 Q 125 60 100 60 L 30 60 Z" },
  spa:         { name:"Spa-Francorchamps",country:"Belgium", tagline:"Rain, hills, and Eau Rouge.",              favours:"Pace · Wet · Craft", wetFactor:1.6, tyreDemand:1.1, overtakeFreq:1.3, paceWeight:0.4,  qualiWeight:0.3,  racecraftWeight:0.3,  trackPath:"M 25 70 L 25 40 Q 25 15 55 15 L 120 15 L 180 35 Q 210 45 240 30 L 260 20 Q 275 12 275 30 L 275 55 Q 275 75 255 80 L 160 85 Q 130 90 110 75 L 80 55 Q 55 40 40 65 L 35 70 Q 30 80 25 70 Z" },
  monza:       { name:"Monza",           country:"Italy",    tagline:"Temple of Speed. Full throttle.",          favours:"Pace · Tyre life",  wetFactor:1.1, tyreDemand:0.9, overtakeFreq:1.5, paceWeight:0.5,  qualiWeight:0.3,  racecraftWeight:0.2,  trackPath:"M 20 75 L 20 25 Q 20 12 35 12 L 265 12 Q 280 12 280 25 L 280 45 Q 280 58 265 58 L 220 58 L 220 75 Q 220 90 205 90 L 35 90 Q 20 90 20 75 Z" },
  suzuka:      { name:"Suzuka",          country:"Japan",    tagline:"The figure-8 technical masterpiece.",      favours:"Quali · Racecraft", wetFactor:1.4, tyreDemand:1.2, overtakeFreq:0.8, paceWeight:0.4,  qualiWeight:0.35, racecraftWeight:0.25, trackPath:"M 25 75 L 25 40 Q 25 15 50 15 L 100 15 Q 130 15 145 35 L 155 55 Q 165 70 180 60 L 220 35 Q 245 20 265 30 L 270 35 Q 278 50 265 65 L 200 85 Q 175 95 155 80 L 130 60 Q 115 48 95 55 L 60 70 L 40 80 Q 30 85 25 75 Z" },
  nurburgring: { name:"Nürburgring",     country:"Germany",  tagline:"The Green Hell. No mercy.",                favours:"Wet · Craft · Tyres",wetFactor:1.7, tyreDemand:1.3, overtakeFreq:0.9, paceWeight:0.35, qualiWeight:0.3,  racecraftWeight:0.35, trackPath:"M 20 70 L 20 40 Q 20 20 40 15 L 80 12 Q 110 10 130 25 L 160 45 Q 175 55 195 50 L 225 40 Q 250 30 265 45 L 275 60 Q 280 75 265 82 L 200 88 Q 175 92 155 78 L 120 55 Q 100 42 75 50 L 50 65 Q 35 75 20 70 Z" },
  interlagos:  { name:"Interlagos",      country:"Brazil",   tagline:"Chaos guaranteed. Drama certain.",         favours:"Wet · Craft · Cons", wetFactor:1.5, tyreDemand:1.1, overtakeFreq:1.1, paceWeight:0.35, qualiWeight:0.3,  racecraftWeight:0.35, trackPath:"M 30 72 L 30 35 Q 30 18 50 15 L 130 12 Q 155 10 170 28 L 185 50 Q 195 65 215 60 L 255 48 Q 272 42 272 60 L 272 72 Q 272 88 255 88 L 50 88 Q 30 88 30 72 Z" },
  imola:       { name:"Imola",           country:"Italy",    tagline:"Old school. Unforgiving.",                 favours:"Quali · Cons · Craft",wetFactor:1.3, tyreDemand:1.1, overtakeFreq:0.7, paceWeight:0.35, qualiWeight:0.35, racecraftWeight:0.3,  trackPath:"M 22 78 L 22 35 Q 22 18 40 15 L 100 12 Q 130 10 150 28 L 175 52 Q 190 68 215 62 L 255 45 Q 272 38 272 56 L 272 78 Q 272 92 255 92 L 40 92 Q 22 92 22 78 Z" },
};

const WEATHER_LABELS: Record<WeatherKey, string> = { dry: "Dry", damp: "Damp / Mixed", wet: "Full Wet" };
const WEATHER_DESCS: Record<WeatherKey, string> = { dry: "Pure pace. No excuses.", damp: "Inters or slicks? Your call.", wet: "Chaos reigns. Heroes emerge." };

const ATTRS: [keyof Driver, React.ElementType, string][] = [
  ["pace",        Gauge,       "Pace"],
  ["quali",       Zap,         "Qualifying"],
  ["racecraft",   Flag,        "Racecraft"],
  ["wet",         Cloud,       "Wet"],
  ["tyres",       RotateCw,    "Tyres"],
  ["consistency", TrendingUp,  "Consistency"],
];

function simulateRace(d1: Driver, d2: Driver, circuit: CircuitInfo, weather: WeatherKey, runs = 100000): [number, number] {
  let w1 = 0, w2 = 0;
  const wetM = weather === "dry" ? 0 : weather === "damp" ? 0.5 : 1.0;
  for (let i = 0; i < runs; i++) {
    if (calcScore(d1, circuit, wetM) > calcScore(d2, circuit, wetM)) w1++; else w2++;
  }
  return [w1, w2];
}

function calcScore(d: Driver, c: CircuitInfo, wetM: number): number {
  const base = (
    d.pace       * c.paceWeight +
    d.quali      * c.qualiWeight +
    d.racecraft  * c.racecraftWeight +
    d.wet        * wetM * c.wetFactor * 0.15 +
    d.tyres      * c.tyreDemand   * 0.1 +
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

/* ─── Auth Gate Banner ────────────────────────────────────── */
function AuthBanner({ onLogin }: { onLogin: () => void }) {
  return (
    <div style={{
      background: "linear-gradient(135deg,rgba(232,48,58,0.12),rgba(0,200,180,0.08))",
      border: "1px solid rgba(232,48,58,0.35)", borderRadius: 16,
      padding: "18px 24px", marginBottom: 20,
      display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap",
    }}>
      <LogIn size={22} strokeWidth={1.8} style={{ color: "#e8303a", flexShrink: 0 }} />
      <div style={{ flex: 1, minWidth: 200 }}>
        <div style={{ fontFamily: "var(--font-archivo)", fontWeight: 900, fontSize: 15, color: "#fff", marginBottom: 3 }}>
          Login required to run simulations
        </div>
        <div style={{ fontFamily: "var(--font-saira)", fontSize: 12, color: "rgba(255,255,255,0.5)" }}>
          Sign in to run 100,000-race simulations and track your progress
        </div>
      </div>
      <button onClick={onLogin} style={{
        background: "linear-gradient(135deg,#e8303a,#ff6b6b)", border: "none", borderRadius: 10,
        padding: "10px 22px", fontFamily: "var(--font-archivo)", fontWeight: 900,
        fontSize: 13, color: "#fff", cursor: "pointer", flexShrink: 0,
      }}>Sign In</button>
    </div>
  );
}

/* ─── Quiz Modal ─────────────────────────────────────────── */
function QuizModal({ onClose, onPass }: { onClose: () => void; onPass: (pts: number) => void }) {
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
      if (idx + 1 < total) { setIdx(idx + 1); setChosen(null); }
      else setDone(true);
    }, 900);
  }

  const pts = score >= 7 ? 20 : score >= 5 ? 10 : 5;

  return (
    <div style={{ position:"fixed",inset:0,zIndex:9000,background:"rgba(4,3,10,0.92)",backdropFilter:"blur(14px)",display:"flex",alignItems:"center",justifyContent:"center",padding:20 }}>
      <div style={{ background:"linear-gradient(160deg,#0e1a2a,#0a0f1e)",border:"1px solid rgba(0,200,180,0.25)",borderRadius:24,maxWidth:560,width:"100%",padding:36,position:"relative",boxShadow:"0 24px 80px rgba(0,0,0,0.7),0 0 40px rgba(0,200,180,0.1)" }}>
        <button onClick={onClose} style={{ position:"absolute",top:14,right:14,background:"rgba(255,255,255,0.08)",border:"1px solid rgba(255,255,255,0.12)",color:"#fff",borderRadius:"50%",width:32,height:32,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center" }}>
          <X size={14} strokeWidth={2} />
        </button>
        {!done ? (
          <>
            <div style={{ fontFamily:"var(--font-jetbrains)",fontSize:10,letterSpacing:"0.2em",color:"#00c8b4",textTransform:"uppercase",marginBottom:8 }}>QUESTION {idx+1} / {total}</div>
            <div style={{ background:"rgba(0,200,180,0.08)",borderRadius:6,height:4,marginBottom:24 }}>
              <div style={{ height:"100%",borderRadius:6,background:"#00c8b4",width:`${(idx/total)*100}%`,transition:"width 0.3s" }} />
            </div>
            <div style={{ fontFamily:"var(--font-archivo)",fontWeight:800,fontSize:20,color:"#fff",marginBottom:24,lineHeight:1.3 }}>{q.q}</div>
            <div style={{ display:"grid",gap:10 }}>
              {q.opts.map((opt, i) => {
                let bg = "rgba(255,255,255,0.05)", border = "rgba(255,255,255,0.12)", color = "rgba(255,255,255,0.8)";
                if (chosen !== null) {
                  if (i === q.a) { bg="rgba(0,200,100,0.15)"; border="#00c864"; color="#6ee7b7"; }
                  else if (i === chosen) { bg="rgba(232,48,58,0.15)"; border="#e8303a"; color="#f87171"; }
                }
                return (
                  <button key={i} onClick={() => pick(i)} style={{ background:bg,border:`1.5px solid ${border}`,borderRadius:12,padding:"14px 18px",color,textAlign:"left",fontFamily:"var(--font-saira)",fontWeight:700,fontSize:14,cursor:chosen!==null?"default":"pointer",transition:"all 0.2s" }}>{opt}</button>
                );
              })}
            </div>
          </>
        ) : (
          <div style={{ textAlign:"center" }}>
            <div style={{ marginBottom:16 }}>
              {score >= 7 ? <Trophy size={44} strokeWidth={1.5} style={{ color:"#fcd34d" }} /> : score >= 5 ? <Target size={44} strokeWidth={1.5} style={{ color:"#00c8b4" }} /> : <BookOpen size={44} strokeWidth={1.5} style={{ color:"rgba(255,255,255,0.4)" }} />}
            </div>
            <div style={{ fontFamily:"var(--font-archivo)",fontWeight:900,fontSize:28,color:"#fff",marginBottom:8 }}>{score} / {total}</div>
            <div style={{ fontFamily:"var(--font-saira)",color:"rgba(255,255,255,0.6)",fontSize:15,marginBottom:24 }}>
              {score >= 7 ? "Brilliant! You earned 20 boost points." : score >= 5 ? "Good effort! You earned 10 boost points." : "Keep studying. You earned 5 boost points."}
            </div>
            <button onClick={() => { onPass(pts); onClose(); }} style={{ background:"linear-gradient(135deg,#00c8b4,#00e8d0)",border:"none",borderRadius:12,padding:"14px 32px",fontFamily:"var(--font-archivo)",fontWeight:900,fontSize:16,color:"#0a0a0a",cursor:"pointer" }}>
              ✓ Claim {pts} Boost Points
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
    <div style={{ position:"fixed",inset:0,zIndex:9000,background:"rgba(4,3,10,0.92)",backdropFilter:"blur(14px)",display:"flex",alignItems:"center",justifyContent:"center",padding:20 }}>
      <div style={{ background:"linear-gradient(160deg,#1a0e2a,#0f0a1e)",border:"1px solid rgba(232,48,58,0.3)",borderRadius:24,maxWidth:420,width:"100%",padding:36,textAlign:"center",boxShadow:"0 24px 80px rgba(0,0,0,0.7),0 0 40px rgba(232,48,58,0.1)" }}>
        <div style={{ width:72,height:72,borderRadius:"50%",overflow:"hidden",border:"2px solid rgba(232,48,58,0.4)",margin:"0 auto 16px",background:"rgba(255,255,255,0.05)" }}>
          <img src={driver.photo} alt={driver.name} style={{ width:"100%",height:"100%",objectFit:"cover",objectPosition:"top center" }} onError={e => (e.currentTarget.style.display="none")} />
        </div>
        <Lock size={28} strokeWidth={1.5} style={{ color:"rgba(232,48,58,0.7)",marginBottom:12 }} />
        <div style={{ fontFamily:"var(--font-archivo)",fontWeight:900,fontSize:26,color:"#fff",marginBottom:8 }}>{driver.name}</div>
        <div style={{ fontFamily:"var(--font-saira)",color:"rgba(255,255,255,0.55)",fontSize:14,marginBottom:24,lineHeight:1.6 }}>
          Run <span style={{ color:"#00c8b4",fontWeight:700 }}>{runsLeft} more simulation{runsLeft!==1?"s":""}</span> to unlock {driver.name.split(" ")[0]}.
        </div>
        <div style={{ fontFamily:"var(--font-jetbrains)",fontSize:11,color:"rgba(255,255,255,0.3)",fontStyle:"italic",marginBottom:24 }}>"{driver.quote}"</div>
        <button onClick={onClose} style={{ background:"rgba(255,255,255,0.08)",border:"1px solid rgba(255,255,255,0.15)",borderRadius:12,padding:"12px 28px",color:"rgba(255,255,255,0.7)",fontFamily:"var(--font-saira)",fontWeight:700,fontSize:14,cursor:"pointer" }}>Close</button>
      </div>
    </div>
  );
}

/* ─── Driver Grid Picker ─────────────────────────────────── */
function DriverGrid({ selectedKey, onSelect, accentColor, isUnlocked, onLockedClick, runsUntilNext }: {
  selectedKey: string;
  onSelect: (key: string) => void;
  accentColor: string;
  isUnlocked: (key: string) => boolean;
  onLockedClick: (d: Driver) => void;
  runsUntilNext: { key: string; runs: number } | null;
}) {
  return (
    <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:8, marginBottom:14 }}>
      {GOAT_DRIVERS.map(d => {
        const locked = !isUnlocked(d.key);
        const selected = d.key === selectedKey;
        return (
          <button
            key={d.key}
            onClick={() => {
              if (locked) onLockedClick(d);
              else onSelect(d.key);
            }}
            style={{
              position:"relative", background: selected ? `${accentColor}18` : "rgba(255,255,255,0.04)",
              border: `1.5px solid ${selected ? accentColor : "rgba(255,255,255,0.1)"}`,
              borderRadius:12, padding:"10px 8px 8px",
              cursor: locked ? "default" : "pointer",
              transition:"all 0.18s",
              opacity: locked ? 0.55 : 1,
              display:"flex", flexDirection:"column", alignItems:"center", gap:6,
              boxShadow: selected ? `0 0 16px ${accentColor}30` : "none",
            }}
          >
            {/* Photo */}
            <div style={{ width:44,height:44,borderRadius:"50%",overflow:"hidden",border:`2px solid ${selected ? accentColor : "rgba(255,255,255,0.15)"}`,background:"rgba(255,255,255,0.05)",flexShrink:0,position:"relative" }}>
              <img src={d.photo} alt={d.name} style={{ width:"100%",height:"100%",objectFit:"cover",objectPosition:"top center" }} onError={e => (e.currentTarget.style.display="none")} />
              {locked && (
                <div style={{ position:"absolute",inset:0,background:"rgba(0,0,0,0.55)",display:"flex",alignItems:"center",justifyContent:"center" }}>
                  <Lock size={14} strokeWidth={2} style={{ color:"rgba(255,255,255,0.7)" }} />
                </div>
              )}
            </div>
            {/* Name */}
            <div style={{ fontFamily:"var(--font-saira)",fontWeight:700,fontSize:9,textTransform:"uppercase",letterSpacing:"0.08em",color: locked ? "rgba(255,255,255,0.3)" : selected ? accentColor : "rgba(255,255,255,0.7)",textAlign:"center",lineHeight:1.2 }}>
              {d.name.split(" ").pop()}
            </div>
            {/* Unlock hint on hover for locked */}
            {locked && runsUntilNext?.key === d.key && (
              <div style={{ fontFamily:"var(--font-jetbrains)",fontSize:8,color:"rgba(0,200,180,0.6)",letterSpacing:"0.05em" }}>
                {runsUntilNext.runs} runs
              </div>
            )}
          </button>
        );
      })}
    </div>
  );
}

/* ─── Driver Stats Panel ─────────────────────────────────── */
function DriverStatsPanel({
  driver, accentColor, customStats, slot,
}: {
  driver: Driver; accentColor: string;
  customStats: Record<string, number>;
  slot: number;
}) {
  const [tooltip, setTooltip] = useState<string | null>(null);

  return (
    <div style={{ background:"rgba(255,255,255,0.04)",border:"1px solid rgba(255,255,255,0.08)",borderRadius:16,padding:"16px 18px" }}>
      {/* Driver identity */}
      <div style={{ display:"flex",alignItems:"center",gap:12,marginBottom:14 }}>
        <div style={{ width:56,height:56,borderRadius:"50%",overflow:"hidden",border:`2px solid ${accentColor}66`,background:"rgba(255,255,255,0.05)",flexShrink:0 }}>
          <img src={driver.photo} alt={driver.name} style={{ width:"100%",height:"100%",objectFit:"cover",objectPosition:"top center" }} onError={e => (e.currentTarget.style.display="none")} />
        </div>
        <div>
          <div style={{ fontFamily:"var(--font-archivo)",fontWeight:900,fontSize:16,color:"#fff",lineHeight:1.2 }}>{driver.name}</div>
          <div style={{ fontFamily:"var(--font-saira)",fontWeight:600,fontSize:9,letterSpacing:"0.16em",color:"rgba(255,255,255,0.45)",marginTop:3,textTransform:"uppercase" }}>{driver.team.split("·")[0].trim()}</div>
          <div style={{ fontFamily:"var(--font-jetbrains)",fontSize:9,color:accentColor+"99",marginTop:2 }}>{driver.titles} WCC · {driver.wins} wins</div>
        </div>
      </div>
      {/* Stat bars */}
      <div style={{ display:"grid",gap:7 }}>
        {ATTRS.map(([attr, AttrIcon, lbl]) => {
          const base = driver[attr] as number;
          const v = customStats[attr as string] ?? base;
          const pct = ((v - 70) / 30 * 100).toFixed(1);
          const rationale = driver.rationale?.[attr as string];
          const isHovered = tooltip === `${slot}-${attr}`;
          return (
            <div key={lbl} style={{ position:"relative" }}>
              <div
                style={{ display:"grid",gridTemplateColumns:"18px minmax(0,80px) 1fr 32px",alignItems:"center",gap:6,cursor:rationale?"help":"default" }}
                onMouseEnter={() => rationale && setTooltip(`${slot}-${attr}`)}
                onMouseLeave={() => setTooltip(null)}
              >
                <AttrIcon size={13} strokeWidth={1.8} style={{ color:"rgba(0,200,180,0.55)" }} />
                <span style={{ fontFamily:"var(--font-saira)",fontWeight:900,color:"rgba(255,255,255,0.7)",letterSpacing:"0.07em",fontSize:9,textTransform:"uppercase" }}>{lbl}</span>
                <div style={{ height:14,background:"rgba(0,0,0,0.3)",borderRadius:5,overflow:"hidden",border:"1.5px solid rgba(0,200,180,0.15)" }}>
                  <div className={statColor(v)} style={{ height:"100%",borderRadius:4,width:pct+"%" }} />
                </div>
                <span style={{ fontFamily:"monospace",textAlign:"right",fontSize:13,fontWeight:900,color:valColor(v) }}>{v}</span>
              </div>
              {isHovered && rationale && (
                <div style={{ position:"absolute",bottom:"calc(100% + 8px)",left:0,right:0,zIndex:100,background:"#0d1f3c",border:"1px solid rgba(0,200,180,0.4)",borderRadius:10,padding:"10px 12px",fontFamily:"var(--font-saira)",fontWeight:600,fontSize:11,color:"rgba(255,255,255,0.85)",lineHeight:1.55,boxShadow:"0 8px 24px rgba(0,0,0,0.6)",pointerEvents:"none" }}>
                  {rationale}
                  <div style={{ position:"absolute",bottom:-5,left:20,width:10,height:10,background:"#0d1f3c",border:"1px solid rgba(0,200,180,0.4)",borderTop:"none",borderLeft:"none",transform:"rotate(45deg)" }} />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ─── Custom Stats Panel ─────────────────────────────────── */
function CustomStatsPanel({
  d1, d2, customStats, onSetStat, onReset,
}: {
  d1: Driver; d2: Driver;
  customStats: Record<string, Record<string, number>>;
  onSetStat: (driverKey: string, attr: string, value: number) => void;
  onReset: (driverKey: string) => void;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div style={{ marginBottom:18 }}>
      <button onClick={() => setOpen(o => !o)} style={{
        width:"100%",display:"flex",alignItems:"center",gap:12,
        background:"linear-gradient(90deg,#f5c77e,#f0b84e)",
        border:"none",borderRadius:10,padding:"12px 18px",cursor:"pointer",
        boxShadow:"0 4px 20px rgba(245,199,126,0.4)",
        transition:"all 0.2s",
      }}>
        <div style={{ width:40,height:40,flexShrink:0,backgroundImage:"repeating-conic-gradient(#5a3a00 0% 25%,#f5c77e 0% 50%)",backgroundSize:"10px 10px",borderRadius:6,display:"flex",alignItems:"center",justifyContent:"center",border:"2px solid rgba(0,0,0,0.15)" }}>
          <span style={{ fontSize:16 }}>🏁</span>
        </div>
        <div style={{ flex:1,textAlign:"left" }}>
          <div style={{ fontFamily:"var(--font-archivo)",fontWeight:900,fontSize:13,letterSpacing:"0.1em",textTransform:"uppercase",color:"#1a1a3a" }}>Customise Stats</div>
          <div style={{ fontFamily:"var(--font-saira)",fontSize:11,color:"rgba(26,26,58,0.65)",marginTop:1 }}>Adjust driver ratings before you simulate</div>
        </div>
        <Settings size={16} strokeWidth={2} style={{ color:"#1a1a3a",flexShrink:0 }} />
        <ChevronDown size={18} strokeWidth={2.5} style={{ color:"#1a1a3a",flexShrink:0,transform:open?"rotate(180deg)":"none",transition:"transform 0.25s" }} />
      </button>

      {open && (
        <div style={{ background:"linear-gradient(160deg,#0e2a2a,#0d2137)",border:"1px solid rgba(0,200,180,0.2)",borderRadius:10,padding:"20px",marginTop:8,animation:"slideDown 0.25s ease" }}>
          <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:"20px 28px" }}>
            {[{ d:d1, label:"DRIVER 1", accent:"#00c8b4" }, { d:d2, label:"DRIVER 2", accent:"#e8303a" }].map(({ d, label, accent }) => {
              const cs = customStats[d.key] || {};
              return (
                <div key={d.key}>
                  <div style={{ fontFamily:"var(--font-archivo)",fontWeight:900,fontSize:12,textTransform:"uppercase",letterSpacing:"0.06em",color:accent,borderBottom:`2px solid ${accent}`,paddingBottom:6,marginBottom:12 }}>
                    {label} — {d.name.split(" ").pop()}
                  </div>
                  {ATTRS.map(([attr,, lbl]) => {
                    const base = d[attr] as number;
                    const val = cs[attr as string] ?? base;
                    return (
                      <div key={attr as string} style={{ display:"grid",gridTemplateColumns:"60px 1fr 28px",alignItems:"center",gap:6,marginBottom:10 }}>
                        <span style={{ fontFamily:"var(--font-jetbrains)",fontWeight:600,fontSize:9,letterSpacing:"0.1em",color:"rgba(255,255,255,0.6)",textTransform:"uppercase" }}>{lbl}</span>
                        <input
                          type="range" min={70} max={100} value={val}
                          onChange={e => onSetStat(d.key, attr as string, Number(e.target.value))}
                          style={{ width:"100%",accentColor:accent,cursor:"pointer" }}
                        />
                        <span style={{ fontFamily:"monospace",fontSize:11,fontWeight:700,color:valColor(val),textAlign:"right" }}>{val}</span>
                      </div>
                    );
                  })}
                  <button onClick={() => onReset(d.key)} style={{ marginTop:6,fontFamily:"var(--font-saira)",fontWeight:600,fontSize:10,letterSpacing:"0.14em",textTransform:"uppercase",color:"rgba(0,200,180,0.7)",background:"none",border:"1px solid rgba(0,200,180,0.3)",borderRadius:4,padding:"5px 14px",cursor:"pointer",display:"block",width:"100%",transition:"all 0.18s" }}>
                    Reset {d.name.split(" ")[0]}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

/* ─── Circuit Selector ───────────────────────────────────── */
function CircuitSelector({ value, onChange }: { value: string; onChange: (k: string) => void }) {
  const [hovered, setHovered] = useState<string | null>(null);

  return (
    <div style={{ position:"relative" }}>
      <div style={{ fontFamily:"var(--font-saira)",fontWeight:700,fontSize:10,letterSpacing:"0.26em",textTransform:"uppercase",color:"rgba(255,255,255,0.4)",marginBottom:10 }}>🏁 CIRCUIT</div>
      <div style={{ display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:6 }}>
        {Object.entries(CIRCUITS).map(([k, c]) => {
          const sel = k === value;
          const hov = k === hovered;
          return (
            <div key={k} style={{ position:"relative" }}>
              <button
                onClick={() => onChange(k)}
                onMouseEnter={() => setHovered(k)}
                onMouseLeave={() => setHovered(null)}
                style={{
                  width:"100%",padding:"8px 6px",borderRadius:8,border:`1.5px solid ${sel?"#00c8b4":"rgba(255,255,255,0.12)"}`,
                  background: sel?"rgba(0,200,180,0.12)":"rgba(255,255,255,0.04)",
                  color: sel?"#00e8d0":"rgba(255,255,255,0.6)",
                  fontFamily:"var(--font-jetbrains)",fontWeight:700,fontSize:9,
                  letterSpacing:"0.08em",textTransform:"uppercase",cursor:"pointer",
                  transition:"all 0.18s",
                  boxShadow: sel?"0 0 12px rgba(0,200,180,0.25)":"none",
                }}
              >
                {c.name}
              </button>
              {/* Hover tooltip */}
              {hov && (
                <div style={{
                  position:"absolute",bottom:"calc(100% + 8px)",left:"50%",transform:"translateX(-50%)",
                  background:"#0d1f3c",border:"1px solid rgba(0,200,180,0.4)",borderRadius:12,
                  padding:"14px 16px",zIndex:200,width:200,
                  boxShadow:"0 8px 32px rgba(0,0,0,0.6)",pointerEvents:"none",
                }}>
                  <div style={{ fontFamily:"var(--font-archivo)",fontWeight:900,fontSize:13,color:"#fff",marginBottom:4 }}>{c.name}</div>
                  <div style={{ fontFamily:"var(--font-saira)",fontSize:10,color:"rgba(255,255,255,0.45)",marginBottom:8,lineHeight:1.4 }}>{c.tagline}</div>
                  <div style={{ fontFamily:"var(--font-jetbrains)",fontSize:9,color:"#00c8b4",letterSpacing:"0.06em" }}>
                    ↑ {c.favours}
                  </div>
                  {/* mini SVG track */}
                  <svg viewBox="0 0 300 105" width="100%" style={{ display:"block",marginTop:10,opacity:0.6 }}>
                    <path d={c.trackPath} fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth="18" strokeLinejoin="round" />
                    <path d={c.trackPath} fill="none" stroke="rgba(0,200,180,0.7)" strokeWidth="3" strokeLinejoin="round" />
                  </svg>
                  {/* caret */}
                  <div style={{ position:"absolute",top:"100%",left:"50%",transform:"translateX(-50%)",width:10,height:10,background:"#0d1f3c",border:"1px solid rgba(0,200,180,0.4)",borderTop:"none",borderLeft:"none",rotate:"45deg",marginTop:-5 }} />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ─── Animated Track ─────────────────────────────────────── */
function AnimatedTrack({ circuitKey, running, d1, d2 }: {
  circuitKey: string; running: boolean; d1: Driver; d2: Driver;
}) {
  const circuit = CIRCUITS[circuitKey];
  return (
    <div style={{ background:"rgba(255,255,255,0.04)",border:"1px solid rgba(255,255,255,0.1)",borderRadius:20,padding:"20px 24px",marginBottom:18 }}>
      <div style={{ fontFamily:"var(--font-jetbrains)",fontSize:9,letterSpacing:"0.2em",color:"rgba(255,255,255,0.35)",textTransform:"uppercase",marginBottom:12 }}>
        🏁 {circuit.name} — Live Track
      </div>
      <svg viewBox="0 0 300 105" width="100%" style={{ display:"block",overflow:"visible" }}>
        <path d={circuit.trackPath} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="18" strokeLinejoin="round" />
        <path d={circuit.trackPath} fill="none" stroke="rgba(255,255,255,0.18)" strokeWidth="12" strokeLinejoin="round" />
        <path d={circuit.trackPath} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="1" strokeDasharray="4 4" strokeLinejoin="round" />
        {running && (
          <>
            <circle r="5" fill={d1.teamColor || "#00c8b4"} style={{ filter:`drop-shadow(0 0 4px ${d1.teamColor||"#00c8b4"})` }}>
              <animateMotion dur="2.4s" repeatCount="indefinite" path={circuit.trackPath} calcMode="linear" />
            </circle>
            <circle r="5" fill={d2.teamColor || "#e8303a"} style={{ filter:`drop-shadow(0 0 4px ${d2.teamColor||"#e8303a"})` }}>
              <animateMotion dur="2.6s" repeatCount="indefinite" path={circuit.trackPath} calcMode="linear" begin="-1.3s" />
            </circle>
          </>
        )}
      </svg>
      {running && (
        <div style={{ display:"flex",gap:16,marginTop:10,justifyContent:"center" }}>
          {[{d:d1,color:d1.teamColor||"#00c8b4"},{d:d2,color:d2.teamColor||"#e8303a"}].map(({d,color}) => (
            <div key={d.key} style={{ display:"flex",alignItems:"center",gap:6 }}>
              <div style={{ width:10,height:10,borderRadius:"50%",background:color,boxShadow:`0 0 6px ${color}` }} />
              <span style={{ fontFamily:"var(--font-jetbrains)",fontSize:9,color:"rgba(255,255,255,0.45)",textTransform:"uppercase",letterSpacing:"0.1em" }}>{d.name.split(" ").pop()}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ─── Dashboard ─────────────────────────────────────────── */
function Dashboard({ simCount, lockedCount, unlockedCount, boostPoints, runsUntilNext, onQuiz }: {
  simCount: number; lockedCount: number; unlockedCount: number; boostPoints: number;
  runsUntilNext: { key: string; runs: number } | null;
  onQuiz: () => void;
}) {
  return (
    <div style={{ background:"rgba(255,255,255,0.04)",border:"1px solid rgba(255,255,255,0.1)",borderRadius:20,padding:"18px 20px",marginBottom:18,display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(120px,1fr))",gap:12 }}>
      {[
        { label:"Simulations Run",  val:simCount.toString(),         Icon:RefreshCw },
        { label:"Drivers Unlocked", val:`${10+Math.max(0,8-lockedCount)} / 18`, Icon:Trophy },
        { label:"Boost Points",     val:boostPoints.toString(),      Icon:Zap },
        { label:"Next Unlock",      val:runsUntilNext ? `${runsUntilNext.runs} runs` : "All done!", Icon:Lock },
      ].map(({ label, val, Icon: DashIcon }) => (
        <div key={label} style={{ textAlign:"center" }}>
          <DashIcon size={18} strokeWidth={1.8} style={{ color:"rgba(0,200,180,0.6)",marginBottom:4 }} />
          <div style={{ fontFamily:"var(--font-archivo-narrow)",fontWeight:800,fontSize:20,color:"#00c8b4" }}>{val}</div>
          <div style={{ fontFamily:"var(--font-jetbrains)",fontSize:8,color:"rgba(255,255,255,0.35)",textTransform:"uppercase",letterSpacing:"0.12em",marginTop:2 }}>{label}</div>
        </div>
      ))}
      <div style={{ display:"flex",alignItems:"center",justifyContent:"center" }}>
        <button onClick={onQuiz} style={{ background:"rgba(0,200,180,0.1)",border:"1.5px solid rgba(0,200,180,0.4)",borderRadius:10,padding:"10px 16px",color:"#00c8b4",fontFamily:"var(--font-jetbrains)",fontWeight:700,fontSize:10,letterSpacing:"0.12em",textTransform:"uppercase",cursor:"pointer",transition:"all 0.18s" }}>
          <div style={{ display:"flex",alignItems:"center",gap:6,justifyContent:"center" }}>
            <BookOpen size={11} strokeWidth={2} />
            <span>Take Quiz</span>
          </div>
          <span style={{ fontSize:8,color:"rgba(0,200,180,0.6)",display:"block",marginTop:3 }}>Earn boost points</span>
        </button>
      </div>
    </div>
  );
}

/* ─── Result Card ───────────────────────────────────────── */
function ResultCard({ result, d1, d2, circuitKey, weather }: {
  result: { w1: number; w2: number };
  d1: Driver; d2: Driver;
  circuitKey: string; weather: WeatherKey;
}) {
  const total = result.w1 + result.w2;
  const pct1 = ((result.w1 / total) * 100).toFixed(1);
  const pct2 = ((result.w2 / total) * 100).toFixed(1);
  const winner = result.w1 > result.w2 ? d1 : d2;
  const winnerPct = result.w1 > result.w2 ? pct1 : pct2;

  return (
    <div style={{
      background:"rgba(255,255,255,0.06)",backdropFilter:"blur(40px)",
      border:"1px solid rgba(255,255,255,0.12)",borderTopColor:"rgba(255,255,255,0.22)",
      borderRadius:28,overflow:"hidden",marginBottom:32,
      boxShadow:"0 12px 48px rgba(0,0,0,0.6),inset 0 1px 0 rgba(255,255,255,0.12)",
    }}>
      {/* Winner banner */}
      <div style={{ background:"linear-gradient(135deg,rgba(0,200,180,0.15),rgba(0,100,90,0.1))",borderBottom:"1px solid rgba(0,200,180,0.2)",padding:"24px 28px",display:"flex",alignItems:"center",gap:24,flexWrap:"wrap" }}>
        {/* Winner photo */}
        <div style={{ width:90,height:90,borderRadius:"50%",overflow:"hidden",border:"3px solid #00c8b4",flexShrink:0,boxShadow:"0 0 24px rgba(0,200,180,0.4)" }}>
          <img src={winner.photo} alt={winner.name} style={{ width:"100%",height:"100%",objectFit:"cover",objectPosition:"top center" }} onError={e => (e.currentTarget.style.display="none")} />
        </div>
        <div>
          <div style={{ fontFamily:"var(--font-jetbrains)",fontSize:10,letterSpacing:"0.2em",textTransform:"uppercase",color:"rgba(255,255,255,0.35)",marginBottom:4 }}>
            SIMULATION RESULT · {CIRCUITS[circuitKey].name} · {WEATHER_LABELS[weather]}
          </div>
          <div style={{ fontFamily:"var(--font-archivo)",fontWeight:900,fontSize:"clamp(22px,4vw,38px)",textTransform:"uppercase",color:"#fff",lineHeight:1 }}>
            <span style={{ color:"#00e8d0" }}>{winner.name}</span>
          </div>
          <div style={{ fontFamily:"var(--font-archivo)",fontWeight:900,fontSize:"clamp(14px,2.5vw,20px)",color:"rgba(255,255,255,0.5)",textTransform:"uppercase",marginTop:2 }}>
            wins {winnerPct}% of 100,000 races
          </div>
        </div>
        <div style={{ marginLeft:"auto",fontFamily:"var(--font-archivo-narrow)",fontWeight:800,fontSize:48,color:"#00e8d0",textShadow:"0 0 30px rgba(0,232,208,0.5)" }}>
          {winnerPct}%
        </div>
      </div>

      {/* Stats section */}
      <div style={{ padding:"20px 28px" }}>
        {/* Win bar */}
        <div style={{ display:"flex",alignItems:"center",gap:14,marginBottom:16 }}>
          <div style={{ flex:1,textAlign:"right" }}>
            <div style={{ fontFamily:"var(--font-archivo-narrow)",fontWeight:800,fontSize:24,color:"#00e8d0" }}>{pct1}%</div>
            <div style={{ fontFamily:"var(--font-jetbrains)",fontSize:9,color:"rgba(255,255,255,0.4)",textTransform:"uppercase",letterSpacing:"0.1em" }}>{d1.name.split(" ").pop()}</div>
          </div>
          <div style={{ flex:2 }}>
            <div style={{ height:16,background:"rgba(255,255,255,0.1)",borderRadius:99,overflow:"hidden",display:"flex" }}>
              <div style={{ width:pct1+"%",background:"linear-gradient(90deg,#00c8b4,#00e8d0)",borderRadius:"99px 0 0 99px",transition:"width 0.8s cubic-bezier(0.2,0.8,0.2,1)" }} />
              <div style={{ flex:1,background:"linear-gradient(90deg,#e8303a,#f87171)",borderRadius:"0 99px 99px 0" }} />
            </div>
          </div>
          <div style={{ flex:1,textAlign:"left" }}>
            <div style={{ fontFamily:"var(--font-archivo-narrow)",fontWeight:800,fontSize:24,color:"#f87171" }}>{pct2}%</div>
            <div style={{ fontFamily:"var(--font-jetbrains)",fontSize:9,color:"rgba(255,255,255,0.4)",textTransform:"uppercase",letterSpacing:"0.1em" }}>{d2.name.split(" ").pop()}</div>
          </div>
        </div>

        {/* Win counts + driver photos */}
        <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:12 }}>
          {[
            { d:d1, wins:result.w1, pct:pct1, color:"#00e8d0" },
            { d:d2, wins:result.w2, pct:pct2, color:"#f87171" },
          ].map(s => (
            <div key={s.d.key} style={{ background:"rgba(255,255,255,0.05)",border:"1px solid rgba(255,255,255,0.1)",borderRadius:16,padding:"14px 16px",display:"flex",alignItems:"center",gap:12 }}>
              <div style={{ width:40,height:40,borderRadius:"50%",overflow:"hidden",border:`2px solid ${s.color}55`,flexShrink:0 }}>
                <img src={s.d.photo} alt={s.d.name} style={{ width:"100%",height:"100%",objectFit:"cover",objectPosition:"top center" }} onError={e => (e.currentTarget.style.display="none")} />
              </div>
              <div>
                <div style={{ fontFamily:"var(--font-jetbrains)",fontSize:9,letterSpacing:"0.12em",textTransform:"uppercase",color:"rgba(255,255,255,0.4)",marginBottom:4 }}>{s.d.name.split(" ").pop()}</div>
                <div style={{ fontFamily:"var(--font-archivo-narrow)",fontWeight:800,fontSize:22,color:s.color }}>{s.wins.toLocaleString()}</div>
                <div style={{ fontFamily:"var(--font-jetbrains)",fontSize:8,color:"rgba(255,255,255,0.3)" }}>race wins</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ─── Main Page ─────────────────────────────────────────── */
export default function GoatSimulator() {
  const [authOpen, setAuthOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
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

  // Get effective driver stats (with custom overrides)
  function getEffectiveDriver(driver: Driver): Driver {
    const cs = sim.customStats[driver.key] || {};
    return Object.keys(cs).length > 0 ? { ...driver, ...cs } : driver;
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, u => setUser(u));
    return unsubscribe;
  }, []);

  const runSim = useCallback(() => {
    if (!user) { setAuthOpen(true); return; }
    if (!sim.isUnlocked(d1Key) || !sim.isUnlocked(d2Key)) return;
    setRunning(true);
    setResult(null);
    setTimeout(() => {
      const ed1 = getEffectiveDriver(d1);
      const ed2 = getEffectiveDriver(d2);
      const [w1, w2] = simulateRace(ed1, ed2, CIRCUITS[circuitKey], weather);
      setResult({ w1, w2 });
      setRunning(false);
      sim.recordRun();
    }, 800);
  }, [d1, d2, circuitKey, weather, sim, d1Key, d2Key, user]);

  // Find runs needed to unlock a locked driver
  function runsUntilDriver(key: string): number {
    const { UNLOCK_THRESHOLDS } = require("@/data/drivers");
    return Math.max(0, (UNLOCK_THRESHOLDS[key] || 99) - sim.simCount);
  }

  return (
    <>
      <div className="dotted-surface" />
      <Nav onLoginClick={() => setAuthOpen(true)} />
      <AuthModal open={authOpen} onClose={() => setAuthOpen(false)} />
      {quizOpen && <QuizModal onClose={() => setQuizOpen(false)} onPass={(pts) => sim.addBoostPoints(pts, "main")} />}
      {lockedDriver && <LockModal driver={lockedDriver} runsLeft={runsUntilDriver(lockedDriver.key)} onClose={() => setLockedDriver(null)} />}

      <div className="page-content">
        <div className="ambient-bg" />
        <div className="page-inner">

          {/* Header */}
          <header style={{ textAlign:"center",marginBottom:26 }}>
            <div style={{ fontFamily:"var(--font-saira)",fontWeight:600,fontSize:11,letterSpacing:"0.32em",color:"rgba(255,255,255,0.45)",textTransform:"uppercase",marginBottom:10 }}>100,000 Race Simulation Engine</div>
            <h1 className="hero-heading" style={{ fontSize:"clamp(32px,8vw,72px)",color:"#fff" }}>
              <span style={{ color:"#e8303a" }} className="neon-text-red">GOAT</span>{" "}SIMULATOR
            </h1>
            <div style={{ color:"rgba(255,255,255,0.5)",fontSize:14,marginTop:10,fontFamily:"var(--font-saira)",fontWeight:800,letterSpacing:"0.08em",textTransform:"uppercase" }}>
              WHO REALLY IS THE GREATEST? · HOVER STATS FOR RATIONALE
            </div>
          </header>

          {/* Auth gate */}
          {!user && <AuthBanner onLogin={() => setAuthOpen(true)} />}

          {/* Dashboard */}
          <Dashboard
            simCount={sim.simCount}
            lockedCount={sim.lockedCount}
            unlockedCount={sim.unlockedCount}
            boostPoints={sim.boostPoints}
            runsUntilNext={sim.runsUntilNext}
            onQuiz={() => setQuizOpen(true)}
          />

          {/* Driver pickers */}
          <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:18,marginBottom:20 }} className="driver-pickers">
            {/* Driver 1 */}
            <div>
              <div style={{ fontFamily:"var(--font-saira)",fontWeight:700,fontSize:10,letterSpacing:"0.26em",textTransform:"uppercase",color:"rgba(0,200,180,0.7)",marginBottom:10 }}>
                DRIVER 1
              </div>
              <DriverGrid
                selectedKey={d1Key}
                onSelect={k => { if (k !== d2Key) setD1Key(k); }}
                accentColor="#00c8b4"
                isUnlocked={sim.isUnlocked}
                onLockedClick={setLockedDriver}
                runsUntilNext={sim.runsUntilNext}
              />
              <DriverStatsPanel driver={getEffectiveDriver(d1)} accentColor="#00c8b4" customStats={sim.customStats[d1Key] || {}} slot={1} />
            </div>
            {/* Driver 2 */}
            <div>
              <div style={{ fontFamily:"var(--font-saira)",fontWeight:700,fontSize:10,letterSpacing:"0.26em",textTransform:"uppercase",color:"rgba(232,48,58,0.7)",marginBottom:10 }}>
                DRIVER 2
              </div>
              <DriverGrid
                selectedKey={d2Key}
                onSelect={k => { if (k !== d1Key) setD2Key(k); }}
                accentColor="#e8303a"
                isUnlocked={sim.isUnlocked}
                onLockedClick={setLockedDriver}
                runsUntilNext={sim.runsUntilNext}
              />
              <DriverStatsPanel driver={getEffectiveDriver(d2)} accentColor="#e8303a" customStats={sim.customStats[d2Key] || {}} slot={2} />
            </div>
          </div>

          {/* Custom Stats */}
          <CustomStatsPanel
            d1={d1} d2={d2}
            customStats={sim.customStats}
            onSetStat={sim.setCustomStat}
            onReset={sim.resetCustomStats}
          />

          {/* Animated Track */}
          <AnimatedTrack circuitKey={circuitKey} running={running} d1={d1} d2={d2} />

          {/* Circuit & Weather */}
          <div style={{ display:"grid",gridTemplateColumns:"1fr auto",gap:20,marginBottom:20,alignItems:"start" }} className="cw-row">
            <div style={{ background:"rgba(255,255,255,0.06)",backdropFilter:"blur(20px)",border:"1px solid rgba(255,255,255,0.1)",borderRadius:20,padding:"18px 20px" }}>
              <CircuitSelector value={circuitKey} onChange={setCircuitKey} />
            </div>
            <div style={{ background:"rgba(255,255,255,0.06)",backdropFilter:"blur(20px)",border:"1px solid rgba(255,255,255,0.1)",borderRadius:20,padding:"18px 20px",minWidth:200 }}>
              <div style={{ fontFamily:"var(--font-saira)",fontWeight:700,fontSize:10,letterSpacing:"0.26em",textTransform:"uppercase",color:"rgba(255,255,255,0.4)",marginBottom:10 }}>☁️ WEATHER</div>
              <div style={{ display:"flex",flexDirection:"column",gap:8 }}>
                {(["dry","damp","wet"] as WeatherKey[]).map(w => (
                  <button key={w} onClick={() => setWeather(w)} style={{
                    padding:"10px 12px",borderRadius:10,border:"1.5px solid",
                    borderColor:weather===w?"#00c8b4":"rgba(255,255,255,0.12)",
                    background:weather===w?"rgba(0,200,180,0.12)":"rgba(255,255,255,0.04)",
                    color:weather===w?"#00e8d0":"rgba(255,255,255,0.5)",
                    fontFamily:"var(--font-saira)",fontWeight:700,fontSize:11,
                    letterSpacing:"0.1em",textTransform:"uppercase",cursor:"pointer",
                    transition:"all 0.18s",textAlign:"left",
                  }}>
                    <div>{WEATHER_LABELS[w]}</div>
                    <div style={{ fontSize:9,color:weather===w?"rgba(0,232,208,0.6)":"rgba(255,255,255,0.3)",marginTop:2,fontWeight:600,letterSpacing:"0.06em" }}>{WEATHER_DESCS[w]}</div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Run button */}
          <div style={{ textAlign:"center",margin:"24px 0" }}>
            <button
              onClick={runSim}
              disabled={running || d1Key === d2Key}
              style={{
                background: !user ? "linear-gradient(135deg,rgba(232,48,58,0.7),rgba(255,107,107,0.7))" : "linear-gradient(135deg,#e8303a,#ff6b6b)",
                color:"#fff",border:"none",borderRadius:16,padding:"18px 48px",
                fontFamily:"var(--font-archivo)",fontWeight:900,fontSize:18,
                letterSpacing:"0.05em",textTransform:"uppercase",
                cursor:running||d1Key===d2Key?"not-allowed":"pointer",
                opacity:d1Key===d2Key?0.5:1,
                boxShadow:"0 8px 32px rgba(232,48,58,0.4)",transition:"transform 0.2s,box-shadow 0.2s",
                display:"inline-flex",alignItems:"center",gap:10,
              }}
            >
              {!user && <LogIn size={18} strokeWidth={2} />}
              {running ? "⏱ Simulating 100,000 races..." : !user ? "Sign In to Run Simulation" : "▶ Run 100,000 Races"}
            </button>
            {d1Key === d2Key && <div style={{ marginTop:8,fontFamily:"var(--font-jetbrains)",fontSize:11,color:"#f87171" }}>Select two different drivers</div>}
            {sim.runsUntilNext && (
              <div style={{ marginTop:10,fontFamily:"var(--font-jetbrains)",fontSize:10,color:"rgba(0,200,180,0.6)",letterSpacing:"0.08em" }}>
                🔒 {sim.runsUntilNext.runs} more run{sim.runsUntilNext.runs!==1?"s":""} to unlock next driver
              </div>
            )}
          </div>

          {/* Result */}
          {result && (
            <ResultCard result={result} d1={getEffectiveDriver(d1)} d2={getEffectiveDriver(d2)} circuitKey={circuitKey} weather={weather} />
          )}

        </div>
      </div>

      <style>{`
        .driver-pickers { grid-template-columns: 1fr 1fr; }
        @media(max-width:768px) { .driver-pickers { grid-template-columns: 1fr; } .cw-row { grid-template-columns: 1fr !important; } }
        @media(max-width:480px) { .driver-pickers > div > div[style*="repeat(3"] { grid-template-columns: repeat(3,1fr) !important; } }
        .fill-blue  { background:linear-gradient(90deg,#1a5fd4,#3b8ef8,#6ab4ff); box-shadow:0 0 8px rgba(59,142,248,.55); }
        .fill-green { background:linear-gradient(90deg,#0a8c3a,#1ec95a,#5de88a); box-shadow:0 0 8px rgba(30,201,90,.5); }
        .fill-yellow{ background:linear-gradient(90deg,#c47000,#f0a000,#fdd05a); box-shadow:0 0 8px rgba(240,160,0,.5); }
        .fill-red   { background:linear-gradient(90deg,#b81518,#e83030,#ff7070); box-shadow:0 0 8px rgba(232,48,48,.5); }
        @keyframes slideDown { from{opacity:0;transform:translateY(-8px)} to{opacity:1;transform:none} }
      `}</style>
    </>
  );
}
