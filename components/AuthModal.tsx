"use client";

import { useState } from "react";
import {
  signInWithPopup, GoogleAuthProvider, createUserWithEmailAndPassword,
  signInWithEmailAndPassword, updateProfile, sendEmailVerification,
  setPersistence, browserSessionPersistence,
} from "firebase/auth";
import { auth } from "@/lib/firebase";

function friendlyAuthError(code: string): string {
  const map: Record<string, string> = {
    "auth/invalid-email":          "Please enter a valid email address.",
    "auth/user-not-found":         "Incorrect email or password.",
    "auth/wrong-password":         "Incorrect email or password.",
    "auth/invalid-credential":     "Incorrect email or password.",
    "auth/email-already-in-use":   "An account already exists. Try signing in instead.",
    "auth/weak-password":          "Password must be at least 6 characters.",
    "auth/too-many-requests":      "Too many attempts. Please wait a few minutes and try again.",
    "auth/network-request-failed": "Network error. Check your connection and try again.",
    "auth/popup-closed-by-user":   "Sign in was cancelled.",
  };
  return map[code] || "Something went wrong. Please try again.";
}

interface Props {
  open: boolean;
  onClose: () => void;
}

export default function AuthModal({ open, onClose }: Props) {
  const [tab, setTab] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  if (!open) return null;

  const clearErr = () => setError("");

  const ensureSessionPersistence = () =>
    setPersistence(auth, browserSessionPersistence).catch(() => {});

  const signInGoogle = async () => {
    setLoading(true); clearErr();
    try {
      await ensureSessionPersistence();
      await signInWithPopup(auth, new GoogleAuthProvider());
      onClose();
    } catch (e: unknown) {
      const err = e as { code?: string; message?: string };
      setError(friendlyAuthError(err.code || ""));
    } finally { setLoading(false); }
  };

  const signInEmail = async () => {
    setLoading(true); clearErr();
    try {
      await ensureSessionPersistence();
      await signInWithEmailAndPassword(auth, email, password);
      onClose();
    } catch (e: unknown) {
      const err = e as { code?: string };
      setError(friendlyAuthError(err.code || ""));
    } finally { setLoading(false); }
  };

  const signUpEmail = async () => {
    setLoading(true); clearErr();
    if (!name.trim()) { setError("Please enter a display name."); setLoading(false); return; }
    if (password.length < 6) { setError("Password must be at least 6 characters."); setLoading(false); return; }
    try {
      await ensureSessionPersistence();
      const cred = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(cred.user, { displayName: name.trim() });
      await sendEmailVerification(cred.user);
      onClose();
      alert("Account created! Please check your email to verify your address before commenting.");
    } catch (e: unknown) {
      const err = e as { code?: string };
      setError(friendlyAuthError(err.code || ""));
    } finally { setLoading(false); }
  };

  return (
    <div
      style={{
        position: "fixed", inset: 0, zIndex: 99999,
        background: "rgba(0,0,0,0.75)", backdropFilter: "blur(8px)",
        display: "flex", alignItems: "center", justifyContent: "center",
        padding: 20,
      }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div style={{
        background: "#0e0c1f", border: "1px solid rgba(177,151,252,0.2)",
        borderRadius: 24, padding: 32, width: "100%", maxWidth: 420,
        boxShadow: "0 24px 80px rgba(0,0,0,0.8)",
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
          <h2 style={{ fontFamily: "var(--font-archivo-narrow)", fontWeight: 800, fontSize: 22, textTransform: "uppercase", letterSpacing: "0.02em" }}>
            {tab === "signin" ? "Welcome Back" : "Create Account"}
          </h2>
          <button onClick={onClose} style={{ background: "none", border: "none", color: "rgba(255,255,255,0.4)", fontSize: 22, cursor: "pointer" }}>✕</button>
        </div>

        {/* Tab toggle */}
        <div style={{ display: "flex", background: "rgba(255,255,255,0.05)", borderRadius: 10, padding: 4, marginBottom: 24 }}>
          {(["signin", "signup"] as const).map(t => (
            <button key={t} onClick={() => { setTab(t); clearErr(); }} style={{
              flex: 1, padding: "8px 0",
              background: tab === t ? "#5a1aff" : "transparent",
              border: "none", borderRadius: 8,
              color: tab === t ? "#fff" : "rgba(255,255,255,0.45)",
              fontFamily: "var(--font-archivo-narrow)", fontWeight: 700, fontSize: 13,
              textTransform: "uppercase", letterSpacing: "0.06em", cursor: "pointer",
              transition: "all 0.2s",
            }}>
              {t === "signin" ? "Sign In" : "Sign Up"}
            </button>
          ))}
        </div>

        {/* Google */}
        <button onClick={signInGoogle} disabled={loading} style={{
          width: "100%", padding: "12px 20px",
          background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.15)",
          borderRadius: 12, color: "#fff",
          fontFamily: "var(--font-inter)", fontWeight: 600, fontSize: 14,
          cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
          gap: 10, marginBottom: 20, transition: "background 0.2s",
        }}>
          <svg width="18" height="18" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
          Continue with Google
        </button>

        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
          <div style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.1)" }} />
          <span style={{ fontFamily: "var(--font-jetbrains)", fontSize: 10, color: "rgba(255,255,255,0.3)", letterSpacing: "0.12em" }}>OR</span>
          <div style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.1)" }} />
        </div>

        {/* Email form */}
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {tab === "signup" && (
            <input
              type="text" placeholder="Display name" value={name}
              onChange={e => setName(e.target.value)}
              style={inputStyle}
            />
          )}
          <input
            type="email" placeholder="Email address" value={email}
            onChange={e => setEmail(e.target.value)}
            style={inputStyle}
          />
          <input
            type="password" placeholder="Password (min 6 chars)" value={password}
            onChange={e => setPassword(e.target.value)}
            onKeyDown={e => e.key === "Enter" && (tab === "signin" ? signInEmail() : signUpEmail())}
            style={inputStyle}
          />
          {error && (
            <div style={{
              background: "rgba(232,48,58,0.12)", border: "1px solid rgba(232,48,58,0.3)",
              borderRadius: 10, padding: "10px 14px",
              fontFamily: "var(--font-inter)", fontSize: 13, color: "#f87171",
            }}>
              {error}
            </div>
          )}
          <button
            onClick={tab === "signin" ? signInEmail : signUpEmail}
            disabled={loading}
            style={{
              background: "#e8303a", color: "#fff", border: "none",
              borderRadius: 12, padding: "12px 24px",
              fontFamily: "var(--font-archivo-narrow)", fontWeight: 800, fontSize: 14,
              textTransform: "uppercase", letterSpacing: "0.05em",
              cursor: loading ? "not-allowed" : "pointer",
              opacity: loading ? 0.7 : 1, marginTop: 4,
            }}
          >
            {loading ? "..." : tab === "signin" ? "Sign In" : "Create Account"}
          </button>
        </div>
      </div>
    </div>
  );
}

const inputStyle: React.CSSProperties = {
  background: "rgba(255,255,255,0.06)",
  border: "1px solid rgba(255,255,255,0.12)",
  borderRadius: 12, padding: "12px 16px",
  color: "#fff", fontSize: 14,
  fontFamily: "var(--font-inter)",
  outline: "none", width: "100%",
};
