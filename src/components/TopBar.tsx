import { Search, Bell, Plus, Zap, Command, Menu } from "lucide-react";
import { useEffect, useState } from "react";
import { members } from "../data";
import { Avatar } from "./primitives";

export function TopBar({ onCommand, onNewTask, onMenu }: { onCommand: () => void; onNewTask: () => void; onMenu: () => void }) {
  const [remaining, setRemaining] = useState({ d: 4, h: 12, m: 47, s: 20 });
  const [notifOpen, setNotifOpen] = useState(false);

  useEffect(() => {
    const t = setInterval(() => {
      setRemaining((r) => {
        let { d, h, m, s } = r;
        s -= 1;
        if (s < 0) { s = 59; m -= 1; }
        if (m < 0) { m = 59; h -= 1; }
        if (h < 0) { h = 23; d -= 1; }
        return { d, h, m, s };
      });
    }, 1000);
    return () => clearInterval(t);
  }, []);

  const pad = (n: number) => String(n).padStart(2, "0");

  return (
    <header className="sticky top-0 z-20 flex items-center gap-2.5 px-4 py-4 sm:gap-3 sm:px-5 lg:px-8" style={{ background: "color-mix(in srgb, var(--color-canvas) 82%, transparent)", backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)" }}>
      {/* Mobile menu */}
      <button
        onClick={onMenu}
        className="tactile focus-ring flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white lg:hidden"
        style={{ border: "1px solid rgba(0,0,0,0.07)" }}
        aria-label="Open menu"
      >
        <Menu className="h-[18px] w-[18px] text-stone-600" strokeWidth={2} />
      </button>

      {/* Command / search capsule */}
      <button
        onClick={onCommand}
        className="tactile focus-ring group flex flex-1 items-center gap-3 rounded-full bg-white px-4 py-2.5 text-left lg:max-w-md"
        style={{ border: "1px solid rgba(0,0,0,0.07)", boxShadow: "0 2px 10px -2px rgba(18,19,22,0.05)" }}
      >
        <Search className="h-[18px] w-[18px] text-stone-400" strokeWidth={2} />
        <span className="flex-1 text-[13.5px] font-medium text-stone-400">Search tasks, people, actions…</span>
        <kbd className="tech-badge flex items-center gap-0.5 rounded-md bg-stone-100 px-1.5 py-0.5 text-[10px] text-stone-500">
          <Command className="h-3 w-3" strokeWidth={2.4} />K
        </kbd>
      </button>

      {/* Dynamic Island */}
      <div className="dynamic-island mx-auto hidden items-center gap-4 rounded-full px-5 py-2.5 text-white xl:flex">
        <div className="flex items-center gap-2">
          <Zap className="h-4 w-4 text-lime-400" strokeWidth={2.2} fill="#a3e635" />
          <span className="text-[13px] font-bold tracking-tight">Sprint 24</span>
        </div>
        <span className="h-4 w-px bg-white/15" />
        <span className="tnum text-[13px] font-medium text-white/80">
          {pad(remaining.d)}d {pad(remaining.h)}h {pad(remaining.m)}m {pad(remaining.s)}s
        </span>
        <span className="h-4 w-px bg-white/15" />
        <div className="flex items-center gap-2">
          <span className="beacon inline-block h-2 w-2 rounded-full bg-lime-400" />
          <span className="text-[13px] font-medium text-white/80">4 live in standup</span>
        </div>
      </div>

      <div className="ml-auto flex items-center gap-2.5 xl:ml-0">
        <button
          onClick={onNewTask}
          className="tactile focus-ring flex items-center gap-1.5 rounded-full px-3 py-2.5 text-[13px] font-extrabold text-white sm:px-4"
          style={{ background: "#111318", boxShadow: "0 8px 20px -6px rgba(0,0,0,0.4)" }}
        >
          <Plus className="h-4 w-4" strokeWidth={2.6} />
          <span className="hidden sm:inline">New task</span>
        </button>

        <div className="relative">
          <button
            onClick={() => setNotifOpen((o) => !o)}
            className="tactile focus-ring relative flex h-10 w-10 items-center justify-center rounded-full bg-white"
            style={{ border: "1px solid rgba(0,0,0,0.07)" }}
            aria-label="Notifications"
          >
            <Bell className="h-[18px] w-[18px] text-stone-600" strokeWidth={2} />
            <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-rose-500 ring-2 ring-white" />
          </button>
          {notifOpen && (
            <>
            <div className="fixed inset-0 z-20" onClick={() => setNotifOpen(false)} />
            <div
              className="palette-in absolute right-0 z-30 mt-2 w-80 max-w-[calc(100vw-2rem)] rounded-2xl bg-white p-2"
              style={{ border: "1px solid rgba(0,0,0,0.08)", boxShadow: "0 20px 40px -8px rgba(18,19,22,0.2)" }}
            >
              <div className="px-3 pb-2 pt-1 text-[13px] font-extrabold text-stone-900">Join requests</div>
              <div className="rounded-xl bg-stone-50 p-3">
                <div className="flex items-center gap-2.5">
                  <Avatar member={members[5]} size={34} />
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-[13px] font-bold text-stone-900">Aisha Johnson</div>
                    <div className="text-[11px] text-stone-500">wants to join Acme Studio</div>
                  </div>
                </div>
                <div className="mt-2.5 flex gap-2">
                  <button className="tactile flex-1 rounded-lg bg-lime-100 py-1.5 text-[12px] font-extrabold text-lime-800" style={{ border: "1px solid #d9f99d" }}>Approve</button>
                  <button className="tactile flex-1 rounded-lg bg-rose-100 py-1.5 text-[12px] font-extrabold text-rose-700" style={{ border: "1px solid #fecdd3" }}>Decline</button>
                </div>
              </div>
              <div className="px-3 pb-1 pt-3 text-[13px] font-extrabold text-stone-900">Notifications</div>
              {[
                "Elena moved MRD-012 to In Review",
                "Marcus checked off subtask #2",
                "New comment on MRD-001",
              ].map((n) => (
                <div key={n} className="rounded-xl px-3 py-2 text-[12.5px] font-medium text-stone-600 hover:bg-stone-50">{n}</div>
              ))}
            </div>
            </>
          )}
        </div>

        <button className="tactile focus-ring rounded-full ring-1 ring-black/5" aria-label="Your profile">
          <Avatar member={members[0]} size={40} />
        </button>
      </div>
    </header>
  );
}
