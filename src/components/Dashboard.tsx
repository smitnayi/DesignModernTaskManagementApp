import { useState } from "react";
import { ArrowUpRight, TrendingUp, Check, Rocket, Target } from "lucide-react";
import { PASTEL, PastelKey, Task, Status, memberById } from "../data";
import { Tag, PriorityBadge, AvatarStack, ProgressBar, SegmentedControl } from "./primitives";
import { MetricBars } from "./MetricBars";

const KPIS: { label: string; value: string; delta: string; tint: PastelKey; icon: any; spark: number[] }[] = [
  { label: "Total Tasks", value: "137", delta: "+20%", tint: "lavender", icon: TrendingUp, spark: [30, 45, 38, 60, 52, 74, 68] },
  { label: "Efficiency Score", value: "8.6", delta: "+0.5", tint: "peach", icon: Target, spark: [40, 42, 55, 50, 62, 70, 86] },
  { label: "Sprint Completion", value: "74%", delta: "+10%", tint: "sky", icon: Target, spark: [20, 35, 40, 48, 60, 66, 74] },
  { label: "Team Velocity", value: "42", delta: "+8", tint: "lime", icon: Rocket, spark: [25, 30, 45, 40, 55, 60, 72] },
];

function Sparkline({ data, color }: { data: number[]; color: string }) {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const pts = data
    .map((v, i) => `${(i / (data.length - 1)) * 100},${28 - ((v - min) / (max - min || 1)) * 24 - 2}`)
    .join(" ");
  return (
    <svg viewBox="0 0 100 28" className="h-8 w-20" preserveAspectRatio="none">
      <polyline points={pts} fill="none" stroke={color} strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round" vectorEffect="non-scaling-stroke" />
    </svg>
  );
}

function Dial({ value, tint }: { value: number; tint: PastelKey }) {
  const c = PASTEL[tint];
  const r = 26;
  const circ = 2 * Math.PI * r;
  return (
    <svg viewBox="0 0 64 64" className="h-16 w-16 -rotate-90">
      <circle cx="32" cy="32" r={r} fill="none" stroke={c.border} strokeWidth={7} />
      <circle
        cx="32" cy="32" r={r} fill="none" stroke={c.solid} strokeWidth={7} strokeLinecap="round"
        strokeDasharray={circ} strokeDashoffset={circ - (value / 100) * circ}
        style={{ transition: "stroke-dashoffset 0.7s cubic-bezier(0.16,1,0.3,1)" }}
      />
    </svg>
  );
}

export function Dashboard({ tasks, onOpenTask, onToggleSub }: {
  tasks: Task[];
  onOpenTask: (t: Task) => void;
  onToggleSub: (taskId: string, subId: string) => void;
}) {
  const [queueFilter, setQueueFilter] = useState<Status | "all">("todo");
  const lineup = tasks.filter((t) => t.status === "in_progress");
  const myWork = tasks.filter((t) => (queueFilter === "all" ? true : t.status === queueFilter));

  const stripeFor: Record<string, "purple" | "orange" | "sky" | "green"> = {
    Commercial: "orange", "Design Internal": "purple", Publications: "sky",
  };

  return (
    <div className="rise-in space-y-5 px-5 pb-16 lg:px-8">
      {/* Greeting */}
      <div className="pt-1">
        <h1 className="text-[34px] font-extrabold leading-none tracking-tight text-stone-900 lg:text-[40px]">
          Good morning, <span className="font-serif-italic font-normal text-violet-700">Kacie</span>
        </h1>
        <p className="mt-2 text-[14px] font-medium text-stone-500">
          Here's what's moving across your workspace today — Sprint 24 is 74% complete.
        </p>
      </div>

      {/* KPI bento row */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {KPIS.map((k) => {
          const c = PASTEL[k.tint];
          return (
            <div
              key={k.label}
              className="bento-card bento-card-interactive relative overflow-hidden p-5"
              style={{ background: c.bg, borderColor: c.border }}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-xl" style={{ background: "rgba(255,255,255,0.6)" }}>
                    <k.icon className="h-4 w-4" strokeWidth={2.2} style={{ color: c.text }} />
                  </div>
                  <span className="text-[13px] font-bold" style={{ color: c.text }}>{k.label}</span>
                </div>
                <span className="tnum inline-flex items-center gap-0.5 rounded-full bg-white/70 px-2 py-0.5 text-[11px] font-extrabold" style={{ color: c.text }}>
                  <ArrowUpRight className="h-3 w-3" strokeWidth={2.6} />{k.delta}
                </span>
              </div>
              <div className="mt-4 flex items-end justify-between">
                <div className="tnum text-[38px] font-extrabold leading-none tracking-tight" style={{ color: c.text }}>{k.value}</div>
                <Sparkline data={k.spark} color={c.text} />
              </div>
            </div>
          );
        })}
      </div>

      {/* Middle: lineup + my work */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-5">
        {/* Active lineup */}
        <div className="bento-card p-6 lg:col-span-3">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-[17px] font-extrabold tracking-tight text-stone-900">
              Active <span className="font-serif-italic font-normal text-stone-500">lineup</span>
            </h2>
            <span className="tech-badge text-[10px] text-stone-400">In flight</span>
          </div>
          <div className="space-y-4">
            {lineup.map((t) => {
              const pct = Math.round((t.subtasks.filter((s) => s.done).length / t.subtasks.length) * 100);
              return (
                <button key={t.id} onClick={() => onOpenTask(t)} className="tactile group block w-full text-left">
                  <div className="mb-1.5 flex items-center gap-2">
                    <span className="tech-badge rounded-md bg-stone-100 px-1.5 py-0.5 text-[10px] text-stone-500">{t.code}</span>
                    <span className="flex-1 truncate text-[14px] font-bold text-stone-900 group-hover:text-violet-700">{t.title}</span>
                    <span className="tnum text-[13px] font-extrabold text-stone-900">{pct}%</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <ProgressBar value={pct} striped={stripeFor[t.space] || "purple"} />
                    <AvatarStack ids={t.assignees} memberById={memberById} />
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* My work queue */}
        <div className="bento-card p-6 lg:col-span-2">
          <div className="mb-4 flex items-center justify-between gap-2">
            <h2 className="text-[17px] font-extrabold tracking-tight text-stone-900">My work</h2>
            <SegmentedControl
              size="sm"
              value={queueFilter}
              onChange={setQueueFilter}
              options={[
                { value: "todo", label: "To do" },
                { value: "in_progress", label: "Active" },
                { value: "done", label: "Done" },
              ]}
            />
          </div>
          <div className="space-y-3">
            {myWork.slice(0, 4).map((t) => (
              <div key={t.id} className="rounded-2xl bg-stone-50 p-3.5" style={{ border: "1px solid rgba(0,0,0,0.04)" }}>
                <div className="flex items-center justify-between gap-2">
                  <button onClick={() => onOpenTask(t)} className="tactile flex-1 truncate text-left text-[13.5px] font-bold text-stone-900 hover:text-violet-700">
                    {t.title}
                  </button>
                  <PriorityBadge priority={t.priority} />
                </div>
                <div className="mt-2.5 space-y-1.5">
                  {t.subtasks.slice(0, 2).map((s) => (
                    <button
                      key={s.id}
                      onClick={() => onToggleSub(t.id, s.id)}
                      className="tactile flex w-full items-center gap-2 text-left"
                    >
                      <span
                        className={`flex h-4 w-4 items-center justify-center rounded-md transition-colors ${
                          s.done ? "bg-lime-500" : "bg-white"
                        }`}
                        style={{ border: `1.5px solid ${s.done ? "#84cc16" : "#d6d3d1"}` }}
                      >
                        {s.done && <Check className="h-3 w-3 text-white" strokeWidth={3} />}
                      </span>
                      <span className={`text-[12.5px] font-medium ${s.done ? "text-stone-400 line-through" : "text-stone-600"}`}>
                        {s.title}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            ))}
            {myWork.length === 0 && (
              <p className="py-6 text-center text-[13px] font-medium text-stone-400">Nothing here — inbox zero.</p>
            )}
          </div>
        </div>
      </div>

      {/* Bottom telemetry cards */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="bento-card bento-card-interactive p-6">
          <div className="mb-1 flex items-center justify-between">
            <span className="text-[13px] font-bold text-stone-500">Hours logged</span>
            <span className="tnum inline-flex items-center gap-0.5 rounded-full bg-lime-100 px-2 py-0.5 text-[11px] font-extrabold text-lime-800"><ArrowUpRight className="h-3 w-3" strokeWidth={2.6} />+18.4%</span>
          </div>
          <div className="tnum text-[32px] font-extrabold tracking-tight text-stone-900">106<span className="text-[18px] text-stone-400">h</span></div>
          <div className="mt-3"><MetricBars tint="lime" /></div>
        </div>

        <div className="bento-card bento-card-interactive p-6">
          <div className="mb-1 flex items-center justify-between">
            <span className="text-[13px] font-bold text-stone-500">Tasks completed</span>
            <span className="tnum inline-flex items-center gap-0.5 rounded-full bg-violet-100 px-2 py-0.5 text-[11px] font-extrabold text-violet-800"><ArrowUpRight className="h-3 w-3" strokeWidth={2.6} />+12%</span>
          </div>
          <div className="tnum text-[32px] font-extrabold tracking-tight text-stone-900">1,482</div>
          <div className="mt-3"><MetricBars tint="lavender" highlight={5} /></div>
        </div>

        <div className="bento-card bento-card-interactive p-6">
          <div className="mb-3 text-[13px] font-bold text-stone-500">Team capacity</div>
          <div className="flex items-center gap-4">
            <div className="relative">
              <Dial value={68} tint="peach" />
              <span className="tnum absolute inset-0 flex items-center justify-center text-[15px] font-extrabold text-orange-700">68%</span>
            </div>
            <div className="space-y-1.5 text-[12.5px]">
              <div className="flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-orange-500" /><span className="font-medium text-stone-600">Allocated</span></div>
              <div className="flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-orange-200" /><span className="font-medium text-stone-600">Available</span></div>
              <div className="tnum pt-1 font-bold text-stone-900">6 members · 54 tasks</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
