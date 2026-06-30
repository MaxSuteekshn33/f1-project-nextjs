"use client";

import { useState } from "react";
import Link from "next/link";
import Nav from "@/components/Nav";
import AuthModal from "@/components/AuthModal";
import { BentoGrid, type BentoItem } from "@/components/BentoGrid";
import { CTAWithRectangle } from "@/components/CTAWithRectangle";
import { Trophy, MessageSquare, BookOpen, Users, Gauge, Flag, Settings, Clock, Lock, Shield, Mail, Zap, AlertTriangle, Filter, Car, Code2, BarChart2, Lightbulb } from "@/components/Icons";
import { TimelineContent } from "@/components/ui/timeline-animation";
import IntroVideo from "@/components/IntroVideo";

const BENTO_ITEMS: BentoItem[] = [
  {
    id: "goat",
    href: "/goat-simulator",
    title: "GOAT Simulator",
    description: "Run 100,000 simulated races. Pick two legends and settle the GOAT debate with data.",
    accentColor: "#f87171",
    borderColor: "rgba(232,48,58,0.2)",
    bg: "rgba(232,48,58,0.08)",
    cta: "Run the Simulation",
    className: "wide",
    body: (
      <div style={{ display: "grid", gap: 8 }}>
        {[
          { label: "Pace", fill: 99, cls: "fill-red", val: "99", valColor: "#f87171" },
          { label: "Wet Mastery", fill: 100, cls: "fill-blue", val: "100", valColor: "#818cf8" },
          { label: "Racecraft", fill: 95, cls: "fill-yellow", val: "95", valColor: "#fcd34d" },
        ].map(s => (
          <div key={s.label} style={{ display: "grid", gridTemplateColumns: "110px 1fr 36px", alignItems: "center", gap: 6 }}>
            <span style={{ fontFamily: "var(--font-jetbrains)", fontWeight: 600, fontSize: 12, letterSpacing: "0.08em", textTransform: "uppercase", color: "rgba(255,255,255,0.6)" }}>{s.label}</span>
            <div style={{ height: 7, background: "rgba(255,255,255,0.12)", borderRadius: 99, overflow: "hidden" }}>
              <div className={s.cls} style={{ height: "100%", borderRadius: 99, width: s.fill + "%" }} />
            </div>
            <span style={{ fontFamily: "var(--font-jetbrains)", fontSize: 14, fontWeight: 700, color: s.valColor, textAlign: "right" }}>{s.val}</span>
          </div>
        ))}
        <div style={{ display: "flex", gap: 8, marginTop: 6, flexWrap: "wrap" }}>
          {["🇧🇷 Senna #12", "🇩🇪 Schumacher #1", "🇬🇧 Hamilton #44"].map(tag => (
            <div key={tag} style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "rgba(232,48,58,0.1)", border: "1px solid rgba(232,48,58,0.22)", borderRadius: 99, padding: "4px 12px", fontFamily: "var(--font-archivo-narrow)", fontWeight: 700, fontSize: 13, color: "#f87171" }}>{tag}</div>
          ))}
        </div>
      </div>
    ),
  },
  {
    id: "discuss",
    href: "/comments",
    title: "Discussion Board",
    description: "F1's most passionate fans, one place. No algorithm — just hot takes.",
    accentColor: "#34d399",
    borderColor: "rgba(52,211,153,0.18)",
    bg: "rgba(16,185,129,0.07)",
    cta: "Join the Debate",
    body: (
      <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
        {[
          { user: "SENNA_FAN_1994", text: "Senna in 2024 machinery? 25 wins minimum 🐐" },
          { user: "SCHUMI_ERA", text: "Schumi dominated FOR YEARS. That never repeats." },
          { user: "MAX33_FAN", text: "19 wins in one season. The debate is over." },
        ].map(c => (
          <div key={c.user} style={{ background: "rgba(52,211,153,0.07)", border: "1px solid rgba(52,211,153,0.15)", borderRadius: 10, padding: "7px 12px" }}>
            <div style={{ fontFamily: "var(--font-jetbrains)", fontWeight: 500, fontSize: 8, letterSpacing: "0.12em", textTransform: "uppercase", color: "#34d399", marginBottom: 3 }}>{c.user}</div>
            <div style={{ fontFamily: "var(--font-inter)", fontWeight: 500, fontSize: 13, color: "rgba(255,255,255,0.8)", lineHeight: 1.5 }}>{c.text}</div>
          </div>
        ))}
      </div>
    ),
  },
  {
    id: "guide",
    href: "/f1-guide",
    title: "F1 Beginner's Guide",
    description: "From zero to fanatic. Rules, strategy, history — everything explained simply.",
    accentColor: "#818cf8",
    borderColor: "rgba(129,140,248,0.2)",
    bg: "rgba(99,102,241,0.08)",
    cta: "Start Learning",
    body: (
      <div>
        {[
          { Icon: Gauge,    text: "How the Points System Works" },
          { Icon: Flag,     text: "Flags, Pit Stops & Safety Cars" },
          { Icon: Settings, text: "Race Strategy Explained" },
          { Icon: Clock,    text: "History of Formula 1" },
        ].map(({ Icon, text }) => (
          <div key={text} style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 0", borderBottom: "1px solid rgba(129,140,248,0.08)" }}>
            <Icon size={14} strokeWidth={2} style={{ color: "rgba(129,140,248,0.7)", flexShrink: 0 }} />
            <span style={{ fontFamily: "var(--font-inter)", fontWeight: 500, fontSize: 13, color: "rgba(165,180,252,0.85)" }}>{text}</span>
          </div>
        ))}
      </div>
    ),
  },
  {
    id: "drivers",
    href: "/know-your-drivers",
    title: "Know Your Drivers",
    description: "19 legendary drivers — Fangio to Verstappen. Stats, bios, ratings, iconic quotes.",
    accentColor: "#fcd34d",
    borderColor: "rgba(252,211,77,0.18)",
    bg: "rgba(245,158,11,0.07)",
    cta: "Explore Drivers",
    className: "wide",
    body: (
      <div>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 10 }}>
          <div style={{ width: 52, height: 52, borderRadius: 14, overflow: "hidden", border: "1px solid rgba(252,211,77,0.25)", flexShrink: 0 }}>
            <img src="/drivers/hamilton.jpg" alt="Hamilton" style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "top" }} />
          </div>
          <div>
            <div style={{ fontFamily: "var(--font-archivo-narrow)", fontWeight: 800, fontSize: 19, textTransform: "uppercase", color: "#fcd34d", lineHeight: 1.1 }}>Hamilton</div>
            <div style={{ fontFamily: "var(--font-jetbrains)", fontWeight: 500, fontSize: 10, letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(255,255,255,0.45)", marginTop: 3 }}>Modern Era · 🇬🇧</div>
          </div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6 }}>
          {[{ num: "7", lbl: "Titles" }, { num: "103", lbl: "Wins" }, { num: "104", lbl: "Poles" }, { num: "35%", lbl: "Win Rate" }].map(s => (
            <div key={s.lbl} style={{ background: "rgba(252,211,77,0.08)", border: "1px solid rgba(252,211,77,0.18)", borderRadius: 12, padding: "6px 8px", textAlign: "center" }}>
              <div style={{ fontFamily: "var(--font-jetbrains)", fontWeight: 700, fontSize: 20, color: "#fcd34d", lineHeight: 1 }}>{s.num}</div>
              <div style={{ fontFamily: "var(--font-jetbrains)", fontWeight: 600, fontSize: 10, letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(255,255,255,0.45)", marginTop: 2 }}>{s.lbl}</div>
            </div>
          ))}
        </div>
      </div>
    ),
  },
];

export default function AboutPage() {
  const [authOpen, setAuthOpen] = useState(false);
  const [cardFlipped, setCardFlipped] = useState(false);

  return (
    <>
      <IntroVideo />
      <div className="dotted-surface" />
      <Nav onLoginClick={() => setAuthOpen(true)} />
      <AuthModal open={authOpen} onClose={() => setAuthOpen(false)} />

      <div style={{ paddingTop: 64, position: "relative", zIndex: 1 }}>
        <div className="ambient-bg" />

        <div style={{ maxWidth: 920, margin: "0 auto", padding: "40px 24px 80px", position: "relative", zIndex: 2 }}>

          <header style={{ textAlign: "center", marginBottom: 52, paddingTop: 8 }}>
            <TimelineContent as="div" animationNum={0} style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.18)", borderRadius: 99, padding: "5px 16px", marginBottom: 16, fontFamily: "var(--font-jetbrains)", fontWeight: 500, fontSize: 10, letterSpacing: "0.2em", color: "rgba(255,255,255,0.55)", textTransform: "uppercase" }}>
              Formula 1 · Decoded & Debated
            </TimelineContent>
            <TimelineContent as="h1" animationNum={1} className="hero-heading" style={{ fontSize: "clamp(36px, 7vw, 72px)", color: "#ffffff" }}>
              THE <span style={{ color: "#e8303a" }} className="neon-text-red">F1</span> PROJECT
            </TimelineContent>
            <TimelineContent as="div" animationNum={2} style={{ color: "rgba(255,255,255,0.35)", fontSize: 12, marginTop: 14, fontFamily: "var(--font-jetbrains)", fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase" }}>
              GOAT Debates · Driver Profiles · Beginner Guides · Community
            </TimelineContent>
          </header>

          {/* Feature Cards — Bento Grid */}
          <section style={{ marginBottom: 60 }}>
            <BentoGrid items={BENTO_ITEMS} />
          </section>

          {/* Creator Card */}
          <TimelineContent as="div" animationNum={0} style={{ fontFamily: "var(--font-jetbrains)", fontWeight: 800, fontSize: 11, letterSpacing: "0.25em", textTransform: "uppercase", color: "rgba(255,255,255,0.32)", marginBottom: 28, display: "flex", alignItems: "center", gap: 14 }}>
            <span style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.07)", display: "block" }} />
            ABOUT THE CREATOR
            <span style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.07)", display: "block" }} />
          </TimelineContent>

          <TimelineContent as="div" animationNum={1} style={{ display: "flex", justifyContent: "center", marginBottom: 48 }}>
            <div onClick={() => setCardFlipped(!cardFlipped)} style={{
              width: "min(720px, 100%)", cursor: "pointer",
              background: "rgba(255,255,255,0.06)", backdropFilter: "blur(60px) saturate(180%)",
              WebkitBackdropFilter: "blur(60px) saturate(180%)",
              border: "1px solid rgba(255,255,255,0.12)", borderTopColor: "rgba(255,255,255,0.22)",
              borderRadius: 28, overflow: "hidden",
              boxShadow: "0 8px 48px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.14)",
            }}>
              {!cardFlipped ? (
                <div className="card-front-grid">
                  <div style={{ padding: "28px 20px 24px", borderRight: "1px solid rgba(255,255,255,0.08)", display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", background: "rgba(255,255,255,0.04)" }}>
                    <div style={{ width: 120, height: 120, borderRadius: "50%", overflow: "hidden", border: "3px solid rgba(177,151,252,0.6)", boxShadow: "0 0 24px rgba(177,151,252,0.3), 0 0 0 6px rgba(177,151,252,0.08)", marginBottom: 14 }}>
                      <img src="/SuteekshnPic.jpeg" alt="Suteekshn" style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "top center" }} />
                    </div>
                    <div style={{ fontFamily: "var(--font-archivo-narrow)", fontWeight: 900, fontSize: 18, textTransform: "uppercase", letterSpacing: "0.02em", color: "#fff", lineHeight: 1.1, marginBottom: 4 }}>Suteekshn Mahajan</div>
                    <div style={{ fontFamily: "var(--font-jetbrains)", fontWeight: 700, fontSize: 9, letterSpacing: "0.12em", textTransform: "uppercase", color: "rgba(0,220,200,0.9)", marginBottom: 16 }}>CREATOR · GEOPOLITICS · F1 FAN</div>
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8, background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 16, padding: "12px 14px", width: "100%", marginTop: "auto" }}>
                      <div style={{ width: 48, height: 48, borderRadius: 12, overflow: "hidden", border: "1px solid rgba(177,151,252,0.3)" }}>
                        <img src="/HIPPOS.jpeg" alt="Hippos" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                      </div>
                      <div style={{ fontFamily: "var(--font-archivo-narrow)", fontWeight: 800, fontSize: 13, textTransform: "uppercase", letterSpacing: "0.08em", color: "#fff" }}>HIPPOS</div>
                      <div style={{ fontFamily: "var(--font-saira)", fontWeight: 800, fontSize: 9, letterSpacing: "0.12em", color: "rgba(0,200,180,0.6)", textTransform: "uppercase" }}>THINK TANK CONSULTING FIRM</div>
                    </div>
                  </div>
                  <div style={{ padding: "24px 24px 22px", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                    <div>
                      <div style={{ fontFamily: "var(--font-jetbrains)", fontWeight: 800, fontSize: 10, letterSpacing: "0.22em", textTransform: "uppercase", color: "rgba(255,255,255,0.35)", marginBottom: 6 }}>TELEMETRY</div>
                      <div style={{ display: "grid", gap: 10 }}>
                        {[
                          { Icon: Car,      lbl: "F1 Fan Since",   bar: 90, fill: "fill-blue",   val: "2016", valColor: "#818cf8" },
                          { Icon: Trophy,   lbl: "GOAT Pick",      bar: 100, fill: "fill-red",   val: "Senna", valColor: "#f87171" },
                          { Icon: Code2,    lbl: "Dev Skill",      bar: 85, fill: "fill-green",  val: "85",   valColor: "#34d399" },
                          { Icon: BarChart2, lbl: "Stats Nerd",    bar: 95, fill: "fill-yellow", val: "95",   valColor: "#fcd34d" },
                          { Icon: Flag,     lbl: "Races Watched",  bar: 88, fill: "fill-purple", val: "500+", valColor: "#d0bfff" },
                        ].map(s => (
                          <div key={s.lbl} style={{ display: "grid", gridTemplateColumns: "18px 86px 1fr 32px", alignItems: "center", gap: 8 }}>
                            <s.Icon size={13} strokeWidth={2} style={{ color: "rgba(255,255,255,0.45)" }} />
                            <span style={{ fontFamily: "var(--font-jetbrains)", fontWeight: 800, color: "#fff", letterSpacing: "0.07em", fontSize: 10, textTransform: "uppercase" }}>{s.lbl}</span>
                            <div style={{ height: 8, background: "rgba(0,0,0,0.35)", borderRadius: 99, overflow: "hidden", border: "1.5px solid rgba(255,255,255,0.08)" }}>
                              <div className={s.fill} style={{ height: "100%", borderRadius: 99, width: s.bar + "%" }} />
                            </div>
                            <span style={{ fontFamily: "var(--font-jetbrains)", fontSize: 13, fontWeight: 800, textAlign: "right", color: s.valColor }}>{s.val}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div style={{ textAlign: "center", marginTop: 18, fontFamily: "var(--font-jetbrains)", fontWeight: 500, fontSize: 9, letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(255,255,255,0.22)", display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
                      <span style={{ fontSize: 13, display: "inline-block", animation: "flipPulse 1.6s ease-in-out infinite" }}>↻</span>
                      FLIP FOR MORE
                    </div>
                  </div>
                </div>
              ) : (
                <div style={{ padding: "24px 22px 22px", background: "rgba(255,255,255,0.04)" }}>
                  <div style={{ fontFamily: "var(--font-jetbrains)", fontWeight: 700, fontSize: 10, textTransform: "uppercase", letterSpacing: "0.18em", color: "rgba(255,255,255,0.38)", marginBottom: 16, borderBottom: "1px solid rgba(255,255,255,0.07)", paddingBottom: 8 }}>QUICK FACTS</div>
                  <div style={{ display: "grid", gap: 8 }}>
                    {[
                      { Icon: Car,        text: "Started watching F1 in 2016 — hooked from the first overtake." },
                      { Icon: Trophy,     text: "GOAT take: Senna was faster than the car itself." },
                      { Icon: Lightbulb,  text: "Built this entire site to settle debates with actual data." },
                      { Icon: Flag,       text: "Favourite race: 2019 German GP. Chaos. Pure chaos." },
                    ].map((f, i) => (
                      <div key={i} style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 14, padding: "10px 14px", display: "flex", alignItems: "flex-start", gap: 10 }}>
                        <f.Icon size={15} strokeWidth={2} style={{ color: "rgba(255,255,255,0.4)", flexShrink: 0, marginTop: 2 }} />
                        <span style={{ fontFamily: "var(--font-inter)", fontWeight: 600, fontSize: 13, color: "rgba(255,255,255,0.78)", lineHeight: 1.5 }}>{f.text}</span>
                      </div>
                    ))}
                  </div>
                  <div style={{ textAlign: "center", marginTop: 16, fontFamily: "var(--font-jetbrains)", fontSize: 9, letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(255,255,255,0.28)", cursor: "pointer" }}>↩ TAP TO FLIP BACK</div>
                </div>
              )}
            </div>
          </TimelineContent>

          {/* LinkedIn CTA */}
          <TimelineContent as="div" animationNum={2} style={{ display: "flex", justifyContent: "center", marginBottom: 48, marginTop: -12 }}>
            <a
              href="https://www.linkedin.com/in/suteekshn-mahajan-443226172?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=ios_app"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: "inline-flex", alignItems: "center", gap: 12,
                background: "linear-gradient(135deg,rgba(10,102,194,0.18),rgba(10,102,194,0.08))",
                border: "1px solid rgba(10,102,194,0.45)",
                borderRadius: 16, padding: "14px 28px",
                textDecoration: "none",
                transition: "all 0.2s",
                boxShadow: "0 4px 20px rgba(10,102,194,0.2)",
              }}
            >
              {/* LinkedIn logo SVG */}
              <svg width="22" height="22" viewBox="0 0 24 24" fill="#0a66c2">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
              </svg>
              <div>
                <div style={{ fontFamily: "var(--font-archivo)", fontWeight: 900, fontSize: 14, color: "#fff", letterSpacing: "0.02em" }}>Connect with Suteekshn</div>
                <div style={{ fontFamily: "var(--font-jetbrains)", fontSize: 9, letterSpacing: "0.15em", textTransform: "uppercase", color: "rgba(10,102,194,0.9)", marginTop: 2 }}>LinkedIn Profile →</div>
              </div>
            </a>
          </TimelineContent>

          {/* About section */}
          <TimelineContent as="section" animationNum={0} style={{ maxWidth: 700, margin: "0 auto 48px" }}>
            <SectionLabel>ABOUT THE PROJECT</SectionLabel>
            <div style={GLASS_BLOCK}>
              <p style={{ marginBottom: 12, color: "rgba(255,255,255,0.72)" }}>The F1 Project is a <strong style={{ color: "#fff" }}>passion project</strong> built to answer one question every fan has: <em>who actually is the GOAT?</em></p>
              <blockquote style={QUOTE_PULL}>"DATA DOESN'T LIE. NEITHER DO 100,000 SIMULATED RACES."</blockquote>
              <p style={{ color: "rgba(255,255,255,0.72)" }}>This isn't just another fan site. It's a <strong style={{ color: "#fff" }}>simulation engine, a driver database, a community forum, and a beginner's guide</strong> — all built from scratch because the debate deserves better than a Twitter poll.</p>
            </div>
            <SectionLabel>WHY THIS EXISTS</SectionLabel>
            <div style={{ display: "grid", gap: 10 }}>
              {[
                ["F1 debate is everywhere", "but almost no one uses real data to back their arguments"],
                ["The GOAT question deserves", "a proper simulation, not vibes and nostalgia"],
                ["New fans need a proper guide", "that explains F1 without dumbing it down"],
                ["The community deserves", "a space to debate freely without an algorithm deciding what's seen"],
              ].map(([bold, rest], i) => (
                <div key={i} style={{ background: "rgba(255,255,255,0.04)", backdropFilter: "blur(20px)", border: "1px solid rgba(255,255,255,0.08)", borderTopColor: "rgba(255,255,255,0.14)", borderRadius: 16, padding: "14px 18px", display: "flex", alignItems: "flex-start", gap: 16 }}>
                  <span style={{ fontFamily: "var(--font-jetbrains)", fontWeight: 700, fontSize: 20, color: "#e8303a", lineHeight: 1, flexShrink: 0 }}>0{i+1}</span>
                  <span style={{ fontFamily: "var(--font-inter)", fontWeight: 500, fontSize: 14, color: "rgba(255,255,255,0.68)", lineHeight: 1.6 }}><strong style={{ color: "#fff" }}>{bold}</strong> — {rest}</span>
                </div>
              ))}
            </div>
          </TimelineContent>

          {/* Stats */}
          <TimelineContent as="div" animationNum={0} className="stats-strip">
            {[{ num: "19", lbl: "Legendary Drivers" }, { num: "100K", lbl: "Race Simulations" }, { num: "10+", lbl: "F1 Guide Topics" }].map(s => (
              <div key={s.lbl} style={{ background: "rgba(255,255,255,0.05)", backdropFilter: "blur(40px) saturate(160%)", border: "1px solid rgba(255,255,255,0.1)", borderTopColor: "rgba(255,255,255,0.2)", borderRadius: 24, padding: "24px 14px", textAlign: "center", boxShadow: "0 4px 24px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.12)" }}>
                <div style={{ fontFamily: "var(--font-archivo-narrow)", fontWeight: 800, fontSize: "clamp(28px,4vw,40px)", color: "#fff", lineHeight: 1, marginBottom: 6 }}>{s.num}</div>
                <div style={{ fontFamily: "var(--font-jetbrains)", fontWeight: 600, fontSize: 9, letterSpacing: "0.15em", textTransform: "uppercase", color: "rgba(255,255,255,0.38)" }}>{s.lbl}</div>
              </div>
            ))}
          </TimelineContent>

          {/* Privacy */}
          <TimelineContent as="section" animationNum={0} style={{ maxWidth: 700, margin: "40px auto 60px" }}>
            <SectionLabel>PRIVACY & TRUST</SectionLabel>
            <div className="privacy-grid">
              {[
                { Icon: Lock,          title: "No data sold. Ever.",  desc: "Your email and profile are never shared or monetised." },
                { Icon: Shield,        title: "Firebase Auth",        desc: "Industry-standard authentication. Passwords are never stored in plain text." },
                { Icon: Mail,          title: "Email verification",   desc: "New accounts require email verification before commenting." },
                { Icon: Zap,           title: "Session-only auth",    desc: "Sessions expire when you close the browser tab." },
                { Icon: AlertTriangle, title: "Rate limiting",        desc: "Comments are rate-limited to prevent spam and abuse." },
                { Icon: Filter,        title: "Input sanitisation",   desc: "All user input is sanitised before storage." },
              ].map(item => (
                <div key={item.title} style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderTopColor: "rgba(255,255,255,0.14)", borderRadius: 18, padding: "16px 18px" }}>
                  <item.Icon size={18} strokeWidth={1.8} style={{ color: "rgba(0,200,180,0.65)", marginBottom: 8 }} />
                  <div style={{ fontFamily: "var(--font-archivo-narrow)", fontWeight: 800, fontSize: 13, textTransform: "uppercase", letterSpacing: "0.05em", color: "#fff", marginBottom: 6 }}>{item.title}</div>
                  <div style={{ fontFamily: "var(--font-inter)", fontSize: 12, color: "rgba(255,255,255,0.5)", lineHeight: 1.6 }}>{item.desc}</div>
                </div>
              ))}
            </div>
          </TimelineContent>

          {/* CTA with Rectangle */}
          <CTAWithRectangle
            badge="Ready to Debate?"
            title="Settle the GOAT Debate Once and For All"
            description="100,000 simulated races. 19 legendary drivers. One community. The data doesn't lie."
            actions={[
              { text: "Run the Simulation", href: "/goat-simulator", variant: "primary" },
              { text: "Know Your Drivers", href: "/know-your-drivers", variant: "secondary" },
            ]}
            className="cta-rect-wrap"
          />

        </div>
      </div>

      <footer style={{ textAlign: "center", fontFamily: "var(--font-jetbrains)", fontWeight: 500, fontSize: 10, color: "rgba(255,255,255,0.25)", letterSpacing: "0.15em", textTransform: "uppercase", padding: "28px 0 36px", borderTop: "1px solid rgba(255,255,255,0.07)", position: "relative", zIndex: 1 }}>
        THE F1 PROJECT · BUILT WITH ♥ BY SUTEEKSHN
      </footer>

      <style>{`
        @keyframes flipPulse { 0%,100%{transform:rotate(0deg)} 50%{transform:rotate(180deg)} }
        /* Fix: use minmax so column never overflows */
        .card-front-grid { display:grid; grid-template-columns:minmax(0,180px) minmax(0,1fr); min-height:320px; }
        .stats-strip { display:grid; grid-template-columns:repeat(3,1fr); gap:12px; margin-bottom:40px; }
        .privacy-grid { display:grid; grid-template-columns:1fr 1fr; gap:10px; }
        .cta-rect-wrap { max-width:700px; margin:0 auto 60px; border-radius:20px; }
        .bento-card-inner:hover { transform:translateY(-8px) !important; box-shadow:0 20px 60px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.12) !important; }
        @media(max-width:480px) { .stats-strip { grid-template-columns:1fr !important; } .card-front-grid { grid-template-columns:1fr !important; } .privacy-grid { grid-template-columns:1fr !important; } }
      `}</style>
    </>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ fontFamily: "var(--font-jetbrains)", fontWeight: 800, fontSize: 10, letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(255,255,255,0.32)", marginBottom: 16, display: "flex", alignItems: "center", gap: 12 }}>
      {children}
      <span style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.07)", display: "block" }} />
    </div>
  );
}

const GLASS_BLOCK: React.CSSProperties = {
  background: "rgba(255,255,255,0.05)", backdropFilter: "blur(40px) saturate(160%)",
  WebkitBackdropFilter: "blur(40px) saturate(160%)",
  border: "1px solid rgba(255,255,255,0.1)", borderTopColor: "rgba(255,255,255,0.18)",
  boxShadow: "0 4px 24px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.1)",
  borderRadius: 24, padding: "24px 28px", marginBottom: 16,
  fontFamily: "var(--font-inter)", fontSize: 15, color: "rgba(255,255,255,0.72)",
  fontWeight: 500, lineHeight: 1.7,
};
const QUOTE_PULL: React.CSSProperties = {
  display: "block", fontFamily: "var(--font-archivo-narrow)", fontWeight: 800,
  fontSize: "clamp(15px,2.2vw,19px)", color: "rgba(255,255,255,0.92)",
  letterSpacing: "0.01em", textTransform: "uppercase",
  borderLeft: "3px solid #e8303a", paddingLeft: 16, margin: "20px 0", lineHeight: 1.3,
};
