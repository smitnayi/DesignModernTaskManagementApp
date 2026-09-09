import { useState } from "react";
import { Search, Plus, Share2, Video, Calendar as CalIcon, Check, ArrowUpRight } from "lucide-react";
import { PASTEL, PastelKey, members, memberById } from "../data";

interface Ev {
  day: number;
  kind: string;
  kindTint: PastelKey;
  title: string;
  start: string;
  end: string;
  platform: string;
  people: string[];
  live?: boolean;
}

const EVENTS: Ev[] = [
  { day: 3, kind: "Learn Design", kindTint: "lime", title: "Design meeting — check product", start: "10:00", end: "17:30", platform: "Google Meet", people: ["u1", "u4", "u6"], live: true },
  { day: 3, kind: "Design Meeting", kindTint: "lavender", title: "Make daily schedule design", start: "18:00", end: "20:30", platform: "Figma Live", people: ["u1", "u6"] },
  { day: 5, kind: "Focus Block", kindTint: "peach", title: "Component Architecture Sync & Refactor", start: "13:00", end: "14:30", platform: "Zoom", people: ["u2", "u4"] },
];

const DELIVERABLES = [
  { time: "9:00 – 13:00", timeTint: "rose", title: "Design System 2.0 Components", people: ["u4", "u6"], progress: 67 },
  { time: "14:30 – 16:10", timeTint: "lavender", title: "Designers Sprint Handoff", link: "meet.google.com/mzh-m…", badge: "Important" },
  { time: "17:00 – 18:00", timeTint: "sky", title: "Make Weekly Velocity Report", meta: "19 people · 81 tasks" },
  { time: "11:00 – 12:30", timeTint: "gold", title: "Microcopy & Onboarding Polish", people: ["u3", "u6"], progress: 40 },
  { time: "18:15 – 19:30", timeTint: "mint", title: "API Gateway Health Validation", link: "meet.google.com/api-dev", badge: "Urgent" },
];

const UPCOMING = [
  { who: "u4", title: "Design meeting", time: "10:00 – 17:30" },
  { who: "u6", title: "Sprint review", time: "18:00 – 20:30" },
];

const CAL_TASKS = [
  { title: "Learn design", done: true },
  { title: "Design meeting check product", done: false },
  { title: "Call client about project", done: false },
  { title: "Update design system tokens", done: false },
];

// dots per day: which pastel dots appear
const DAY_DOTS: Record<number, PastelKey[]> = {
  17: ["peach"], 18: ["lime", "sky"], 19: ["rose"], 20: ["sky"], 25: ["lime"], 27: ["lavender"], 29: ["rose"],
};

function MiniMonth() {
  const today = 3;
  const leading = [27, 28, 29, 30];
  const days = Array.from({ length: 30 }, (_, i) => i + 1);
  const trailing = [1, 2, 3, 4];
  const cells: { n: number; muted?: boolean }[] = [
    ...leading.map((n) => ({ n, muted: true })),
    ...days.map((n) => ({ n })),
    ...trailing.map((n) => ({ n, muted: true })),
  ];
  return (
    <div>
      <div className="grid grid-cols-7 gap-y-2 text-center">
        {["SU", "MO", "TU", "WE", "TH", "FR", "SA"].map((d) => (
          <div key={d} className="tech-badge text-[10px] text-stone-400">{d}</div>
        ))}
        {cells.map((c, i) => {
          const isToday = !c.muted && c.n === today;
          const dots = !c.muted ? DAY_DOTS[c.n] : undefined;
          return (
            <div key={i} className="flex flex-col items-center gap-1">
              <button
                className={`tactile flex h-8 w-8 items-center justify-center rounded-full text-[13px] font-bold tnum ${
                  isToday ? "bg-stone-900 text-white" : c.muted ? "text-stone-300" : "text-stone-700 hover:bg-stone-100"
                }`}
              >
                {c.n}
              </button>
              <div className="flex h-1.5 items-center gap-0.5">
                {dots?.map((t, j) => <span key={j} className="h-1.5 w-1.5 rounded-full" style={{ background: PASTEL[t].solid }} />)}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function Calendar() {
  const [tasks, setTasks] = useState(CAL_TASKS);
  const doneCount = tasks.filter((t) => t.done).length;
  const grouped = [3, 4, 5].map((d) => ({ day: d, evs: EVENTS.filter((e) => e.day === d) }));
  const weekday: Record<number, string> = { 3: "We", 4: "Th", 5: "Fr" };

  return (
    <div className="rise-in px-5 pb-16 lg:px-8">
      <div className="grid grid-cols-1 gap-4 xl:grid-cols-[320px_minmax(0,1fr)_360px]">
        {/* LEFT: mini month + upcoming + tasks */}
        <div className="bento-card flex flex-col gap-5 p-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-stone-900 text-white"><span className="font-serif-italic text-lg leading-none">M</span></div>
              <div className="text-[16px] font-extrabold tracking-tight text-stone-900">Calendar <span className="font-serif-italic font-normal text-stone-400">May 2026</span></div>
            </div>
            <button className="tactile flex h-8 w-8 items-center justify-center rounded-full hover:bg-stone-100"><Search className="h-4 w-4 text-stone-500" strokeWidth={2} /></button>
          </div>

          <MiniMonth />

          <div className="h-px bg-stone-100" />

          <div>
            <div className="mb-2 flex items-center justify-between">
              <h3 className="font-serif-italic text-[16px] text-stone-800">Upcoming Events</h3>
              <button className="tactile flex h-6 w-6 items-center justify-center rounded-full hover:bg-stone-100"><Plus className="h-4 w-4 text-stone-500" strokeWidth={2.2} /></button>
            </div>
            <div className="space-y-2">
              {UPCOMING.map((u) => {
                const m = memberById(u.who);
                return (
                  <div key={u.title} className="flex items-center gap-2.5">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full text-[11px] font-extrabold text-white" style={{ background: PASTEL[m.tint].solid }}>{m.initials}</div>
                    <span className="flex-1 text-[13px] font-bold text-stone-800">{u.title}</span>
                    <span className="tnum text-[11px] font-medium text-stone-400">{u.time}</span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="h-px bg-stone-100" />

          <div>
            <div className="mb-2 flex items-center justify-between">
              <h3 className="font-serif-italic text-[16px] text-stone-800">Tasks <span className="tnum text-stone-400">({doneCount}/{tasks.length})</span></h3>
              <button className="tactile flex h-6 w-6 items-center justify-center rounded-full hover:bg-stone-100"><Plus className="h-4 w-4 text-stone-500" strokeWidth={2.2} /></button>
            </div>
            <div className="space-y-1">
              {tasks.map((t, i) => (
                <button key={t.title} onClick={() => setTasks((p) => p.map((x, j) => (j === i ? { ...x, done: !x.done } : x)))} className="tactile flex w-full items-center gap-2.5 py-1.5 text-left">
                  <span className={`text-[13.5px] font-medium ${t.done ? "text-stone-400 line-through" : "text-stone-700"} flex-1`}>{t.title}</span>
                  <span className={`flex h-5 w-5 items-center justify-center rounded-md ${t.done ? "bg-stone-900" : "bg-white"}`} style={{ border: `1.5px solid ${t.done ? "#111318" : "#d6d3d1"}` }}>
                    {t.done && <Check className="h-3.5 w-3.5 text-white" strokeWidth={3} />}
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div className="mt-auto flex items-center gap-2.5 pt-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-stone-900 text-[11px] font-extrabold text-white">AJ</div>
            <span className="flex-1 text-[13.5px] font-bold text-stone-800">Alex Johnson</span>
            <button className="tactile flex h-9 w-9 items-center justify-center rounded-full bg-stone-900 text-white"><Plus className="h-4 w-4" strokeWidth={2.4} /></button>
          </div>
        </div>

        {/* CENTER: editorial timeline */}
        <div className="bento-card p-6 lg:p-8">
          <div className="mb-6 flex items-start justify-between">
            <div>
              <h1 className="font-serif-italic text-[40px] leading-none text-stone-900">May 2026</h1>
              <p className="mt-2 text-[13.5px] font-medium text-stone-500">Sprint & Meeting Editorial Timeline</p>
            </div>
            <div className="flex items-center gap-2">
              <button className="tactile flex items-center gap-1.5 rounded-full bg-stone-100 px-3.5 py-2 text-[13px] font-bold text-stone-700 hover:bg-stone-200"><Share2 className="h-4 w-4" strokeWidth={2} />Share</button>
              <button className="tactile flex items-center gap-1.5 rounded-full bg-stone-900 px-4 py-2 text-[13px] font-extrabold text-white"><Plus className="h-4 w-4" strokeWidth={2.4} />Event</button>
            </div>
          </div>

          <div className="space-y-8">
            {grouped.map(({ day, evs }) => (
              <div key={day} className="grid grid-cols-[104px_minmax(0,1fr)] gap-4">
                <div className="flex items-start gap-2">
                  <span className="font-serif-italic text-[52px] leading-none text-stone-900 tnum">{String(day).padStart(2, "0")}</span>
                  <span className="mt-2 rounded-md bg-stone-100 px-1.5 py-0.5 text-[11px] font-bold text-stone-500">{weekday[day]}</span>
                </div>
                <div className="space-y-3 border-t border-stone-100 pt-1">
                  {evs.length === 0 && (
                    <div className="flex items-center gap-2.5 rounded-2xl bg-stone-50 px-4 py-4 text-[13.5px] font-medium text-stone-400" style={{ border: "1px dashed rgba(0,0,0,0.08)" }}>
                      <CalIcon className="h-4 w-4" strokeWidth={2} />Focus Time — No meetings scheduled
                    </div>
                  )}
                  {evs.map((e) => {
                    const c = PASTEL[e.kindTint];
                    return (
                      <div key={e.title}>
                        {e.live && (
                          <div className="mb-2 flex items-center gap-2">
                            <span className="beacon h-2.5 w-2.5 rounded-full bg-lime-500" />
                            <div className="h-0.5 flex-1 rounded-full striped-bar-green striped-anim" />
                            <span className="tech-badge rounded-full bg-lime-100 px-2 py-0.5 text-[9px] text-lime-700">Live now</span>
                          </div>
                        )}
                        <div className="rounded-2xl bg-white p-4" style={{ border: "1px solid rgba(0,0,0,0.06)", boxShadow: "0 4px 16px -4px rgba(18,19,22,0.05)" }}>
                          <div className="flex items-start gap-3">
                            <span className="mt-0.5 h-11 w-1.5 shrink-0 rounded-full" style={{ background: c.solid }} />
                            <div className="min-w-0 flex-1">
                              <div className="flex items-start justify-between gap-2">
                                <span className="tech-badge text-[9px]" style={{ color: c.text }}>{e.kind}</span>
                                <div className="text-right">
                                  <div className="tnum text-[14px] font-extrabold text-stone-900">{e.start}</div>
                                  <div className="tnum text-[11px] font-medium text-stone-400">–{e.end}</div>
                                </div>
                              </div>
                              <h4 className="mt-0.5 text-[15px] font-bold tracking-tight text-stone-900">{e.title}</h4>
                            </div>
                          </div>
                          <div className="mt-3 flex items-center justify-between border-t border-stone-100 pt-3">
                            <span className="flex items-center gap-1.5 text-[12.5px] font-medium text-stone-500"><Video className="h-4 w-4" strokeWidth={2} />{e.platform}</span>
                            <div className="flex -space-x-1.5">
                              {e.people.map((id) => {
                                const m = memberById(id);
                                return <span key={id} className="flex h-6 w-6 items-center justify-center rounded-full text-[9px] font-extrabold text-white ring-2 ring-white" style={{ background: PASTEL[m.tint].solid }}>{m.initials}</span>;
                              })}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT: obsidian deliverables */}
        <div className="rounded-3xl p-5 text-white xl:sticky xl:top-4 xl:self-start" style={{ background: "#111318", boxShadow: "0 20px 40px -8px rgba(0,0,0,0.45)" }}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-[12.5px] font-medium text-white/70"><span className="beacon h-2 w-2 rounded-full bg-lime-400" />Today, 18 May 2026</div>
            <div className="flex gap-1.5">
              {["Design", "Copyright", "Dev"].map((t) => <span key={t} className="rounded-full bg-white/10 px-2.5 py-1 text-[10px] font-bold text-white/80">{t}</span>)}
            </div>
          </div>

          <div className="mt-5 flex items-center justify-between">
            <h2 className="text-[22px] font-extrabold tracking-tight">Active <span className="font-serif-italic font-normal text-lime-400">Deliverables</span> <span className="text-white/50">(5)</span></h2>
            <div className="flex items-center gap-1.5">
              <span className="rounded-full bg-lime-400/15 px-2.5 py-1 text-[10px] font-bold text-lime-400">Output Backlog</span>
              <button className="tactile flex h-6 w-6 items-center justify-center rounded-full bg-white/10"><Plus className="h-3.5 w-3.5" strokeWidth={2.4} /></button>
            </div>
          </div>
          <p className="mt-1 text-[12px] font-medium text-white/50">Ship during open focus blocks · Output backlog & velocity</p>

          <div className="mt-4 max-h-[560px] space-y-3 overflow-y-auto pr-1">
            {DELIVERABLES.map((d) => {
              const c = PASTEL[d.timeTint as PastelKey];
              return (
                <div key={d.title} className="rounded-2xl bg-white/[0.04] p-4" style={{ border: "1px solid rgba(255,255,255,0.07)" }}>
                  <div className="flex items-start justify-between">
                    <span className="tnum text-[12px] font-bold" style={{ color: c.solid }}>Time: {d.time}</span>
                    {d.badge ? (
                      <span className="rounded-full bg-white/10 px-2 py-0.5 text-[10px] font-bold text-white/80">{d.badge}</span>
                    ) : (
                      <ArrowUpRight className="h-4 w-4 text-white/40" strokeWidth={2} />
                    )}
                  </div>
                  <h4 className="mt-1.5 text-[15px] font-bold tracking-tight">{d.title}</h4>
                  <div className="mt-2.5 flex items-center justify-between">
                    {d.people && (
                      <div className="flex -space-x-1.5">
                        {d.people.map((id) => { const m = memberById(id); return <span key={id} className="flex h-6 w-6 items-center justify-center rounded-full text-[9px] font-extrabold text-white ring-2 ring-[#111318]" style={{ background: PASTEL[m.tint].solid }}>{m.initials}</span>; })}
                      </div>
                    )}
                    {d.meta && <span className="text-[12px] font-medium text-white/50">{d.meta}</span>}
                    {typeof d.progress === "number" && <span className="tnum text-[12.5px] font-extrabold text-lime-400">{d.progress}% complete</span>}
                    {d.link && (
                      <div className="flex w-full items-center justify-between">
                        <span className="truncate text-[12px] font-medium text-white/50">{d.link}</span>
                        <button className="tactile rounded-full bg-violet-500 px-3.5 py-1.5 text-[12px] font-extrabold text-white">Join Meeting</button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
