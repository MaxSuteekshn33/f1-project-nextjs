"use client";

import { useState } from "react";

export interface ExpandCard {
  id: string;
  photo: string;
  name: string;
  team: string;
  teamColor: string;
  era: string;
  titles: number;
  wins: number;
  peak: string;
  pace: number;
  quali: number;
  racecraft: number;
}

interface Props {
  cards: ExpandCard[];
  defaultExpanded?: string;
  onSelect: (id: string) => void;
}

export default function ExpandDriverCards({ cards, defaultExpanded, onSelect }: Props) {
  const [expanded, setExpanded] = useState<string>(defaultExpanded || cards[0]?.id || "");

  if (cards.length === 0) return null;

  const COLLAPSED_W = "72px";
  const EXPANDED_W  = "260px";

  return (
    <div
      style={{
        display: "flex",
        gap: 6,
        height: 340,
        width: "100%",
        overflowX: "auto",
        overflowY: "visible",
        paddingBottom: 4,
        scrollbarWidth: "none",
      }}
      className="expand-cards-row"
    >
      {cards.map(card => {
        const isExp = card.id === expanded;
        const lastName = card.name.split(" ").pop()!;
        const firstName = card.name.split(" ").slice(0, -1).join(" ");

        return (
          <div
            key={card.id}
            onMouseEnter={() => setExpanded(card.id)}
            onClick={() => onSelect(card.id)}
            style={{
              position: "relative",
              flexShrink: 0,
              width: isExp ? EXPANDED_W : COLLAPSED_W,
              height: "100%",
              borderRadius: 20,
              overflow: "hidden",
              cursor: "pointer",
              transition: "width 0.45s cubic-bezier(0.4, 0, 0.2, 1)",
              border: isExp
                ? `2px solid ${card.teamColor || "rgba(0,200,180,0.6)"}`
                : "1px solid rgba(255,255,255,0.1)",
              boxShadow: isExp
                ? `0 0 28px ${card.teamColor || "#00c8b4"}44, 0 8px 32px rgba(0,0,0,0.5)`
                : "0 4px 16px rgba(0,0,0,0.4)",
            }}
          >
            {/* Background photo */}
            <img
              src={card.photo}
              alt={card.name}
              style={{
                position: "absolute",
                inset: 0,
                width: "100%",
                height: "100%",
                objectFit: "cover",
                objectPosition: "top center",
                transition: "transform 0.45s ease",
                transform: isExp ? "scale(1.04)" : "scale(1)",
              }}
              onError={e => {
                const el = e.currentTarget as HTMLImageElement;
                el.style.display = "none";
              }}
            />

            {/* Dark gradient overlay */}
            <div style={{
              position: "absolute", inset: 0,
              background: isExp
                ? "linear-gradient(to top, rgba(0,0,0,0.88) 0%, rgba(0,0,0,0.3) 45%, transparent 70%)"
                : "linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.55) 100%)",
              transition: "background 0.3s",
            }} />

            {/* Team colour bar — bottom */}
            <div style={{
              position: "absolute", bottom: 0, left: 0, right: 0,
              height: 3, background: card.teamColor || "#00c8b4",
              opacity: isExp ? 1 : 0.5, transition: "opacity 0.3s",
            }} />

            {/* Collapsed: vertical name */}
            {!isExp && (
              <div style={{
                position: "absolute", inset: 0,
                display: "flex", alignItems: "flex-end", justifyContent: "center",
                paddingBottom: 14,
              }}>
                <div style={{
                  writingMode: "vertical-rl",
                  transform: "rotate(180deg)",
                  fontFamily: "var(--font-archivo)",
                  fontWeight: 900,
                  fontSize: 11,
                  textTransform: "uppercase",
                  letterSpacing: "0.1em",
                  color: "rgba(255,255,255,0.8)",
                  lineHeight: 1,
                  maxHeight: 200,
                  overflow: "hidden",
                }}>{lastName}</div>
              </div>
            )}

            {/* Expanded: name + stats */}
            {isExp && (
              <div style={{
                position: "absolute", bottom: 0, left: 0, right: 0,
                padding: "16px 16px 18px",
              }}>
                {/* Name */}
                <div style={{ marginBottom: 8 }}>
                  <div style={{ fontFamily: "var(--font-archivo)", fontWeight: 900, fontSize: 22, textTransform: "uppercase", color: "#fff", lineHeight: 1 }}>{lastName}</div>
                  <div style={{ fontFamily: "var(--font-saira)", fontSize: 10, fontWeight: 600, color: "rgba(255,255,255,0.5)", textTransform: "uppercase", letterSpacing: "0.1em", marginTop: 2 }}>{firstName}</div>
                </div>

                {/* Team + era */}
                <div style={{ fontFamily: "var(--font-jetbrains)", fontSize: 9, letterSpacing: "0.12em", textTransform: "uppercase", color: card.teamColor || "#00c8b4", marginBottom: 10 }}>
                  {card.team.split("·")[0].trim()} · {card.era}
                </div>

                {/* Mini stats */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 6, marginBottom: 10 }}>
                  {[
                    { label: card.titles > 0 ? `${card.titles} WCC` : `${card.wins} W`, sub: card.titles > 0 ? "TITLES" : "WINS" },
                    { label: `${card.pace}`, sub: "PACE" },
                    { label: `${card.racecraft}`, sub: "CRAFT" },
                  ].map(s => (
                    <div key={s.sub} style={{ background: "rgba(0,0,0,0.4)", borderRadius: 8, padding: "5px 6px", textAlign: "center" }}>
                      <div style={{ fontFamily: "var(--font-archivo-narrow)", fontWeight: 800, fontSize: 15, color: "#fff", lineHeight: 1 }}>{s.label}</div>
                      <div style={{ fontFamily: "var(--font-jetbrains)", fontSize: 7, letterSpacing: "0.1em", color: "rgba(255,255,255,0.4)", textTransform: "uppercase", marginTop: 2 }}>{s.sub}</div>
                    </div>
                  ))}
                </div>

                {/* Tap hint */}
                <div style={{ fontFamily: "var(--font-jetbrains)", fontSize: 8, letterSpacing: "0.14em", textTransform: "uppercase", color: "rgba(255,255,255,0.3)" }}>
                  TAP FOR FULL PROFILE →
                </div>
              </div>
            )}
          </div>
        );
      })}

      <style>{`
        .expand-cards-row::-webkit-scrollbar { display: none; }
      `}</style>
    </div>
  );
}
