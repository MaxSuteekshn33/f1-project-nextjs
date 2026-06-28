"use client";

/**
 * CTA with Rectangle — inspired by mikolajdobrucki/cta-with-rectangle on 21st.dev
 * SVG rectangle border drawn via CSS stroke-dashoffset animation.
 * Corner accent dots + ambient glow. Content always visible.
 */

import Link from "next/link";

interface CTAAction {
  text: string;
  href: string;
  variant?: "primary" | "secondary";
}

interface CTAWithRectangleProps {
  badge?: string;
  title: string;
  description?: string;
  actions: CTAAction[];
  className?: string;
}

export function CTAWithRectangle({
  badge,
  title,
  description,
  actions,
  className = "",
}: CTAWithRectangleProps) {
  // Perimeter of the rect at viewBox 0-100: 2*(98+98) = 392
  return (
    <div
      className={cn("cta-rectangle", className)}
      style={{
        position: "relative",
        padding: "56px 40px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        textAlign: "center",
        overflow: "hidden",
      }}
    >
      {/* Animated SVG rectangle border — CSS stroke-dashoffset draw-in */}
      <svg
        style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none" }}
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
      >
        <rect
          className="cta-rect-border"
          x="1" y="1" width="98" height="98" rx="3.5"
          fill="none"
          stroke="rgba(90,26,255,0.6)"
          strokeWidth="0.5"
          vectorEffect="non-scaling-stroke"
        />
        <rect
          className="cta-rect-glow"
          x="1" y="1" width="98" height="98" rx="3.5"
          fill="none"
          stroke="rgba(167,139,250,0.2)"
          strokeWidth="1"
          vectorEffect="non-scaling-stroke"
        />
      </svg>

      {/* Corner accent dots */}
      {[
        { top: -2, left: -2 },
        { top: -2, right: -2 },
        { bottom: -2, left: -2 },
        { bottom: -2, right: -2 },
      ].map((pos, i) => (
        <div
          key={i}
          className="cta-corner-dot"
          style={{
            position: "absolute",
            width: 7,
            height: 7,
            borderRadius: "50%",
            background: "#5a1aff",
            boxShadow: "0 0 10px rgba(90,26,255,0.9)",
            animationDelay: `${i * 0.1}s`,
            ...pos,
          }}
        />
      ))}

      {/* Background ambient glow */}
      <div style={{
        position: "absolute", inset: 0, pointerEvents: "none",
        background: "radial-gradient(ellipse 60% 50% at 50% 100%, rgba(90,26,255,0.12) 0%, transparent 100%)",
      }} />

      {/* Content */}
      <div style={{ position: "relative", zIndex: 1, maxWidth: 600 }}>
        {badge && (
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 6,
            background: "rgba(90,26,255,0.15)", border: "1px solid rgba(90,26,255,0.35)",
            borderRadius: 99, padding: "4px 14px", marginBottom: 20,
            fontFamily: "var(--font-jetbrains)", fontWeight: 600, fontSize: 10,
            letterSpacing: "0.2em", textTransform: "uppercase", color: "#a78bfa",
          }}>
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#a78bfa", display: "inline-block" }} />
            {badge}
          </div>
        )}

        <h2 style={{
          fontFamily: "var(--font-archivo-narrow)", fontWeight: 700,
          fontSize: "clamp(24px, 4vw, 40px)", textTransform: "uppercase",
          letterSpacing: "-0.01em", color: "#fff",
          marginBottom: description ? 12 : 28, lineHeight: 1.1,
        }}>
          {title}
        </h2>

        {description && (
          <p style={{
            fontFamily: "var(--font-inter)", fontSize: 15,
            color: "rgba(255,255,255,0.55)", lineHeight: 1.7, marginBottom: 28,
          }}>
            {description}
          </p>
        )}

        <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
          {actions.map((action) => (
            <Link
              key={action.href}
              href={action.href}
              className={action.variant === "secondary" ? "cta-btn-secondary" : "cta-btn-primary"}
            >
              {action.text}
            </Link>
          ))}
        </div>
      </div>

      <style>{`
        /* Rectangle border draw-in */
        .cta-rect-border {
          stroke-dasharray: 392;
          stroke-dashoffset: 392;
          animation: drawRect 1.6s ease-in-out 0.2s forwards;
        }
        .cta-rect-glow {
          opacity: 0;
          animation: glowPulse 3s ease-in-out 1.8s infinite alternate;
        }
        @keyframes drawRect {
          to { stroke-dashoffset: 0; }
        }
        @keyframes glowPulse {
          from { opacity: 0.1; }
          to { opacity: 0.5; }
        }

        /* Corner dots pop in */
        .cta-corner-dot {
          opacity: 0;
          transform: scale(0);
          animation: dotPop 0.4s cubic-bezier(0.34,1.56,0.64,1) 1.5s forwards;
        }
        @keyframes dotPop {
          to { opacity: 1; transform: scale(1); }
        }

        /* Buttons */
        .cta-btn-primary {
          background: #e8303a;
          color: #fff;
          text-decoration: none;
          border-radius: 12px;
          padding: 13px 28px;
          font-family: var(--font-archivo-narrow);
          font-weight: 700;
          font-size: 14px;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          box-shadow: 0 4px 20px rgba(232,48,58,0.35);
          transition: transform 0.15s ease, box-shadow 0.15s ease;
          display: inline-block;
        }
        .cta-btn-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 32px rgba(232,48,58,0.45);
        }
        .cta-btn-secondary {
          background: rgba(255,255,255,0.07);
          color: rgba(255,255,255,0.85);
          text-decoration: none;
          border-radius: 12px;
          padding: 13px 28px;
          font-family: var(--font-archivo-narrow);
          font-weight: 700;
          font-size: 14px;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          border: 1px solid rgba(255,255,255,0.15);
          transition: background 0.15s ease;
          display: inline-block;
        }
        .cta-btn-secondary:hover {
          background: rgba(255,255,255,0.12);
        }
      `}</style>
    </div>
  );
}

function cn(...classes: (string | undefined | false)[]) {
  return classes.filter(Boolean).join(" ");
}
