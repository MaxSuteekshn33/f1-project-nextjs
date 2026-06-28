"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";

export interface BentoItem {
  id: string;
  title: string;
  description: string;
  href: string;
  cta: string;
  accentColor: string;
  borderColor: string;
  bg: string;
  neonClass?: string;  // e.g. "neon-red", "neon-teal"
  className?: string;
  body: React.ReactNode;
}

interface Props { items: BentoItem[] }

export function BentoGrid({ items }: Props) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 60);
    return () => clearTimeout(t);
  }, []);

  return (
    <>
      <div className="bento-grid">
        {items.map((item, i) => (
          <BentoCard key={item.id} item={item} index={i} mounted={mounted} />
        ))}
      </div>
      <style>{`
        .bento-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
        }
        .bento-wide { grid-column: span 2; }

        /* Stagger entrance */
        .bento-enter {
          opacity: 0;
          transform: translateY(20px);
          transition: opacity 0.45s var(--ease-out), transform 0.45s var(--ease-out);
        }
        .bento-enter.visible { opacity: 1; transform: translateY(0); }

        /* Card base — glass surface */
        .bento-link {
          display: flex;
          flex-direction: column;
          border-radius: 24px;
          overflow: hidden;
          text-decoration: none;
          position: relative;
          height: 100%;
          /* Glass */
          background: rgba(255,255,255,0.05);
          backdrop-filter: blur(40px) saturate(180%);
          -webkit-backdrop-filter: blur(40px) saturate(180%);
          border: 1px solid rgba(255,255,255,0.10);
          border-top-color: rgba(255,255,255,0.18);
          box-shadow: 0 8px 32px rgba(0,0,0,0.45), inset 0 1px 0 rgba(255,255,255,0.10);
          /* Transition — UI UX Pro: 220ms ease-out */
          transition:
            transform 220ms cubic-bezier(0.16,1,0.3,1),
            box-shadow 220ms cubic-bezier(0.16,1,0.3,1),
            border-color 220ms ease;
        }

        /* Neon accent bar at top */
        .bento-link::before {
          content: "";
          position: absolute;
          top: 0; left: 0; right: 0; height: 2px;
          background: var(--bento-neon, rgba(255,255,255,0.15));
          opacity: 0.7;
          transition: opacity 220ms ease;
          z-index: 2;
        }

        /* Hover: lift + neon glow — cyberpunk F1 feel */
        .bento-link:hover {
          transform: translateY(-6px) scale(1.005);
          border-color: rgba(255,255,255,0.20);
          box-shadow:
            0 0 0 1px var(--bento-neon, rgba(0,200,180,0.4)),
            0 16px 56px rgba(0,0,0,0.65),
            0 0 40px color-mix(in srgb, var(--bento-neon, #00c8b4) 18%, transparent),
            inset 0 1px 0 rgba(255,255,255,0.18);
        }
        .bento-link:hover::before { opacity: 1; }

        /* Arrow animation */
        .bento-arrow {
          font-size: 15px;
          color: rgba(255,255,255,0.28);
          transition: transform 180ms ease, color 180ms ease;
          display: inline-block;
          line-height: 1;
        }
        .bento-link:hover .bento-arrow {
          transform: translateX(5px);
          color: rgba(255,255,255,0.80);
        }

        /* Hover radial glow overlay */
        .bento-glow-overlay {
          position: absolute;
          inset: 0;
          border-radius: 24px;
          opacity: 0;
          pointer-events: none;
          transition: opacity 220ms ease;
          z-index: 0;
        }
        .bento-link:hover .bento-glow-overlay { opacity: 1; }

        /* Responsive */
        @media (max-width: 680px) {
          .bento-grid { grid-template-columns: 1fr; }
          .bento-wide { grid-column: span 1; }
        }
      `}</style>
    </>
  );
}

function BentoCard({ item, index, mounted }: { item: BentoItem; index: number; mounted: boolean }) {
  const isWide = item.className?.includes("wide");
  const delay  = index * 0.08;

  return (
    <div
      className={cn("bento-enter", mounted ? "visible" : "", isWide ? "bento-wide" : "")}
      style={{
        transitionDelay: `${delay}s`,
        minHeight: isWide ? 240 : 320,
      }}
    >
      <Link
        href={item.href}
        className="bento-link"
        style={{
          /* Pass neon colour as CSS var for ::before and hover glow */
          "--bento-neon": item.accentColor,
        } as React.CSSProperties}
      >
        {/* Radial glow on hover */}
        <div
          className="bento-glow-overlay"
          style={{ background: `radial-gradient(ellipse 80% 50% at 50% 0%, ${item.accentColor}20 0%, transparent 70%)` }}
        />

        {/* Accent chip + title */}
        <div style={{ padding: "22px 24px 8px", position: "relative", zIndex: 1 }}>
          {/* Minimalist chip — accent colour tag replacing emoji */}
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 6,
            background: `${item.accentColor}18`,
            border: `1px solid ${item.accentColor}35`,
            borderRadius: 99, padding: "3px 10px", marginBottom: 10,
          }}>
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: item.accentColor, display: "block", flexShrink: 0, boxShadow: `0 0 6px ${item.accentColor}` }} />
            <span style={{
              fontFamily: "var(--font-jetbrains)", fontWeight: 600,
              fontSize: 9, letterSpacing: "0.18em", textTransform: "uppercase",
              color: item.accentColor,
            }}>
              {item.id.replace(/-/g, " ")}
            </span>
          </div>

          <div style={{
            fontFamily: "var(--font-archivo-narrow)", fontWeight: 800,
            fontSize: "clamp(16px, 2.2vw, 20px)",
            textTransform: "uppercase", letterSpacing: "0.03em",
            color: "#ffffff",
            /* Prevent text overflow */
            overflow: "hidden",
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
          }}>
            {/* Strip emojis — text only, colour conveys identity */}
            {item.title.replace(/[\u{1F300}-\u{1FAFF}]/gu, "").trim()}
          </div>
        </div>

        {/* Description — minimalist, capped line-length */}
        <p style={{
          padding: "0 24px 14px",
          fontFamily: "var(--font-inter)", fontWeight: 400,
          fontSize: 14, color: "rgba(255,255,255,0.55)", lineHeight: 1.65,
          margin: 0, position: "relative", zIndex: 1,
          /* UI UX Pro: line-length 35-60 chars on mobile */
          maxWidth: "52ch",
          overflow: "hidden",
          display: "-webkit-box",
          WebkitLineClamp: 2,
          WebkitBoxOrient: "vertical",
        }}>
          {item.description}
        </p>

        {/* Body slot */}
        <div style={{ flex: 1, padding: "0 24px 18px", position: "relative", zIndex: 1, overflow: "hidden" }}>
          {item.body}
        </div>

        {/* CTA footer */}
        <div style={{
          padding: "14px 24px",
          display: "flex", alignItems: "center", justifyContent: "space-between",
          borderTop: "1px solid rgba(255,255,255,0.06)",
          marginTop: "auto", position: "relative", zIndex: 1,
        }}>
          <span style={{
            fontFamily: "var(--font-jetbrains)", fontWeight: 600, fontSize: 11,
            letterSpacing: "0.16em", textTransform: "uppercase",
            color: "rgba(255,255,255,0.38)",
          }}>
            {item.cta}
          </span>
          <span className="bento-arrow">→</span>
        </div>
      </Link>
    </div>
  );
}
