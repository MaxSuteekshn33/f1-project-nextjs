"use client";

import { useState, useEffect, useRef } from "react";
import Nav from "@/components/Nav";
import AuthModal from "@/components/AuthModal";
import { onAuthStateChanged, User } from "firebase/auth";
import {
  collection, addDoc, query, orderBy, onSnapshot,
  doc, updateDoc, arrayUnion, serverTimestamp
} from "firebase/firestore";
import { auth, db } from "@/lib/firebase";
import { sanitize } from "@/lib/utils";

type SortMode = "new" | "top" | "hot";

interface Reply {
  text: string; uid: string; name: string;
  photoURL: string | null; createdAt: string;
}
interface Comment {
  id: string; text: string; uid: string; name: string;
  photoURL: string | null; createdAt: { seconds: number } | null;
  replies: Reply[];
}

const DEBATE_PROMPTS = [
  "Who is the real GOAT — Senna, Schumacher, or Hamilton?",
  "Senna vs Verstappen in full wet São Paulo — who wins?",
  "Peak Hamilton vs peak Schumacher — settle it once and for all",
  "What if Senna raced in the 2024 ground effect era?",
];

const MAX_LEN = 500;
const COOLDOWN_MS = 30000;

function Avatar({ photoURL, name, size = 40 }: { photoURL: string | null; name: string; size?: number }) {
  const initial = (name || "?")[0].toUpperCase();
  return (
    <div style={{ width: size, height: size, borderRadius: "50%", background: "#e8303a", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 900, fontSize: size * 0.4, color: "#fff", fontFamily: "var(--font-archivo)", overflow: "hidden", flexShrink: 0 }}>
      {photoURL
        ? <img src={photoURL} alt={name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        : initial}
    </div>
  );
}

function sortComments(docs: Comment[], sort: SortMode): Comment[] {
  if (sort === "new") return [...docs].sort((a, b) => (b.createdAt?.seconds ?? 0) - (a.createdAt?.seconds ?? 0));
  if (sort === "top") return [...docs].sort((a, b) => (b.replies?.length ?? 0) - (a.replies?.length ?? 0));
  const now = Date.now() / 1000;
  return [...docs].sort((a, b) => {
    const sA = (a.replies?.length ?? 0) / Math.pow((now - (a.createdAt?.seconds ?? now)) / 3600 + 2, 1.5);
    const sB = (b.replies?.length ?? 0) / Math.pow((now - (b.createdAt?.seconds ?? now)) / 3600 + 2, 1.5);
    return sB - sA;
  });
}

export default function CommentsPage() {
  const [authOpen, setAuthOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [sort, setSort] = useState<SortMode>("new");
  const [text, setText] = useState("");
  const [replyText, setReplyText] = useState<Record<string, string>>({});
  const [openReplies, setOpenReplies] = useState<Set<string>>(new Set());
  const lastPostAt = useRef(0);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, setUser);
    return unsub;
  }, []);

  useEffect(() => {
    const q = query(collection(db, "comments"), orderBy("createdAt", "desc"));
    const unsub = onSnapshot(q, snap => {
      setComments(snap.docs.map(d => ({ id: d.id, ...d.data() } as Comment)));
    });
    return unsub;
  }, []);

  const checkRate = () => {
    const now = Date.now();
    if (now - lastPostAt.current < COOLDOWN_MS) {
      const left = Math.ceil((COOLDOWN_MS - (now - lastPostAt.current)) / 1000);
      alert(`Please wait ${left}s before posting again.`);
      return false;
    }
    return true;
  };

  const postComment = async () => {
    if (!user) { setAuthOpen(true); return; }
    if (!checkRate()) return;
    const raw = text.trim();
    if (!raw) return;
    if (raw.length > MAX_LEN) { alert(`Max ${MAX_LEN} characters.`); return; }
    lastPostAt.current = Date.now();
    await addDoc(collection(db, "comments"), {
      text: sanitize(raw), uid: user.uid,
      name: sanitize(user.displayName || user.email?.split("@")[0] || "Fan"),
      photoURL: user.photoURL || null,
      createdAt: serverTimestamp(), replies: [],
    });
    setText("");
  };

  const postReply = async (commentId: string) => {
    if (!user) { setAuthOpen(true); return; }
    if (!checkRate()) return;
    const raw = (replyText[commentId] || "").trim();
    if (!raw) return;
    if (raw.length > MAX_LEN) { alert(`Max ${MAX_LEN} characters.`); return; }
    lastPostAt.current = Date.now();
    const replyObj: Reply = {
      text: sanitize(raw), uid: user.uid,
      name: sanitize(user.displayName || user.email?.split("@")[0] || "Fan"),
      photoURL: user.photoURL || null,
      createdAt: new Date().toISOString(),
    };
    await updateDoc(doc(db, "comments", commentId), { replies: arrayUnion(replyObj) });
    setReplyText(p => ({ ...p, [commentId]: "" }));
    setOpenReplies(p => { const n = new Set(p); n.delete(commentId); return n; });
  };

  const sorted = sortComments(comments, sort);

  return (
    <>
      <div className="dotted-surface" />
      <Nav onLoginClick={() => setAuthOpen(true)} />
      <AuthModal open={authOpen} onClose={() => setAuthOpen(false)} />

      <div style={{ paddingTop: 64, position: "relative", zIndex: 1 }}>
        <div style={{ maxWidth: 720, margin: "0 auto", padding: "40px 20px 80px" }}>

          <h1 style={{ fontFamily: "var(--font-archivo)", fontSize: "clamp(24px,5vw,36px)", fontWeight: 900, color: "#fff", marginBottom: 6 }}>Discussion Board</h1>
          <p style={{ color: "rgba(255,255,255,0.45)", fontSize: 14, marginBottom: 32 }}>Settle the GOAT debate. Hot takes welcome.</p>

          {/* Compose */}
          {user ? (
            <div style={GLASS_BOX}>
              <div style={{ display: "flex", gap: 12 }}>
                <Avatar photoURL={user.photoURL} name={user.displayName || user.email || "?"} />
                <div style={{ flex: 1 }}>
                  <textarea
                    value={text}
                    onChange={e => setText(e.target.value)}
                    placeholder="Share your F1 take..."
                    maxLength={MAX_LEN}
                    rows={3}
                    style={TEXTAREA_STYLE}
                  />
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 10 }}>
                    <span style={{ fontFamily: "var(--font-jetbrains)", fontSize: 11, color: "rgba(255,255,255,0.35)" }}>{text.length}/{MAX_LEN}</span>
                    <button onClick={postComment} style={POST_BTN}>Post Comment</button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div style={{ ...GLASS_BOX, textAlign: "center" }}>
              <p style={{ color: "rgba(255,255,255,0.6)", marginBottom: 16 }}>Sign in to join the debate</p>
              <div style={{ display: "flex", gap: 10, justifyContent: "center", flexWrap: "wrap" }}>
                <button onClick={() => setAuthOpen(true)} style={POST_BTN}>Sign In</button>
              </div>
              <div style={{ display: "grid", gap: 8, marginTop: 20 }}>
                {DEBATE_PROMPTS.map(p => (
                  <div key={p} onClick={() => { setAuthOpen(true); }} style={{
                    background: "rgba(232,48,58,0.06)", border: "1px solid rgba(232,48,58,0.15)",
                    borderRadius: 12, padding: "10px 14px", cursor: "pointer",
                    fontFamily: "var(--font-inter)", fontSize: 14, color: "rgba(255,255,255,0.7)",
                  }}>
                    🔥 {p}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Sort */}
          <div style={{ display: "flex", gap: 8, margin: "20px 0" }}>
            {(["new", "top", "hot"] as SortMode[]).map(s => (
              <button key={s} onClick={() => setSort(s)} style={{
                padding: "8px 18px", borderRadius: 10, border: "1.5px solid",
                borderColor: sort === s ? "#5a1aff" : "rgba(255,255,255,0.12)",
                background: sort === s ? "rgba(90,26,255,0.2)" : "rgba(255,255,255,0.05)",
                color: sort === s ? "#a78bfa" : "rgba(255,255,255,0.5)",
                fontFamily: "var(--font-jetbrains)", fontWeight: 600, fontSize: 11,
                letterSpacing: "0.1em", textTransform: "uppercase", cursor: "pointer",
              }}>
                {s === "new" ? "🕐 New" : s === "top" ? "🔥 Top" : "⚡ Hot"}
              </button>
            ))}
          </div>

          {/* Comments */}
          {sorted.length === 0 ? (
            <div style={{ textAlign: "center", padding: "60px 0", color: "rgba(255,255,255,0.35)" }}>
              <div style={{ fontSize: 48, marginBottom: 12 }}>🏎</div>
              <div style={{ fontFamily: "var(--font-archivo-narrow)", fontWeight: 800, fontSize: 18, textTransform: "uppercase", marginBottom: 8 }}>Be the first to settle the GOAT debate</div>
              <div style={{ fontFamily: "var(--font-inter)", fontSize: 14 }}>No comments yet. Start the argument.</div>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
              {sorted.map(c => (
                <div key={c.id} style={COMMENT_CARD}>
                  <div style={{ display: "flex", alignItems: "flex-start", gap: 12, marginBottom: 10 }}>
                    <Avatar photoURL={c.photoURL} name={c.name} size={36} />
                    <div>
                      <div style={{ fontFamily: "var(--font-archivo-narrow)", fontWeight: 800, fontSize: 13, textTransform: "uppercase", letterSpacing: "0.05em", color: "#fff" }}>{c.name}</div>
                      <div style={{ fontFamily: "var(--font-jetbrains)", fontSize: 10, color: "rgba(255,255,255,0.3)", marginTop: 2 }}>
                        {c.createdAt ? new Date(c.createdAt.seconds * 1000).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) : "just now"}
                      </div>
                    </div>
                  </div>
                  <p style={{ fontFamily: "var(--font-inter)", fontSize: 15, color: "rgba(255,255,255,0.85)", lineHeight: 1.6, margin: "0 0 12px" }}>{c.text}</p>

                  {/* Replies */}
                  {c.replies?.length > 0 && (
                    <div style={{ display: "flex", flexDirection: "column", gap: 8, margin: "8px 0 10px", paddingLeft: 16, borderLeft: "2px solid rgba(255,255,255,0.08)" }}>
                      {c.replies.map((r, i) => (
                        <div key={i} style={{ display: "flex", gap: 10 }}>
                          <Avatar photoURL={r.photoURL} name={r.name} size={28} />
                          <div>
                            <div style={{ fontFamily: "var(--font-archivo-narrow)", fontWeight: 800, fontSize: 11, textTransform: "uppercase", letterSpacing: "0.05em", color: "rgba(255,255,255,0.7)" }}>{r.name}</div>
                            <div style={{ fontFamily: "var(--font-inter)", fontSize: 14, color: "rgba(255,255,255,0.6)", lineHeight: 1.5 }}>{r.text}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  <button onClick={() => setOpenReplies(p => { const n = new Set(p); n.has(c.id) ? n.delete(c.id) : n.add(c.id); return n; })} style={{ background: "none", border: "none", color: "rgba(255,255,255,0.35)", fontFamily: "var(--font-jetbrains)", fontSize: 11, letterSpacing: "0.1em", textTransform: "uppercase", cursor: "pointer", padding: 0 }}>
                    ↩ Reply {c.replies?.length > 0 && `(${c.replies.length})`}
                  </button>

                  {openReplies.has(c.id) && (
                    <div style={{ display: "flex", gap: 10, marginTop: 12 }}>
                      {user && <Avatar photoURL={user.photoURL} name={user.displayName || "?"} size={30} />}
                      <div style={{ flex: 1 }}>
                        <textarea
                          value={replyText[c.id] || ""}
                          onChange={e => setReplyText(p => ({ ...p, [c.id]: e.target.value }))}
                          placeholder="Write a reply…"
                          rows={2}
                          maxLength={MAX_LEN}
                          style={{ ...TEXTAREA_STYLE, minHeight: 56, fontSize: 13 }}
                        />
                        <button onClick={() => postReply(c.id)} style={{ ...POST_BTN, marginTop: 6, fontSize: 11, padding: "7px 16px" }}>Post Reply</button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}

const GLASS_BOX: React.CSSProperties = {
  background: "rgba(255,255,255,0.06)", backdropFilter: "blur(40px)",
  border: "1px solid rgba(255,255,255,0.1)", borderRadius: 20, padding: 20, marginBottom: 24,
};
const COMMENT_CARD: React.CSSProperties = {
  background: "rgba(255,255,255,0.05)", backdropFilter: "blur(20px)",
  border: "1px solid rgba(255,255,255,0.08)", borderRadius: 20, padding: "18px 20px",
};
const TEXTAREA_STYLE: React.CSSProperties = {
  width: "100%", background: "rgba(255,255,255,0.06)",
  border: "1px solid rgba(255,255,255,0.12)", borderRadius: 14,
  padding: "12px 14px", color: "#fff", fontSize: 14,
  fontFamily: "var(--font-inter)", resize: "vertical", outline: "none", minHeight: 80,
};
const POST_BTN: React.CSSProperties = {
  background: "#e8303a", color: "#fff", border: "none",
  borderRadius: 8, padding: "9px 22px", fontWeight: 800, fontSize: 12,
  cursor: "pointer", fontFamily: "var(--font-archivo)",
};
