"use client";

/**
 * Adapted from kokonutd/bento-grid (kokonutui.com)
 * Asymmetric grid layout with CSS entrance animations + Framer Motion hover effects.
 */

import { motion } from "motion/react";
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
  className?: string;
  body: React.ReactNode;
}

interface Props {
  items: BentoItem[];
}

export function BentoGrid({ items }: Props) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    // Slight delay so CSS transition is visible
    const t = setTimeout(() => setMounted(true), 50);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="bento-grid">
      {items.map((item, i) => (
        <BentoCard key={item.id} item={item} index={i} mounted={mounted} />
      ))}
      <style>{`
        .bento-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
        }
        .bento-card-wide { grid-column: span 2; }
        .bento-card-enter {
          opacity: 0;
          transform: translateY(24px);
          transition: opacity 0.5s ease, transform 0.5s ease;
        }
        .bento-card-enter.visible {
          opacity: 1;
          transform: translateY(0);
        }
        .bento-card-inner {
          display: flex;
          flex-direction: column;
          border-radius: 28px;
          overflow: hidden;
          text-decoration: none;
          position: relative;
          transition: transform 0.22s ease, box-shadow 0.22s ease;
        }
        .bento-card-inner:hover {
          transform: translateY(-8px) !important;
          box-shadow: 0 20px 60px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.14) !important;
        }
        .bento-glow {
          position: absolute;
          inset: 0;
          border-radius: 28px;
          opacity: 0;
          pointer-events: none;
          transition: opacity 0.25s ease;
        }
        .bento-card-inner:hover .bento-glow { opacity: 1; }
        .bento-arrow {
          font-size: 16px;
          color: rgba(255,255,255,0.35);
          transition: transform 0.18s ease, color 0.18s ease;
          display: inline-block;
        }
        .bento-card-inner:hover .bento-arrow {
          transform: translateX(6px);
          color: rgba(255,255,255,0.85);
        }
        @media (max-width: 680px) {
          .bento-grid { grid-template-columns: 1fr; }
          .bento-card-wide { grid-column: span 1; }
        }
      `}</style>
    </div>
  );
}

function BentoCard({ item, index, mounted }: { item: BentoItem; index: number; mounted: boolean }) {
  const isWide = item.className?.includes("wide");
  const delay = index * 0.1;

  return (
    <div
      className={cn("bento-card-enter", mounted ? "visible" : "", isWide ? "bento-card-wide" : "")}
      style={{ transitionDelay: `${delay}s`, minHeight: isWide ? 260 : 340 }}
    >
      <Link
        href={item.href}
        className="bento-card-inner"
        style={{
          minHeight: "100%",
          background: item.bg,
          backdropFilter: "blur(40px) saturate(160%)",
          WebkitBackdropFilter: "blur(40px) saturate(160%)",
          border: `1px solid ${item.borderColor}`,
          boxShadow: "0 8px 40px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.08)",
        }}
      >
        {/* Header */}
        <div style={{ padding: "26px 26px 10px", display: "flex", alignItems: "center", gap: 12 }}>
          <span style={{
            fontFamily: "var(--font-archivo-narrow)", fontWeight: 700,
            fontSize: 20, textTransform: "uppercase", letterSpacing: "0.05em",
            color: item.accentColor,
          }}>
            {item.title}
          </span>
        </div>

        {/* Description */}
        <p style={{
          padding: "0 26px 16px",
          fontFamily: "var(--font-inter)", fontWeight: 500,
          fontSize: 15, color: "rgba(255,255,255,0.6)", lineHeight: 1.6,
          margin: 0,
        }}>
          {item.description}
        </p>

        {/* Body slot */}
        <div style={{ flex: 1, padding: "0 26px 20px" }}>
          {item.body}
        </div>

        {/* CTA footer */}
        <div style={{
          padding: "16px 26px",
          display: "flex", alignItems: "center", justifyContent: "space-between",
          borderTop: "1px solid rgba(255,255,255,0.07)", marginTop: "auto",
        }}>
          <span style={{
            fontFamily: "var(--font-jetbrains)", fontWeight: 600, fontSize: 12,
            letterSpacing: "0.18em", textTransform: "uppercase",
            color: "rgba(255,255,255,0.45)",
          }}>
            {item.cta}
          </span>
          <span className="bento-arrow">→</span>
        </div>

        {/* Hover glow overlay (CSS) */}
        <div
          className="bento-glow"
          style={{ background: `radial-gradient(ellipse at 50% 0%, ${item.accentColor}22 0%, transparent 60%)` }}
        />
      </Link>
    </div>
  );
}
