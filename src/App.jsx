import React, { useState, useEffect, useRef, useCallback } from "react";
import { Play, Pause, RotateCcw, ChevronDown, Music, X, Check } from "lucide-react";

const MODES = [
  { id: "25", label: "25 min", minutes: 25 },
  { id: "45", label: "45 min", minutes: 45 },
  { id: "60", label: "60 min", minutes: 60 },
  { id: "stopwatch", label: "Stopwatch", minutes: null },
];

const TOPICS = ["Reading", "Writing", "Coding", "Studying", "Design"];

export default function FocusTimer() {
  const [mode, setMode] = useState(MODES[0]);
  const [secondsLeft, setSecondsLeft] = useState(25 * 60);
  const [elapsed, setElapsed] = useState(0);
  const [running, setRunning] = useState(false);
  const [modeOpen, setModeOpen] = useState(false);
  const [topicOpen, setTopicOpen] = useState(false);
  const [topic, setTopic] = useState(null);
  const intervalRef = useRef(null);

  const isStopwatch = mode.minutes === null;

  useEffect(() => {
    if (!running) return;
    intervalRef.current = setInterval(() => {
      if (isStopwatch) {
        setElapsed((s) => s + 1);
      } else {
        setSecondsLeft((s) => {
          if (s <= 1) {
            clearInterval(intervalRef.current);
            setRunning(false);
            return 0;
          }
          return s - 1;
        });
      }
    }, 1000);
    return () => clearInterval(intervalRef.current);
  }, [running, isStopwatch]);

  const reset = useCallback(() => {
    clearInterval(intervalRef.current);
    setRunning(false);
    setElapsed(0);
    setSecondsLeft(mode.minutes ? mode.minutes * 60 : 0);
  }, [mode]);

  const selectMode = (m) => {
    setMode(m);
    setModeOpen(false);
    clearInterval(intervalRef.current);
    setRunning(false);
    setElapsed(0);
    setSecondsLeft(m.minutes ? m.minutes * 60 : 0);
  };

  const displaySeconds = isStopwatch ? elapsed : secondsLeft;
  const mm = String(Math.floor(displaySeconds / 60)).padStart(2, "0");
  const ss = String(displaySeconds % 60).padStart(2, "0");

  const accent = "#D9682E";
  const ink = "#20222B";
  const muted = "#8B8D98";
  const line = "#EBEAE6";

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#F4F2EE",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 16,
        fontFamily:
          "'Poppins', 'Segoe UI', system-ui, -apple-system, sans-serif",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: 320,
          background: "#FFFFFF",
          borderRadius: 22,
          padding: "22px 22px 20px",
          boxShadow: "0 16px 40px rgba(32,34,43,0.08)",
          position: "relative",
        }}
      >
        {/* Header */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
          }}
        >
          <div>
            <h1
              style={{
                margin: 0,
                fontSize: 22,
                fontWeight: 700,
                color: accent,
                letterSpacing: -0.4,
              }}
            >
              Focus Timer
            </h1>
            <p style={{ margin: "4px 0 0", fontSize: 12, color: muted, fontWeight: 500 }}>
              Stay focused. Get more done.
            </p>
          </div>
          <button
            style={{
              border: `1px solid ${line}`,
              background: "#fff",
              width: 32,
              height: 32,
              borderRadius: 10,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: ink,
              cursor: "pointer",
            }}
            aria-label="Sound"
          >
            <Music size={15} />
          </button>
        </div>

        {/* Timer display */}
        <div
          style={{
            textAlign: "center",
            margin: "22px 0 16px",
            fontSize: 46,
            fontWeight: 700,
            color: ink,
            letterSpacing: 1,
            fontVariantNumeric: "tabular-nums",
          }}
        >
          {mm}
          <span style={{ color: "#D8D6D0" }}>:</span>
          {ss}
        </div>

        {/* Mode dropdown */}
        <div style={{ position: "relative", marginBottom: 10 }}>
          <button
            onClick={() => setModeOpen((o) => !o)}
            style={{
              width: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 6,
              padding: "9px 12px",
              borderRadius: 13,
              border: `1px solid ${line}`,
              background: "#fff",
              fontSize: 13,
              fontWeight: 600,
              color: ink,
              cursor: "pointer",
            }}
          >
            {mode.label}
            <ChevronDown size={14} color={muted} style={{ transform: modeOpen ? "rotate(180deg)" : "none", transition: "transform .15s" }} />
          </button>
          {modeOpen && (
            <div
              style={{
                position: "absolute",
                top: "calc(100% + 6px)",
                left: 0,
                right: 0,
                background: "#fff",
                border: `1px solid ${line}`,
                borderRadius: 16,
                overflow: "hidden",
                boxShadow: "0 12px 30px rgba(32,34,43,0.12)",
                zIndex: 10,
              }}
            >
              {MODES.map((m) => (
                <button
                  key={m.id}
                  onClick={() => selectMode(m)}
                  style={{
                    width: "100%",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "9px 12px",
                    background: m.id === mode.id ? "#FBEFE8" : "transparent",
                    border: "none",
                    fontSize: 13,
                    fontWeight: 600,
                    color: m.id === mode.id ? accent : ink,
                    cursor: "pointer",
                  }}
                >
                  {m.label}
                  {m.id === mode.id && <Check size={13} />}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Controls */}
        <div style={{ display: "flex", gap: 8, marginBottom: 10 }}>
          <button
            onClick={() => setRunning((r) => !r)}
            disabled={!isStopwatch && secondsLeft === 0}
            style={{
              flex: 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
              padding: "11px 0",
              borderRadius: 14,
              border: "none",
              background: accent,
              color: "#fff",
              fontSize: 14,
              fontWeight: 700,
              cursor: (!isStopwatch && secondsLeft === 0) ? "default" : "pointer",
              opacity: (!isStopwatch && secondsLeft === 0) ? 0.5 : 1,
              boxShadow: "0 8px 18px rgba(217,104,46,0.35)",
            }}
          >
            {running ? <Pause size={15} fill="#fff" /> : <Play size={15} fill="#fff" />}
            {running ? "Pause" : "Start Focus"}
          </button>
          <button
            onClick={reset}
            style={{
              width: 42,
              borderRadius: 14,
              border: `1px solid ${line}`,
              background: "#fff",
              color: ink,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
            }}
            aria-label="Reset"
          >
            <RotateCcw size={15} />
          </button>
        </div>

        {/* Topic picker */}
        <div style={{ position: "relative" }}>
          <button
            onClick={() => setTopicOpen((o) => !o)}
            style={{
              width: "100%",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "9px 12px",
              borderRadius: 13,
              border: `1px solid ${line}`,
              background: "#fff",
              fontSize: 12,
              fontWeight: 500,
              color: topic ? ink : muted,
              cursor: "pointer",
            }}
          >
            {topic || "Pick a topic to focus on"}
            <ChevronDown size={14} color={muted} style={{ transform: topicOpen ? "rotate(180deg)" : "none", transition: "transform .15s" }} />
          </button>
          {topicOpen && (
            <div
              style={{
                position: "absolute",
                top: "calc(100% + 6px)",
                left: 0,
                right: 0,
                background: "#fff",
                border: `1px solid ${line}`,
                borderRadius: 16,
                overflow: "hidden",
                boxShadow: "0 12px 30px rgba(32,34,43,0.12)",
                zIndex: 10,
              }}
            >
              {TOPICS.map((tp) => (
                <button
                  key={tp}
                  onClick={() => { setTopic(tp); setTopicOpen(false); }}
                  style={{
                    width: "100%",
                    textAlign: "left",
                    padding: "9px 12px",
                    background: tp === topic ? "#FBEFE8" : "transparent",
                    border: "none",
                    fontSize: 12,
                    fontWeight: 500,
                    color: tp === topic ? accent : ink,
                    cursor: "pointer",
                  }}
                >
                  {tp}
                </button>
              ))}
              {topic && (
                <button
                  onClick={() => { setTopic(null); setTopicOpen(false); }}
                  style={{
                    width: "100%",
                    textAlign: "left",
                    padding: "9px 12px",
                    background: "transparent",
                    border: "none",
                    borderTop: `1px solid ${line}`,
                    fontSize: 12,
                    fontWeight: 500,
                    color: muted,
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                  }}
                >
                  <X size={12} /> Clear
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
