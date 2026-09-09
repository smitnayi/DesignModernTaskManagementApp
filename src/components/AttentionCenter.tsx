import { useState } from "react";
import { AlarmClock, MoonStar, Check, Bell, CalendarClock, ChevronDown, PartyPopper, ArrowRight } from "lucide-react";
import { PASTEL, Task, taskHealth, memberById, SPRINT } from "../data";
import { Avatar } from "./primitives";

type Filter = "all" | "overdue" | "stale";

export function AttentionCenter({ tasks, onOpenTask, onReschedule, onMarkDone, onCaughtUp, onNudge }: {
  tasks: Task[];
  onOpenTask: (t: Task) => void;
  onReschedule: (id: string, days: number) => void;
  onMarkDone: (id: string) => void;
  onCaughtUp: (id: string) => void;
  onNudge: (id: string) => void;
}) {
  const [filter, setFilter] = useState<Filter>("all");
  const [menuFor, setMenuFor] = useState<string | null>(null);

  const enriched = tasks
    .map((t) => ({ t, h: taskHealth(t) }))
    .filter(({ h }) => h.kind === "overdue" || h.stale);

  const overdue = enriched.filter(({ h }) => h.kind === "overdue");
  const stale = enriched.filter(({ h }) => h.kind !== "overdue" && h.stale);

  const shown = filter === "overdue" ? overdue : filter === "stale" ? stale : [...overdue, ...stale];
  const atRisk = overdue.length > 0;

  return (
    <div className="bento-card overflow-hidden">
      {/* Header — sprint risk context */}
      <div className="relative overflow-hidden px-6 pt-6 pb-5" style={{ background: atRisk ? "linear-gradient(120deg, #FFE4E6, #FFEDD5)" : "linear-gradient(120deg, #DCFCE7, #ECFCCB)" }}>
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/70 backdrop-blur" style={{ boxShadow: "0 4px 12px -2px rgba(0,0,0,0.08)" }}>
              {atRisk ? <AlarmClock className="h-6 w-6 text-rose-600" strokeWidth={2.2} /> : <PartyPopper className="h-6 w-6 text-lime-700" strokeWidth={2.2} />}
            </span>
            <div>
              <h2 className="text-[18px] font-extrabold tracking-tight text-stone-900">
                {atRisk ? <>Needs <span className="font-serif-italic font-normal">attention</span></> : <>All <span className="font-serif-italic font-normal">clear</span></>}
              </h2>
              <p className="mt-0.5 text-[12.5px] font-semibold text-stone-600">
                {SPRINT.name} · {SPRINT.daysLeft} days left
                {atRisk ? ` · ${overdue.length} overdue, ${stale.length} gone quiet` : " · sprint on track"}
              </p>
            </div>
          </div>
          {enriched.length > 0 && (
            <span className="tnum flex h-8 items-center gap-1.5 rounded-full bg-white/70 px-3 text-[12px] font-extrabold text-stone-800 backdrop-blur">
              <span className={atRisk ? "beacon inline-block h-2 w-2 rounded-full bg-rose-500" : "inline-block h-2 w-2 rounded-full bg-lime-500"} />
              {enriched.length} to resolve
            </span>
          )}
        </div>

        {enriched.length > 0 && (
          <div className="mt-4 inline-flex rounded-full bg-white/60 p-1 backdrop-blur">
            {([["all", `All ${enriched.length}`], ["overdue", `Overdue ${overdue.length}`], ["stale", `Quiet ${stale.length}`]] as [Filter, string][]).map(([f, label]) => (
              <button key={f} onClick={() => setFilter(f)} className={`tactile rounded-full px-3.5 py-1.5 text-[12px] font-extrabold transition-colors ${filter === f ? "bg-white text-stone-900 shadow-sm" : "text-stone-500"}`}>{label}</button>
            ))}
          </div>
        )}
      </div>

      {/* Rows */}
      <div className="p-3">
        {shown.length === 0 ? (
          <div className="flex flex-col items-center gap-2 py-12 text-center">
            <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-lime-100"><Check className="h-7 w-7 text-lime-600" strokeWidth={2.4} /></span>
            <p className="text-[14px] font-extrabold text-stone-900">Nothing {filter === "stale" ? "gone quiet" : filter === "overdue" ? "overdue" : "needs attention"}</p>
            <p className="text-[12.5px] font-medium text-stone-500">You're on top of it. Ship with confidence.</p>
          </div>
        ) : (
          <div className="space-y-1.5">
            {shown.map(({ t, h }) => {
              const od = h.kind === "overdue";
              const lead = memberById(t.assignees[0]);
              const c = od ? PASTEL.rose : PASTEL.gold;
              return (
                <div key={t.id} className="attn-row group flex flex-col gap-3 rounded-2xl border border-transparent p-3 transition-colors hover:border-stone-100 hover:bg-stone-50 sm:flex-row sm:items-center">
                  {/* status glyph */}
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl" style={{ background: c.bg, color: c.text, border: `1px solid ${c.border}` }}>
                    {od ? <AlarmClock className={`h-[18px] w-[18px] ${od ? "beacon rounded-full" : ""}`} strokeWidth={2.2} /> : <MoonStar className="h-[18px] w-[18px]" strokeWidth={2.2} />}
                  </span>

                  {/* task */}
                  <button onClick={() => onOpenTask(t)} className="tactile min-w-0 flex-1 text-left">
                    <div className="flex items-center gap-2">
                      <span className="tech-badge text-[9px] text-stone-400">{t.code}</span>
                      <span className="tnum rounded-full px-1.5 py-0.5 text-[10px] font-extrabold" style={{ background: c.bg, color: c.text }}>
                        {od ? `${h.daysOverdue}d overdue` : `Quiet ${h.daysSinceUpdate}d`}
                      </span>
                    </div>
                    <div className="mt-0.5 truncate text-[13.5px] font-bold text-stone-900 group-hover:text-violet-700">{t.title}</div>
                    <div className="mt-0.5 text-[11.5px] font-medium text-stone-500">
                      {od
                        ? `Was due ${h.daysOverdue}d ago · ${t.status === "todo" ? "not started yet" : "still " + t.status.replace("_", " ")}`
                        : `No update in ${h.daysSinceUpdate} days · sitting in ${t.status.replace("_", " ")}`}
                    </div>
                  </button>

                  <Avatar member={lead} size={30} />

                  {/* actions */}
                  <div className="flex shrink-0 items-center gap-1.5">
                    {od ? (
                      <>
                        <div className="relative">
                          <button onClick={() => setMenuFor((m) => (m === t.id ? null : t.id))} className="tactile flex items-center gap-1 rounded-full bg-white px-3 py-1.5 text-[12px] font-extrabold text-stone-700" style={{ border: "1px solid rgba(0,0,0,0.08)" }}>
                            <CalendarClock className="h-3.5 w-3.5" strokeWidth={2.2} />Reschedule<ChevronDown className="h-3 w-3" strokeWidth={2.6} />
                          </button>
                          {menuFor === t.id && (
                            <>
                              <div className="fixed inset-0 z-20" onClick={() => setMenuFor(null)} />
                              <div className="palette-in absolute right-0 z-30 mt-1.5 w-40 rounded-2xl bg-white p-1.5" style={{ border: "1px solid rgba(0,0,0,0.08)", boxShadow: "0 16px 34px -6px rgba(18,19,22,0.18)" }}>
                                {[["Tomorrow", 1], ["In 3 days", 3], ["Next week", 7]].map(([label, d]) => (
                                  <button key={label as string} onClick={() => { onReschedule(t.id, d as number); setMenuFor(null); }} className="tactile flex w-full items-center justify-between rounded-xl px-3 py-2 text-left text-[12.5px] font-bold text-stone-700 hover:bg-stone-100">
                                    {label}<ArrowRight className="h-3.5 w-3.5 text-stone-300" strokeWidth={2.2} />
                                  </button>
                                ))}
                              </div>
                            </>
                          )}
                        </div>
                        <button onClick={() => onNudge(t.id)} className="tactile flex h-8 w-8 items-center justify-center rounded-full bg-white text-stone-500 hover:text-stone-900" style={{ border: "1px solid rgba(0,0,0,0.08)" }} aria-label="Nudge assignee"><Bell className="h-[15px] w-[15px]" strokeWidth={2.2} /></button>
                        <button onClick={() => onMarkDone(t.id)} className="tactile flex items-center gap-1 rounded-full bg-stone-900 px-3 py-1.5 text-[12px] font-extrabold text-white"><Check className="h-3.5 w-3.5" strokeWidth={2.8} />Done</button>
                      </>
                    ) : (
                      <>
                        <button onClick={() => onNudge(t.id)} className="tactile flex items-center gap-1 rounded-full bg-white px-3 py-1.5 text-[12px] font-extrabold text-stone-700" style={{ border: "1px solid rgba(0,0,0,0.08)" }}><Bell className="h-3.5 w-3.5" strokeWidth={2.2} />Nudge</button>
                        <button onClick={() => onCaughtUp(t.id)} className="tactile flex items-center gap-1 rounded-full bg-stone-900 px-3 py-1.5 text-[12px] font-extrabold text-white"><Check className="h-3.5 w-3.5" strokeWidth={2.8} />Caught up</button>
                      </>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
