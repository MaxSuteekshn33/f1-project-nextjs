"use client";

import { useEffect, useRef, useState } from "react";

export default function IntroVideo() {
  const [visible, setVisible] = useState(false);
  const [muted, setMuted] = useState(true);
  const [hiding, setHiding] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    // Only show once per session
    const seen = sessionStorage.getItem("f1_intro_seen");
    if (!seen) setVisible(true);
  }, []);

  function dismiss() {
    setHiding(true);
    if (videoRef.current) videoRef.current.muted = true;
    setTimeout(() => {
      setVisible(false);
      sessionStorage.setItem("f1_intro_seen", "1");
    }, 900);
  }

  function toggleSound() {
    if (!videoRef.current) return;
    const newMuted = !muted;
    videoRef.current.muted = newMuted;
    setMuted(newMuted);
  }

  if (!visible) return null;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 99999,
        background: "#04030a",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        opacity: hiding ? 0 : 1,
        transition: "opacity 0.9s ease",
        pointerEvents: hiding ? "none" : "auto",
      }}
    >
      <video
        ref={videoRef}
        src="/tier-intro.mp4"
        autoPlay
        muted
        playsInline
        onEnded={dismiss}
        onError={dismiss}
        style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
      />

      {/* Sound toggle — bottom left */}
      <button
        onClick={toggleSound}
        style={{
          position: "absolute",
          bottom: 28,
          left: 28,
          background: "rgba(255,255,255,0.07)",
          border: "1px solid rgba(255,255,255,0.15)",
          color: muted ? "rgba(255,255,255,0.5)" : "#fff",
          padding: "8px 16px",
          borderRadius: 10,
          fontFamily: "var(--font-jetbrains), monospace",
          fontSize: 10,
          letterSpacing: "0.12em",
          textTransform: "uppercase",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          gap: 8,
          transition: "all 0.18s ease",
        }}
      >
        {muted ? "🔇" : "🔊"}
        <span>{muted ? "Tap for sound" : "Sound on"}</span>
      </button>

      {/* Skip — bottom right */}
      <button
        onClick={dismiss}
        style={{
          position: "absolute",
          bottom: 28,
          right: 28,
          background: "rgba(255,255,255,0.07)",
          border: "1px solid rgba(255,255,255,0.15)",
          color: "rgba(255,255,255,0.5)",
          padding: "8px 20px",
          borderRadius: 10,
          fontFamily: "var(--font-jetbrains), monospace",
          fontSize: 10,
          letterSpacing: "0.14em",
          textTransform: "uppercase",
          cursor: "pointer",
          transition: "all 0.18s ease",
        }}
      >
        Skip ↓
      </button>
    </div>
  );
}
