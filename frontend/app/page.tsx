"use client";
import { useState, useEffect } from "react";
import styles from "./page.module.css";

const EMOJIS = [
  "😊", "😢", "😡", "😱", "😍", "😎", "😴", "😕", "🤢", "🥳", "😇", "😭", "😤", "😳", "😬", "😌", "🤔", "😅", "😆", "😐"
];

const EMOJI_BG_COUNT = 14;

function generateEmojiBgData() {
  return Array.from({ length: EMOJI_BG_COUNT }).map((_, i) => {
    const left = Math.random() * 90 + "%";
    const top = Math.random() * 85 + "%";
    const size = Math.random() * 32 + 48; // 48px to 80px
    const rotate = Math.random() * 360;
    const opacity = 0.45 + Math.random() * 0.3;
    return {
      emoji: EMOJIS[i % EMOJIS.length],
      style: {
        left,
        top,
        fontSize: size,
        transform: `rotate(${rotate}deg)`,
        opacity,
      } as React.CSSProperties,
      key: i,
    };
  });
}

export default function Home() {
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ emotion: string; confidence: number } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [emojiBgData, setEmojiBgData] = useState<any[]>([]);

  useEffect(() => {
    setEmojiBgData(generateEmojiBgData());
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);
    setError(null);
    try {
      const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "https://backend-xxxx.onrender.com";
      const res = await fetch(`${API_BASE_URL}/analyze`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });
      if (!res.ok) throw new Error("API error");
      const data = await res.json();
      setResult(data);
    } catch (err) {
      setError("Could not analyze emotion. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.page}>
      {/* */}
      <div className={styles.emojiBackground} aria-hidden="true" />
      <main className={styles.main}>
        <div className={styles.mainCard}>
          <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 8 }}>Emotion Reflection Tool</h1>
          <form onSubmit={handleSubmit} style={{ width: "100%", maxWidth: 400, display: "flex", flexDirection: "column", gap: 16 }}>
            <label htmlFor="reflection" style={{ fontWeight: 500 }}>How are you feeling today?</label>
            <textarea
              id="reflection"
              value={text}
              onChange={e => setText(e.target.value)}
              rows={4}
              required
              style={{
                padding: 12,
                borderRadius: 8,
                border: "1px solid #ccc",
                fontSize: 16,
                resize: "vertical",
                marginBottom: 8,
              }}
              placeholder="e.g. I feel nervous about my first job interview"
              disabled={loading}
            />
            <button
              type="submit"
              disabled={loading || !text.trim()}
              style={{
                background: "var(--foreground, #000)",
                color: "var(--background, #fff)",
                border: "none",
                borderRadius: 24,
                padding: "12px 0",
                fontWeight: 600,
                fontSize: 16,
                cursor: loading ? "not-allowed" : "pointer",
                transition: "background 0.2s",
              }}
            >
              {loading ? "Analyzing..." : "Submit"}
            </button>
          </form>
          {error && (
            <div style={{ color: "#b00", marginTop: 16, fontWeight: 500 }}>{error}</div>
          )}
        </div>
        {/* */}
        {(result || loading) && (
          <div style={{
            marginTop: 32,
            background: '#fff',
            borderRadius: 16,
            boxShadow: '0 2px 12px 0 rgba(0,0,0,0.07)',
            padding: 28,
            maxWidth: 400,
            width: '100%',
            textAlign: 'center',
            minHeight: 80,
            display: 'block',
            color: '#222',
          }}>
            {loading ? (
              <div style={{ fontSize: 18, fontWeight: 600, color: '#888' }}>
                Analyzing
                <span className="loading-dots" style={{ display: 'inline-block', marginLeft: 4 }}>
                  <span style={{ animation: 'blink 1s infinite' }}>.</span>
                  <span style={{ animation: 'blink 1s infinite 0.2s' }}>.</span>
                  <span style={{ animation: 'blink 1s infinite 0.4s' }}>.</span>
                </span>
                <style>{`
                  @keyframes blink {
                    0%, 80%, 100% { opacity: 0; }
                    40% { opacity: 1; }
                  }
                `}</style>
              </div>
            ) : result ? (
              <>
                <div style={{ fontSize: 18, fontWeight: 600, marginBottom: 8, color: '#222' }}>Detected Emotion</div>
                <div style={{ fontSize: 28, fontWeight: 700, marginBottom: 4, color: '#222' }}>{result.emotion}</div>
                <div style={{ fontSize: 15, color: '#444', marginTop: 4 }}>Confidence: {(result.confidence * 100).toFixed(0)}%</div>
              </>
            ) : null}
          </div>
        )}
      </main>
    </div>
  );
}
