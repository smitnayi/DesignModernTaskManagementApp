import { useEffect, useState } from "react";
import { X, Link2, Check, Plus, Clock, Calendar, Play, Pause, AlarmClock, MoonStar } from "lucide-react";
import { PASTEL, Task, Status, STATUS_META, memberById, taskHealth } from "../data";
import { Avatar, PriorityBadge, ProgressBar } from "./primitives";
import { ImageWithFallback } from "./figma/ImageWithFallback";

const STATUSES: Status[] = ["todo", "in_progress", "in_review", "done"];

export function TaskDrawer({ task, onClose, onToggleSub, onStatus, onAddSub }: {
  task: Task | null;
  onClose: () => void;
  onToggleSub: (taskId: string, subId: string) => void;
  onStatus: (taskId: string, status: Status) => void;
  onAddSub: (taskId: string, title: string) => void;
}) {
  const [draft, setDraft] = useState("");
  const [timing, setTiming] = useState(false);
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    if (!timing) return;
    const t = setInterval(() => setElapsed((e) => e + 1), 1000);
    return () => clearInterval(t);
  }, [timing]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  if (!task) return null;
  const health = taskHealth(task);
  const done = task.subtasks.filter((s) => s.done).length;
  const pct = task.subtasks.length ? Math.round((done / task.subtasks.length) * 100) : 0;
  const fmt = (s: number) => `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;

  const activity = [
    { who: "u3", text: "moved task from In Progress to In Review", time: "2h ago" },
    { who: "u2", text: "checked off subtask #2", time: "4h ago" },
    { who: "u1", text: "created this task", time: "Yesterday" },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="overlay-in absolute inset-0 bg-stone-900/40 backdrop-blur-[3px]" onClick={onClose} />
      <div
        className="palette-in relative flex max-h-[88vh] w-full max-w-[560px] flex-col overflow-hidden rounded-[28px] bg-white"
        role="dialog"
        aria-modal="true"
        aria-label={task.title}
        style={{
          border: "1px solid rgba(0,0,0,0.07)",
          boxShadow: "0 40px 80px -20px rgba(18,19,22,0.3)",
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-stone-100 px-6 py-4">
          <span className="tech-badge rounded-lg bg-stone-100 px-2.5 py-1 text-[11px] text-stone-600">{task.code}</span>
          <div className="flex items-center gap-1.5">
            <button className="tactile flex h-9 w-9 items-center justify-center rounded-full hover:bg-stone-100" aria-label="Copy link"><Link2 className="h-[17px] w-[17px] text-stone-500" strokeWidth={2} /></button>
            <button onClick={onClose} className="tactile flex h-9 w-9 items-center justify-center rounded-full hover:bg-stone-100" aria-label="Close"><X className="h-[17px] w-[17px] text-stone-500" strokeWidth={2} /></button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-5">
          {/* Status pills */}
          <div className="flex flex-wrap gap-1.5">
            {STATUSES.map((s) => {
              const meta = STATUS_META[s];
              const c = PASTEL[meta.tint];
              const active = task.status === s;
              return (
                <button
                  key={s}
                  onClick={() => onStatus(task.id, s)}
                  className="tactile rounded-full px-3 py-1.5 text-[12px] font-bold transition-all"
                  style={active
                    ? { background: c.bg, color: c.text, border: `1px solid ${c.border}` }
                    : { background: "#fff", color: "#78716c", border: "1px solid rgba(0,0,0,0.08)" }}
                >
                  {meta.label}
                </button>
              );
            })}
          </div>

          {(health.kind === "overdue" || health.stale) && (
            <div className="mt-4 flex items-center gap-2.5 rounded-2xl px-3.5 py-3" style={{ background: health.kind === "overdue" ? PASTEL.rose.bg : PASTEL.gold.bg, border: `1px solid ${health.kind === "overdue" ? PASTEL.rose.border : PASTEL.gold.border}` }}>
              {health.kind === "overdue"
                ? <AlarmClock className="beacon h-5 w-5 shrink-0 rounded-full" style={{ color: PASTEL.rose.text }} strokeWidth={2.2} />
                : <MoonStar className="h-5 w-5 shrink-0" style={{ color: PASTEL.gold.text }} strokeWidth={2.2} />}
              <p className="text-[12.5px] font-bold" style={{ color: health.kind === "overdue" ? PASTEL.rose.text : PASTEL.gold.text }}>
                {health.kind === "overdue"
                  ? `This task is ${health.daysOverdue} day${health.daysOverdue > 1 ? "s" : ""} overdue.`
                  : `No update in ${health.daysSinceUpdate} days — is this still moving?`}
              </p>
            </div>
          )}

          <h1 className="mt-5 text-[24px] font-extrabold leading-tight tracking-tight text-stone-900">{task.title}</h1>
          <p className="mt-2 text-[14px] leading-relaxed text-stone-600">{task.description}</p>

          {task.mockup && (
            <div className="mt-4 overflow-hidden rounded-2xl bg-stone-100" style={{ aspectRatio: "16/9", border: "1px solid rgba(0,0,0,0.06)" }}>
              <ImageWithFallback src={task.mockup} alt={`${task.code} mockup`} className="h-full w-full object-cover" />
            </div>
          )}

          {/* Metadata grid */}
          <div className="mt-5 grid grid-cols-2 gap-3">
            <MetaBox label="Priority"><PriorityBadge priority={task.priority} /></MetaBox>
            <MetaBox label="Due date">
              <span className="flex items-center gap-1.5 text-[13px] font-bold" style={{ color: health.kind === "overdue" ? PASTEL.rose.text : "#1c1917" }}>
                <Calendar className="h-3.5 w-3.5" style={{ color: health.kind === "overdue" ? PASTEL.rose.text : "#a8a29e" }} strokeWidth={2} />{health.dueLabel}
              </span>
            </MetaBox>
            <MetaBox label="Assignees">
              <div className="flex -space-x-1.5">
                {task.assignees.map((id) => <div key={id} className="ring-2 ring-white rounded-full"><Avatar member={memberById(id)} size={24} ring={false} /></div>)}
              </div>
            </MetaBox>
            <MetaBox label="Space">
              <span className="rounded-full px-2 py-0.5 text-[12px] font-bold" style={{ background: PASTEL[task.spaceTint].bg, color: PASTEL[task.spaceTint].text }}>{task.space}</span>
            </MetaBox>
          </div>

          {/* Time tracker */}
          <div className="mt-4 flex items-center justify-between rounded-2xl bg-stone-900 px-4 py-3.5 text-white">
            <div className="flex items-center gap-2">
              <Clock className={`h-4 w-4 text-lime-400 ${timing ? "beacon rounded-full" : ""}`} strokeWidth={2.2} />
              <span className="text-[13px] font-bold">Time tracker</span>
              <span className="tnum text-[14px] font-medium text-white/80">{fmt(elapsed)}</span>
            </div>
            <button onClick={() => setTiming((t) => !t)} className="tactile flex items-center gap-1.5 rounded-full bg-white/10 px-3.5 py-1.5 text-[12px] font-bold hover:bg-white/20" style={{ border: "1px solid rgba(255,255,255,0.12)" }}>
              {timing ? <><Pause className="h-3.5 w-3.5" strokeWidth={2.4} />Pause</> : <><Play className="h-3.5 w-3.5" strokeWidth={2.4} fill="currentColor" />Start</>}
            </button>
          </div>

          {/* Subtasks */}
          <div className="mt-6">
            <div className="mb-2 flex items-center justify-between">
              <h2 className="text-[15px] font-extrabold text-stone-900">Subtasks</h2>
              <span className="tnum text-[12px] font-bold text-stone-500">{done}/{task.subtasks.length}</span>
            </div>
            <ProgressBar value={pct} striped="green" />
            <div className="mt-3 space-y-1">
              {task.subtasks.map((s) => (
                <button key={s.id} onClick={() => onToggleSub(task.id, s.id)} className="tactile flex w-full items-center gap-2.5 rounded-xl px-2 py-2 text-left hover:bg-stone-50">
                  <span className={`flex h-5 w-5 items-center justify-center rounded-md transition-colors ${s.done ? "bg-lime-500" : "bg-white"}`} style={{ border: `1.5px solid ${s.done ? "#84cc16" : "#d6d3d1"}` }}>
                    {s.done && <Check className="h-3.5 w-3.5 text-white" strokeWidth={3} />}
                  </span>
                  <span className={`text-[13.5px] font-medium ${s.done ? "text-stone-400 line-through" : "text-stone-700"}`}>{s.title}</span>
                </button>
              ))}
            </div>
            <form
              onSubmit={(e) => { e.preventDefault(); if (draft.trim()) { onAddSub(task.id, draft.trim()); setDraft(""); } }}
              className="mt-2 flex items-center gap-2 rounded-xl bg-stone-50 px-2 py-1.5" style={{ border: "1px solid rgba(0,0,0,0.05)" }}
            >
              <Plus className="h-4 w-4 text-stone-400" strokeWidth={2.2} />
              <input value={draft} onChange={(e) => setDraft(e.target.value)} placeholder="Add subtask, press Enter…" className="flex-1 bg-transparent py-1 text-[13px] font-medium text-stone-700 outline-none placeholder:text-stone-400" />
            </form>
          </div>

          {/* Activity */}
          <div className="mt-6">
            <h2 className="mb-3 text-[15px] font-extrabold text-stone-900">Activity</h2>
            <div className="space-y-3">
              {activity.map((a, i) => (
                <div key={i} className="flex items-start gap-2.5">
                  <Avatar member={memberById(a.who)} size={28} ring={false} />
                  <div className="text-[13px] leading-snug text-stone-600">
                    <span className="font-bold text-stone-900">{memberById(a.who).name.split(" ")[0]}</span> {a.text}
                    <div className="text-[11px] font-medium text-stone-400">{a.time}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Comment box */}
        <div className="border-t border-stone-100 p-4">
          <div className="flex items-center gap-2 rounded-2xl bg-stone-50 px-3 py-2" style={{ border: "1px solid rgba(0,0,0,0.06)" }}>
            <Avatar member={memberById("u1")} size={28} ring={false} />
            <input placeholder="Write a comment… use @ to mention" className="flex-1 bg-transparent text-[13px] font-medium text-stone-700 outline-none placeholder:text-stone-400" />
            <button className="tactile rounded-full bg-stone-900 px-3.5 py-1.5 text-[12px] font-extrabold text-white">Send</button>
          </div>
        </div>
      </div>
    </div>
  );
}

function MetaBox({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl bg-stone-50 px-3.5 py-3" style={{ border: "1px solid rgba(0,0,0,0.05)" }}>
      <div className="tech-badge mb-1.5 text-[9px] text-stone-400">{label}</div>
      {children}
    </div>
  );
}
