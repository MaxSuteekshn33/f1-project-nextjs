"use client";

import { useState } from "react";
import Nav from "@/components/Nav";
import AuthModal from "@/components/AuthModal";
import { CTAWithRectangle } from "@/components/CTAWithRectangle";
import Link from "next/link";

const POINTS_TABLE = [
  { pos: "1st", pts: 25 }, { pos: "2nd", pts: 18 }, { pos: "3rd", pts: 15 },
  { pos: "4th", pts: 12 }, { pos: "5th", pts: 10 }, { pos: "6th", pts: 8 },
  { pos: "7th", pts: 6 }, { pos: "8th", pts: 4 }, { pos: "9th", pts: 2 },
  { pos: "10th", pts: 1 }, { pos: "Fastest Lap", pts: 1, note: "(if in top 10)" },
];

const TEAMS = [
  { short: "RBR", name: "Red Bull Racing", titles: 6, info: "The dominant force of the modern era. Adrian Newey's aerodynamic genius powered four straight titles for Vettel (2010–13) and four more for Verstappen (2021–24)." },
  { short: "MER", name: "Mercedes-AMG", titles: 8, info: "The most successful constructor of the hybrid era — eight consecutive constructors' championships from 2014–2021. Hamilton's home." },
  { short: "FER", name: "Scuderia Ferrari", titles: 16, info: "The oldest and most storied team in F1. 16 constructors' championships. The team Fangio, Lauda, Schumacher and Alonso all drove for." },
  { short: "MCL", name: "McLaren Racing", titles: 8, info: "The team of Senna, Prost, and Hamilton's debut. Eight constructors' titles and the most iconic F1 livery — the Marlboro McLaren." },
  { short: "AML", name: "Aston Martin", titles: 0, info: "The reborn Force India / Racing Point, now backed by Lawrence Stroll with Fernando Alonso leading their charge up the grid." },
  { short: "WIL", name: "Williams Racing", titles: 7, info: "Seven constructors' championships — all between 1980 and 1997. The team of Mansell, Prost, Hill, and Villeneuve. Now rebuilding." },
];

const GLOSSARY = [
  { term: "DRS", def: "Drag Reduction System. A movable rear wing element that reduces aerodynamic drag on long straights, enabling faster top speeds and helping overtakes." },
  { term: "Undercut", def: "Pitting earlier than a rival to gain track position. You get the tyre advantage and rejoin ahead if your out-lap is fast enough." },
  { term: "Overcut", def: "Staying out longer to let a rival pit and fall into your \"dirty air\", then pitting yourself onto faster tyres with clear track ahead." },
  { term: "Parc Fermé", def: "Regulations that restrict teams from making setup changes after qualifying. Ensures the race car is effectively the same as the qualifying car." },
  { term: "Marbles", def: "Rubber pellets deposited off the racing line during a race. Going off-line into the marbles dramatically reduces grip." },
  { term: "Safety Car", def: "A Mercedes-AMG GT deployed to neutralise the race during incidents. All cars queue up behind it, gaps are erased, and racing resumes on a restart." },
  { term: "VSC", def: "Virtual Safety Car. A slower version of the Safety Car period where drivers must maintain a minimum delta time rather than physically queuing behind a car." },
  { term: "Stint", def: "A continuous period of racing on one set of tyres between pit stops." },
  { term: "Dirty Air", def: "Turbulent aerodynamic wake behind a car that reduces the downforce of the following car, making it harder to follow closely." },
];

const WEEKEND_TIMELINE = [
  { day: "Friday", title: "Free Practice 1 & 2", body: "Teams run long-run pace tests and tyre compound comparisons. Engineers collect setup data. Rookies often drive FP1 under young driver regulations." },
  { day: "Saturday AM", title: "Free Practice 3", body: "Last chance to fine-tune before qualifying. Teams run simulated qualifying laps to dial in the car." },
  { day: "Saturday PM", title: "Qualifying — Q1 · Q2 · Q3", body: "Q1 (18min): All 22 cars run, 6 slowest eliminated. Q2 (15min): 16 cars run, 6 slowest out. Q3 (12min): Top 10 fight for pole position." },
  { day: "Sunday", title: "Race Day", body: "Formation lap, then 5 red lights go out and they're racing. The race covers roughly 305km (around 50–70 laps depending on circuit). At least one pit stop mandatory (two compound rule)." },
];

export default function F1GuidePage() {
  const [authOpen, setAuthOpen] = useState(false);
  const [openGloss, setOpenGloss] = useState<string | null>(null);

  return (
    <>
      <div className="dotted-surface" />
      <Nav onLoginClick={() => setAuthOpen(true)} />
      <AuthModal open={authOpen} onClose={() => setAuthOpen(false)} />

      <div className="page-content">
        <div className="ambient-bg" />

        <div style={{ maxWidth: 920, margin: "0 auto", padding: "40px 24px 80px", position: "relative", zIndex: 2 }}>

          {/* Header */}
          <header style={{ marginBottom: 36 }}>
            <div style={{ fontFamily: "var(--font-saira)", fontWeight: 600, fontSize: 11, letterSpacing: "0.32em", color: "rgba(255,255,255,0.45)", textTransform: "uppercase", marginBottom: 10 }}>The Sport Explained</div>
            <h1 style={{ fontFamily: "var(--font-archivo)", fontWeight: 900, fontSize: "clamp(32px,7vw,64px)", lineHeight: 0.92, letterSpacing: "-0.02em", textTransform: "uppercase", color: "#fff", marginBottom: 10 }}>
              F1 <span style={{ color: "#f87171" }}>Beginner's</span> Guide
            </h1>
            <div style={{ color: "rgba(255,255,255,0.4)", fontSize: 14, fontFamily: "var(--font-saira)", fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase" }}>
              Everything you need to understand Formula 1 — from zero to fanatic
            </div>
          </header>

          {/* TOC */}
          <div style={{ background: "rgba(255,255,255,0.05)", backdropFilter: "blur(40px) saturate(160%)", border: "1px solid rgba(255,255,255,0.1)", borderLeft: "3px solid #a78bfa", borderRadius: 20, padding: "20px 24px", marginBottom: 40 }}>
            <div style={{ fontFamily: "var(--font-jetbrains)", fontWeight: 700, fontSize: 11, letterSpacing: "0.2em", textTransform: "uppercase", color: "#a78bfa", marginBottom: 14 }}>What's in this guide</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px 24px" }} className="toc-grid">
              {[
                ["#what-is-f1","01","What is Formula 1?"],
                ["#race-weekend","02","How a Race Weekend Works"],
                ["#points","03","The Points System"],
                ["#strategy","04","Race Strategy Explained"],
                ["#teams","05","The Key Teams"],
                ["#glossary","06","F1 Glossary"],
              ].map(([href, num, label]) => (
                <a key={href} href={href} style={{ fontFamily: "var(--font-inter)", fontSize: 14, color: "rgba(255,255,255,0.65)", textDecoration: "none", display: "flex", alignItems: "center", gap: 10 }}>
                  <span style={{ fontFamily: "var(--font-jetbrains)", fontSize: 10, color: "#a78bfa", fontWeight: 700 }}>{num}</span>
                  {label}
                </a>
              ))}
            </div>
          </div>

          {/* 01 What is F1 */}
          <Section id="what-is-f1" num="01" title="What is Formula 1?">
            <BodyText>Formula 1 is the pinnacle of motorsport — the fastest, most technically advanced racing series on Earth. <strong>Twenty-two drivers</strong> from eleven teams compete in single-seater cars across <strong>22–24 Grand Prix</strong> each year, visiting circuits in more than 20 countries.</BodyText>
            <BodyText>The word <strong>"Formula"</strong> refers to the rules all cars must follow. Every team builds their own car to the same technical regulations — the battle is as much about engineering brilliance as driving skill. A single F1 car costs upwards of <strong>$15 million</strong> and can reach over <strong>370 km/h (230 mph)</strong>.</BodyText>
            <div className="card-grid-3" style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 14, marginTop: 20 }}>
              {[
                { label: "The Season", title: "22–24 Races", body: "Spread across March to December, visiting circuits on 5 continents. Two championships: Drivers' and Constructors'." },
                { label: "The Teams", title: "11 Constructors", body: "Each team builds and races two cars. 2026 sees Cadillac debut and Sauber reborn as the Audi works team." },
                { label: "The Drivers", title: "22 Drivers", body: "Two per team. The top drivers earn over $50M per year. The best compete here for their entire careers." },
              ].map(c => (
                <div key={c.title} style={{ background: "rgba(255,255,255,0.05)", backdropFilter: "blur(40px)", border: "1px solid rgba(255,255,255,0.1)", borderLeft: "3px solid #a78bfa", borderRadius: 18, padding: "16px 18px" }}>
                  <div style={{ fontFamily: "var(--font-jetbrains)", fontSize: 9, letterSpacing: "0.2em", textTransform: "uppercase", color: "#a78bfa", marginBottom: 6 }}>{c.label}</div>
                  <div style={{ fontFamily: "var(--font-archivo-narrow)", fontWeight: 800, fontSize: 18, textTransform: "uppercase", color: "#fff", marginBottom: 8 }}>{c.title}</div>
                  <div style={{ fontFamily: "var(--font-inter)", fontSize: 13, color: "rgba(255,255,255,0.65)", lineHeight: 1.6 }}>{c.body}</div>
                </div>
              ))}
            </div>
          </Section>

          {/* 02 Race Weekend */}
          <Section id="race-weekend" num="02" title="How a Race Weekend Works">
            <BodyText>A Grand Prix weekend spans <strong>three days</strong> — Friday to Sunday — with a structured programme building toward the main event.</BodyText>
            <div style={{ display: "flex", flexDirection: "column", gap: 0, marginTop: 20 }}>
              {WEEKEND_TIMELINE.map((item, i) => (
                <div key={i} style={{ display: "grid", gridTemplateColumns: "90px 20px 1fr", gap: "0 16px", alignItems: "start" }}>
                  <div style={{ fontFamily: "var(--font-jetbrains)", fontSize: 9, letterSpacing: "0.12em", textTransform: "uppercase", color: "rgba(255,255,255,0.4)", paddingTop: 18 }}>{item.day}</div>
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                    <div style={{ width: 12, height: 12, borderRadius: "50%", background: i === 3 ? "#e8303a" : "#a78bfa", marginTop: 14, flexShrink: 0 }} />
                    {i < WEEKEND_TIMELINE.length - 1 && <div style={{ width: 2, flex: 1, background: "rgba(255,255,255,0.1)", minHeight: 40 }} />}
                  </div>
                  <div style={{ padding: "10px 0 20px" }}>
                    <div style={{ fontFamily: "var(--font-archivo-narrow)", fontWeight: 800, fontSize: 16, textTransform: "uppercase", color: "#fff", marginBottom: 6 }}>{item.title}</div>
                    <div style={{ fontFamily: "var(--font-inter)", fontSize: 14, color: "rgba(255,255,255,0.65)", lineHeight: 1.6 }}>{item.body}</div>
                  </div>
                </div>
              ))}
            </div>
          </Section>

          {/* 03 Points */}
          <Section id="points" num="03" title="The Points System">
            <BodyText>Points are awarded to the <strong>top 10 finishers</strong> in each race, plus a bonus point for the fastest lap (if set by a driver finishing in the top 10). The driver and constructor with the most points at season end are champions.</BodyText>
            <div style={{ overflowX: "auto", marginTop: 20, borderRadius: 16 }}>
              <table style={{ width: "100%", borderCollapse: "collapse", background: "rgba(255,255,255,0.04)", backdropFilter: "blur(20px)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 16, overflow: "hidden" }}>
                <thead>
                  <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.1)" }}>
                    <th style={{ padding: "12px 18px", fontFamily: "var(--font-jetbrains)", fontSize: 10, letterSpacing: "0.15em", textTransform: "uppercase", color: "#a78bfa", textAlign: "left" }}>Position</th>
                    <th style={{ padding: "12px 18px", fontFamily: "var(--font-jetbrains)", fontSize: 10, letterSpacing: "0.15em", textTransform: "uppercase", color: "#a78bfa", textAlign: "left" }}>Points</th>
                    <th style={{ padding: "12px 18px", fontFamily: "var(--font-jetbrains)", fontSize: 10, letterSpacing: "0.15em", textTransform: "uppercase", color: "#a78bfa", textAlign: "left" }}>Note</th>
                  </tr>
                </thead>
                <tbody>
                  {POINTS_TABLE.map((row, i) => (
                    <tr key={i} style={{ borderBottom: "1px solid rgba(255,255,255,0.06)", background: i % 2 === 1 ? "rgba(255,255,255,0.02)" : "transparent" }}>
                      <td style={{ padding: "10px 18px", fontFamily: "var(--font-archivo-narrow)", fontWeight: 800, fontSize: 16, color: "#a78bfa" }}>{row.pos}</td>
                      <td style={{ padding: "10px 18px", fontFamily: "var(--font-jetbrains)", fontWeight: 700, fontSize: 18, color: "#fff" }}>{row.pts}</td>
                      <td style={{ padding: "10px 18px", fontFamily: "var(--font-inter)", fontSize: 13, color: "rgba(255,255,255,0.4)" }}>{row.note || ""}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Section>

          {/* 04 Strategy */}
          <Section id="strategy" num="04" title="Race Strategy Explained">
            <BodyText>Race strategy is what separates a good team from a great one. Every team employs a group of engineers who watch tyre degradation data, gap information and weather forecasts in real time to decide when to pit.</BodyText>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginTop: 20 }} className="strategy-grid">
              {[
                { title: "The Undercut", icon: "⬇️", body: "Pitting before your rival gives you fresh tyres. If you can produce a fast out-lap on the new rubber, you can rejoin ahead of them — even if you were behind in the queue for the pit lane." },
                { title: "The Overcut", icon: "⬆️", body: "Staying out longer on worn tyres lets your rival pit into your dirty air. When you eventually pit, you may rejoin ahead on tyres that have already reached operating temperature." },
                { title: "Two-Stop vs One-Stop", icon: "🛑", body: "A two-stop strategy means two pit stops and three tyre stints — faster stints but you lose time in the pits. A one-stop keeps you on track longer. The 'optimal' choice changes every race." },
                { title: "Tyre Compounds", icon: "🛞", body: "Soft tyres (red) are fastest but wear quickly. Mediums (yellow) balance pace and life. Hards (white) are the slowest but last longest. Teams must use at least two different compounds per race." },
              ].map(s => (
                <div key={s.title} style={{ background: "rgba(255,255,255,0.05)", backdropFilter: "blur(40px)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 18, padding: "18px 20px" }}>
                  <div style={{ fontSize: 24, marginBottom: 8 }}>{s.icon}</div>
                  <div style={{ fontFamily: "var(--font-archivo-narrow)", fontWeight: 800, fontSize: 16, textTransform: "uppercase", color: "#fff", marginBottom: 8 }}>{s.title}</div>
                  <div style={{ fontFamily: "var(--font-inter)", fontSize: 14, color: "rgba(255,255,255,0.65)", lineHeight: 1.6 }}>{s.body}</div>
                </div>
              ))}
            </div>
          </Section>

          {/* 05 Teams */}
          <Section id="teams" num="05" title="The Key Teams">
            <BodyText>Eleven teams (constructors) compete in Formula 1. Each builds and races two cars. Here are the biggest names:</BodyText>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginTop: 20 }} className="teams-grid">
              {TEAMS.map(t => (
                <div key={t.short} style={{ background: "rgba(255,255,255,0.05)", backdropFilter: "blur(40px)", border: "1px solid rgba(255,255,255,0.1)", borderLeft: "3px solid #a78bfa", borderRadius: 18, padding: "16px 18px", transition: "box-shadow 0.2s" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
                    <div>
                      <div style={{ fontFamily: "var(--font-jetbrains)", fontSize: 9, letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(255,255,255,0.35)", marginBottom: 4 }}>{t.short}</div>
                      <div style={{ fontFamily: "var(--font-archivo-narrow)", fontWeight: 800, fontSize: 16, textTransform: "uppercase", color: "#fff" }}>{t.name}</div>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <div style={{ fontFamily: "var(--font-jetbrains)", fontWeight: 700, fontSize: 24, color: "#a78bfa", lineHeight: 1 }}>{t.titles}</div>
                      <div style={{ fontFamily: "var(--font-jetbrains)", fontSize: 8, color: "rgba(255,255,255,0.35)", letterSpacing: "0.1em", textTransform: "uppercase" }}>Titles</div>
                    </div>
                  </div>
                  <div style={{ fontFamily: "var(--font-inter)", fontSize: 13, color: "rgba(255,255,255,0.6)", lineHeight: 1.6, borderTop: "1px solid rgba(255,255,255,0.07)", paddingTop: 10 }}>{t.info}</div>
                </div>
              ))}
            </div>
          </Section>

          {/* 06 Glossary */}
          <Section id="glossary" num="06" title="F1 Glossary">
            <BodyText>New to the sport? Here are the terms you'll hear most often:</BodyText>
            <div style={{ display: "flex", flexDirection: "column", gap: 8, marginTop: 20 }}>
              {GLOSSARY.map(g => (
                <div key={g.term} onClick={() => setOpenGloss(openGloss === g.term ? null : g.term)} style={{ background: "rgba(255,255,255,0.04)", backdropFilter: "blur(20px)", border: "1px solid rgba(255,255,255,0.09)", borderTopColor: "rgba(255,255,255,0.15)", borderRadius: 14, padding: "14px 18px", cursor: "pointer", transition: "background 0.2s" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ fontFamily: "var(--font-archivo-narrow)", fontWeight: 800, fontSize: 16, textTransform: "uppercase", letterSpacing: "0.08em", color: "#f87171" }}>{g.term}</span>
                    <span style={{ color: "rgba(255,255,255,0.3)", fontSize: 14, transition: "transform 0.2s", transform: openGloss === g.term ? "rotate(180deg)" : "none" }}>▼</span>
                  </div>
                  {openGloss === g.term && (
                    <div style={{ fontFamily: "var(--font-inter)", fontSize: 14, color: "rgba(255,255,255,0.65)", lineHeight: 1.6, marginTop: 10 }}>{g.def}</div>
                  )}
                </div>
              ))}
            </div>
          </Section>

          {/* CTA with Rectangle */}
          <CTAWithRectangle
            badge="You Know the Basics"
            title="Ready to Go Deeper?"
            description="Put your knowledge to the test. Run 100,000 simulated races and see who really is the GOAT."
            actions={[
              { text: "▶ GOAT Simulator", href: "/goat-simulator", variant: "primary" },
              { text: "⚡ Know Your Drivers", href: "/know-your-drivers", variant: "secondary" },
            ]}
          />

        </div>
      </div>

      <footer style={{ textAlign: "center", fontFamily: "var(--font-jetbrains)", fontWeight: 500, fontSize: 10, color: "rgba(255,255,255,0.25)", letterSpacing: "0.15em", textTransform: "uppercase", padding: "28px 0 36px", borderTop: "1px solid rgba(255,255,255,0.07)", position: "relative", zIndex: 1 }}>
        F1 BEGINNER'S GUIDE · <span style={{ color: "#f87171" }}>F1 PROJECT</span> · DATA BASED ON OFFICIAL FIA REGULATIONS
      </footer>

      <style>{`
        @media(max-width:640px) { .card-grid-3, .strategy-grid, .teams-grid { grid-template-columns:1fr !important; } .toc-grid { grid-template-columns:1fr !important; } }
      `}</style>
    </>
  );
}

function Section({ id, num, title, children }: { id: string; num: string; title: string; children: React.ReactNode }) {
  return (
    <section id={id} style={{ marginBottom: 52 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 20 }}>
        <span style={{ fontFamily: "var(--font-jetbrains)", fontWeight: 700, fontSize: 14, color: "#a78bfa", flexShrink: 0 }}>{num}</span>
        <h2 style={{ fontFamily: "var(--font-archivo)", fontWeight: 900, fontSize: "clamp(22px,4vw,32px)", textTransform: "uppercase", color: "#fff", letterSpacing: "-0.01em", margin: 0 }}>{title}</h2>
        <div style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.08)" }} />
      </div>
      {children}
    </section>
  );
}

function BodyText({ children }: { children: React.ReactNode }) {
  return <p style={{ fontFamily: "var(--font-inter)", fontSize: 15, color: "rgba(255,255,255,0.72)", lineHeight: 1.7, marginBottom: 14 }}><span>{children}</span></p>;
}
