import React, { useState } from "react";
import {
  Home,
  CheckSquare,
  BarChart2,
  Settings as SettingsIcon,
  Plus,
  Bell,
  Flame,
  Play,
  User,
  Moon,
  Calendar,
  ChevronRight,
  Target,
} from "lucide-react";

// ---- Design tokens (from the agreed Plano palette) ----
const colors = {
  bg: "#EAE6DD",
  card: "#FFFFFF",
  accent: "#F4F26A",
  accentText: "#41400E",
  ink: "#1A1A1A",
  muted: "#8A8577",
  pill: "#EFEDE6",
  successBg: "#EAF3DE",
  successText: "#3B6D11",
  warnBg: "#FAECE7",
  warnText: "#993C1D",
};

// ---- Sample data (replace with real app state) ----
const initialTasks = [
  { id: 1, title: "Physics – Chapter 4 revision", subject: "Physics", time: "9:00 AM", status: "due", done: false },
  { id: 2, title: "Write essay outline", subject: "English", time: "2:00 PM", status: "later", done: false },
  { id: 3, title: "Math homework set 3", subject: "Math", time: "Completed 8:10 AM", status: "done", done: true },
  { id: 4, title: "Salah reminder", subject: "Daily", time: "Recurring", status: "later", done: false },
];

const weekHours = [3, 5, 4, 7, 5.5, 2, 1.5];

export default function PlanoApp() {
  const [activeTab, setActiveTab] = useState("home");
  const [tasks, setTasks] = useState(initialTasks);

  const toggleTask = (id) =>
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, done: !t.done, status: !t.done ? "done" : "later" } : t))
    );

  const doneCount = tasks.filter((t) => t.done).length;

  return (
    <div
      style={{
        background: colors.bg,
        minHeight: "100vh",
        maxWidth: 380,
        margin: "0 auto",
        fontFamily:
          "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <div style={{ flex: 1, padding: "20px 20px 8px", overflowY: "auto" }}>
        {activeTab === "home" && <HomeTab tasks={tasks} onToggle={toggleTask} />}
        {activeTab === "tasks" && <TasksTab tasks={tasks} onToggle={toggleTask} />}
        {activeTab === "stats" && <StatsTab doneCount={doneCount} total={tasks.length} />}
        {activeTab === "settings" && <SettingsTab />}
      </div>

      <BottomNav active={activeTab} onChange={setActiveTab} />
    </div>
  );
}

// ---------------- Shared bits ----------------

function Header({ title = "Plano" }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: 16,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <div
          style={{
            width: 32,
            height: 32,
            borderRadius: 9,
            background: colors.ink,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Target size={18} color={colors.accent} />
        </div>
        <span style={{ fontSize: 16, fontWeight: 600, color: colors.ink }}>{title}</span>
      </div>
      <div
        style={{
          width: 34,
          height: 34,
          borderRadius: "50%",
          background: colors.card,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Bell size={16} color={colors.ink} />
      </div>
    </div>
  );
}

function StatusBadge({ status }) {
  const map = {
    due: { bg: colors.warnBg, text: colors.warnText, label: "Due" },
    later: { bg: colors.pill, text: colors.muted, label: "Later" },
    done: { bg: colors.successBg, text: colors.successText, label: "Done" },
  };
  const s = map[status] || map.later;
  return (
    <span
      style={{
        background: s.bg,
        color: s.text,
        fontSize: 11,
        padding: "3px 10px",
        borderRadius: 999,
        flexShrink: 0,
      }}
    >
      {s.label}
    </span>
  );
}

function TaskRow({ task, onToggle }) {
  return (
    <div
      style={{
        background: colors.card,
        borderRadius: 16,
        padding: "13px 14px",
        marginBottom: 8,
        display: "flex",
        alignItems: "center",
        gap: 11,
      }}
    >
      <button
        onClick={() => onToggle(task.id)}
        aria-label={task.done ? "Mark as not done" : "Mark as done"}
        style={{
          width: 22,
          height: 22,
          borderRadius: 7,
          border: task.done ? "none" : `2px solid ${colors.ink}`,
          background: task.done ? colors.ink : "transparent",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
          cursor: "pointer",
          padding: 0,
        }}
      >
        {task.done && <CheckSquare size={13} color={colors.accent} />}
      </button>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div
          style={{
            fontSize: 13.5,
            fontWeight: 500,
            color: task.done ? colors.muted : colors.ink,
            textDecoration: task.done ? "line-through" : "none",
          }}
        >
          {task.title}
        </div>
        <div style={{ fontSize: 11.5, color: colors.muted }}>{task.time}</div>
      </div>
      <StatusBadge status={task.status} />
    </div>
  );
}

// ---------------- Tabs ----------------

function HomeTab({ tasks, onToggle }) {
  const today = tasks.slice(0, 3);
  return (
    <div>
      <Header />
      <div style={{ fontSize: 12, color: colors.muted, marginBottom: 2 }}>
        {new Date().toLocaleDateString(undefined, { weekday: "long", month: "short", day: "numeric" })}
      </div>
      <div style={{ fontSize: 20, fontWeight: 500, color: colors.ink, marginBottom: 16 }}>
        You have {tasks.filter((t) => !t.done).length} tasks today
      </div>

      <div
        style={{
          background: colors.ink,
          borderRadius: 18,
          padding: 16,
          marginBottom: 14,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div>
          <div style={{ fontSize: 11, color: colors.accent, marginBottom: 2 }}>STUDY STREAK</div>
          <div style={{ fontSize: 22, fontWeight: 600, color: "#FFFFFF" }}>6 days 🔥</div>
        </div>
        <div
          style={{
            width: 52,
            height: 52,
            borderRadius: "50%",
            background: colors.accent,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Play size={22} color={colors.ink} />
        </div>
      </div>

      <div style={{ fontSize: 12, fontWeight: 600, color: colors.muted, marginBottom: 8 }}>
        TODAY'S TASKS
      </div>
      {today.map((t) => (
        <TaskRow key={t.id} task={t} onToggle={onToggle} />
      ))}
    </div>
  );
}

function TasksTab({ tasks, onToggle }) {
  const [filter, setFilter] = useState("all");
  const filtered = tasks.filter((t) => {
    if (filter === "done") return t.done;
    if (filter === "today") return !t.done;
    return true;
  });

  return (
    <div>
      <Header title="Tasks" />
      <div style={{ display: "flex", gap: 6, marginBottom: 12 }}>
        {["all", "today", "done"].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            style={{
              background: filter === f ? colors.ink : colors.card,
              color: filter === f ? colors.accent : colors.muted,
              fontSize: 12,
              padding: "6px 14px",
              borderRadius: 999,
              border: "none",
              cursor: "pointer",
              textTransform: "capitalize",
            }}
          >
            {f}
          </button>
        ))}
      </div>
      {filtered.map((t) => (
        <TaskRow key={t.id} task={t} onToggle={onToggle} />
      ))}
      {filtered.length === 0 && (
        <div style={{ color: colors.muted, fontSize: 13, textAlign: "center", marginTop: 24 }}>
          No tasks here yet.
        </div>
      )}
    </div>
  );
}

function StatsTab({ doneCount, total }) {
  const max = Math.max(...weekHours);
  const days = ["M", "T", "W", "T", "F", "S", "S"];
  return (
    <div>
      <Header title="Stats" />
      <div style={{ fontSize: 13, fontWeight: 600, color: colors.ink, marginBottom: 10 }}>This week</div>

      <div style={{ background: colors.card, borderRadius: 16, padding: 14, marginBottom: 12 }}>
        <div style={{ fontSize: 11.5, color: colors.muted, marginBottom: 10 }}>Hours studied</div>
        <div style={{ display: "flex", alignItems: "flex-end", gap: 8, height: 90 }}>
          {weekHours.map((h, i) => (
            <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
              <div
                style={{
                  width: 18,
                  height: `${(h / max) * 70}px`,
                  background: i === 3 ? colors.accent : colors.pill,
                  borderRadius: 4,
                }}
              />
              <span style={{ fontSize: 10, color: colors.muted }}>{days[i]}</span>
            </div>
          ))}
        </div>
      </div>

      <div style={{ background: colors.ink, borderRadius: 16, padding: 14 }}>
        <div style={{ fontSize: 11, color: colors.accent, marginBottom: 3 }}>TASKS DONE</div>
        <div style={{ fontSize: 22, fontWeight: 600, color: "#FFFFFF" }}>
          {doneCount} / {total}
        </div>
      </div>
    </div>
  );
}

function SettingRow({ icon, label }) {
  return (
    <div
      style={{
        background: colors.card,
        borderRadius: 14,
        padding: "12px 14px",
        marginBottom: 8,
        display: "flex",
        alignItems: "center",
        gap: 10,
      }}
    >
      {icon}
      <div style={{ flex: 1, fontSize: 13.5, color: colors.ink }}>{label}</div>
      <ChevronRight size={16} color={colors.muted} />
    </div>
  );
}

function SettingsTab() {
  return (
    <div>
      <Header title="Settings" />
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginBottom: 18 }}>
        <div
          style={{
            width: 56,
            height: 56,
            borderRadius: "50%",
            background: colors.ink,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: 8,
          }}
        >
          <User size={24} color={colors.accent} />
        </div>
        <div style={{ fontSize: 14, fontWeight: 600, color: colors.ink }}>Your name</div>
      </div>

      <SettingRow icon={<Bell size={16} color={colors.ink} />} label="Notifications" />
      <SettingRow icon={<Moon size={16} color={colors.ink} />} label="Dark mode" />
      <SettingRow icon={<Calendar size={16} color={colors.ink} />} label="Calendar sync" />
    </div>
  );
}

function BottomNav({ active, onChange }) {
  const items = [
    { key: "home", icon: Home },
    { key: "tasks", icon: CheckSquare },
    { key: "add", icon: Plus, isFab: true },
    { key: "stats", icon: BarChart2 },
    { key: "settings", icon: SettingsIcon },
  ];

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-around",
        alignItems: "center",
        background: colors.ink,
        borderRadius: 999,
        padding: "11px 14px",
        margin: "0 16px 16px",
      }}
    >
      {items.map(({ key, icon: Icon, isFab }) =>
        isFab ? (
          <button
            key={key}
            aria-label="Add task"
            style={{
              width: 38,
              height: 38,
              borderRadius: "50%",
              background: colors.accent,
              border: "none",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
            }}
          >
            <Icon size={20} color={colors.ink} />
          </button>
        ) : (
          <button
            key={key}
            onClick={() => onChange(key)}
            aria-label={key}
            style={{ background: "transparent", border: "none", cursor: "pointer", padding: 6 }}
          >
            <Icon size={20} color={active === key ? colors.accent : colors.muted} />
          </button>
        )
      )}
    </div>
  );
}
