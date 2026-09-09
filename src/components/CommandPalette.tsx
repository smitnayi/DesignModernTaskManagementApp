import { useEffect, useMemo, useRef, useState } from "react";
import { Search, LayoutDashboard, KanbanSquare, Users, Plus, UserPlus, Moon, CornerDownLeft } from "lucide-react";
import { initialTasks, members } from "../data";
import type { View } from "./Sidebar";

interface Item {
  id: string;
  label: string;
  hint: string;
  icon: any;
  action: () => void;
}

export function CommandPalette({ open, onClose, onNavigate, onNewTask }: {
  open: boolean;
  onClose: () => void;
  onNavigate: (v: View) => void;
  onNewTask: () => void;
}) {
  const [q, setQ] = useState("");
  const [sel, setSel] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const items: Item[] = useMemo(() => {
    const nav: Item[] = [
      { id: "n-dash", label: "Go to Dashboard", hint: "Navigation", icon: LayoutDashboard, action: () => onNavigate("dashboard") },
      { id: "n-kan", label: "Go to Kanban board", hint: "Navigation", icon: KanbanSquare, action: () => onNavigate("kanban") },
      { id: "n-team", label: "Go to Team", hint: "Navigation", icon: Users, action: () => onNavigate("team") },
    ];
    const actions: Item[] = [
      { id: "a-new", label: "Create task", hint: "Action", icon: Plus, action: onNewTask },
      { id: "a-invite", label: "Invite member", hint: "Action", icon: UserPlus, action: () => onNavigate("team") },
      { id: "a-theme", label: "Toggle dark / light mode", hint: "Action", icon: Moon, action: () => {} },
    ];
    const taskItems: Item[] = initialTasks.map((t) => ({
      id: `t-${t.id}`, label: `${t.code} · ${t.title}`, hint: "Task", icon: KanbanSquare, action: () => onNavigate("kanban"),
    }));
    const memberItems: Item[] = members.map((m) => ({
      id: `m-${m.id}`, label: m.name, hint: m.role, icon: Users, action: () => onNavigate("team"),
    }));
    const all = [...nav, ...actions, ...taskItems, ...memberItems];
    if (!q.trim()) return all.slice(0, 8);
    const ql = q.toLowerCase();
    return all.filter((i) => i.label.toLowerCase().includes(ql) || i.hint.toLowerCase().includes(ql)).slice(0, 9);
  }, [q, onNavigate, onNewTask]);

  useEffect(() => { setSel(0); }, [q]);
  useEffect(() => { if (open) setTimeout(() => inputRef.current?.focus(), 30); else setQ(""); }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowDown") { e.preventDefault(); setSel((s) => Math.min(s + 1, items.length - 1)); }
      if (e.key === "ArrowUp") { e.preventDefault(); setSel((s) => Math.max(s - 1, 0)); }
      if (e.key === "Enter") { e.preventDefault(); items[sel]?.action(); onClose(); }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, items, sel, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-start justify-center pt-[12vh]" onClick={onClose}>
      <div className="overlay-in absolute inset-0 bg-stone-900/40 backdrop-blur-md" />
      <div
        className="palette-in relative w-full max-w-[560px] overflow-hidden rounded-3xl"
        style={{ background: "#111318", border: "1px solid rgba(255,255,255,0.1)", boxShadow: "0 30px 60px -12px rgba(0,0,0,0.6)" }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-3 border-b border-white/10 px-5 py-4">
          <Search className="h-5 w-5 text-white/40" strokeWidth={2} />
          <input
            ref={inputRef}
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search tasks, people, or run a command…"
            className="flex-1 bg-transparent text-[15px] font-medium text-white outline-none placeholder:text-white/40"
          />
          <kbd className="tech-badge rounded-md bg-white/10 px-2 py-1 text-[10px] text-white/50">Esc</kbd>
        </div>
        <div className="max-h-[52vh] overflow-y-auto p-2">
          {items.length === 0 && <div className="px-4 py-8 text-center text-[13px] font-medium text-white/40">No results for "{q}"</div>}
          {items.map((it, i) => (
            <button
              key={it.id}
              onMouseEnter={() => setSel(i)}
              onClick={() => { it.action(); onClose(); }}
              className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition-colors ${i === sel ? "bg-white/10" : ""}`}
            >
              <span className={`flex h-8 w-8 items-center justify-center rounded-lg ${i === sel ? "bg-white/15" : "bg-white/5"}`}>
                <it.icon className="h-4 w-4 text-white/80" strokeWidth={2} />
              </span>
              <span className="flex-1 truncate text-[13.5px] font-semibold text-white">{it.label}</span>
              <span className="tech-badge text-[9px] text-white/35">{it.hint}</span>
              {i === sel && <CornerDownLeft className="h-3.5 w-3.5 text-white/50" strokeWidth={2} />}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-4 border-t border-white/10 px-5 py-2.5 text-[10px] font-medium text-white/40">
          <span className="flex items-center gap-1"><kbd className="tech-badge rounded bg-white/10 px-1">↑</kbd><kbd className="tech-badge rounded bg-white/10 px-1">↓</kbd> navigate</span>
          <span className="flex items-center gap-1"><kbd className="tech-badge rounded bg-white/10 px-1">↵</kbd> select</span>
        </div>
      </div>
    </div>
  );
}
