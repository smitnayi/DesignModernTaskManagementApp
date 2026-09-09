import { useState } from "react";
import { Mail, ArrowRight, UserPlus, Search, Users, Activity, Zap, Gauge } from "lucide-react";
import { PASTEL, PastelKey, members, Member } from "../data";
import { Avatar } from "./primitives";

const presenceLabel: Record<Member["presence"], { label: string; color: string }> = {
  online: { label: "Online", color: "#84cc16" },
  busy: { label: "In flow", color: "#f59e0b" },
  offline: { label: "Away", color: "#a1a1aa" },
};

type Filter = "all" | "online" | "capacity";

function capacityMeta(hours: number) {
  const pct = Math.round((hours / 40) * 100);
  if (hours >= 37) return { pct, tint: "rose" as PastelKey, label: "At capacity" };
  if (hours >= 30) return { pct, tint: "gold" as PastelKey, label: "Balanced" };
  return { pct, tint: "mint" as PastelKey, label: "Has room" };
}

function StatPill({ icon: Icon, label, value, tint }: { icon: any; label: string; value: string; tint: PastelKey }) {
  const c = PASTEL[tint];
  return (
    <div className="bento-card bento-card-interactive flex items-center gap-3 p-4">
      <span className="flex h-10 w-10 items-center justify-center rounded-2xl" style={{ background: c.bg, color: c.text, border: `1px solid ${c.border}` }}>
        <Icon className="h-5 w-5" strokeWidth={2.2} />
      </span>
      <div>
        <div className="tnum text-[22px] font-extrabold leading-none tracking-tight text-stone-900">{value}</div>
        <div className="mt-0.5 text-[12px] font-bold text-stone-500">{label}</div>
      </div>
    </div>
  );
}

function MemberCard({ m }: { m: Member }) {
  const c = PASTEL[m.tint];
  const p = presenceLabel[m.presence];
  const cap = capacityMeta(m.hours);
  const capC = PASTEL[cap.tint];
  return (
    <div className="bento-card bento-card-interactive group relative overflow-hidden p-5">
      <div className="pointer-events-none absolute -right-10 -top-10 h-28 w-28 rounded-full opacity-0 blur-2xl transition-opacity duration-300 group-hover:opacity-30" style={{ background: c.solid }} />

      <div className="flex items-start gap-3">
        <Avatar member={m} size={52} />
        <div className="min-w-0 flex-1">
          <div className="truncate text-[15px] font-extrabold tracking-tight text-stone-900">{m.name}</div>
          <div className="mt-0.5 flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full" style={{ background: p.color }} />
            <span className="text-[12px] font-bold text-stone-600">{p.label}</span>
          </div>
        </div>
      </div>

      <div className="mt-3 inline-flex rounded-full px-2.5 py-1 text-[10px] font-extrabold" style={{ background: c.bg, color: c.text, border: `1px solid ${c.border}` }}>{m.role}</div>

      <div className="mt-4 grid grid-cols-2 gap-2 text-[12px]">
        <div className="rounded-xl bg-stone-50 px-3 py-2" style={{ border: "1px solid rgba(0,0,0,0.04)" }}>
          <div className="tnum text-[18px] font-extrabold text-stone-900">{m.projects}</div>
          <div className="font-medium text-stone-500">Projects</div>
        </div>
        <div className="rounded-xl bg-stone-50 px-3 py-2" style={{ border: "1px solid rgba(0,0,0,0.04)" }}>
          <div className="tnum text-[18px] font-extrabold text-stone-900">{m.tasks}</div>
          <div className="font-medium text-stone-500">Sprint tasks</div>
        </div>
      </div>

      <div className="mt-4">
        <div className="mb-1.5 flex items-center justify-between text-[11px] font-bold">
          <span className="flex items-center gap-1" style={{ color: capC.text }}><Gauge className="h-3.5 w-3.5" strokeWidth={2.2} />{cap.label}</span>
          <span className="tnum text-stone-900">{m.hours}h / 40h</span>
        </div>
        <div className="h-2 w-full overflow-hidden rounded-full bg-stone-200/70">
          <div className="h-full rounded-full transition-all duration-500" style={{ width: `${cap.pct}%`, background: capC.solid }} />
        </div>
      </div>

      <div className="mt-4 flex gap-2">
        <button className="tactile flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-stone-900 py-2 text-[12px] font-extrabold text-white"><Mail className="h-3.5 w-3.5" strokeWidth={2.2} />Message</button>
        <button className="tactile flex items-center justify-center gap-1 rounded-xl bg-stone-100 px-3 py-2 text-[12px] font-extrabold text-stone-700 hover:bg-stone-200">Profile<ArrowRight className="h-3.5 w-3.5" strokeWidth={2.2} /></button>
      </div>
    </div>
  );
}

export function Team() {
  const [filter, setFilter] = useState<Filter>("all");
  const [q, setQ] = useState("");

  const online = members.filter((m) => m.presence !== "offline").length;
  const avgCap = Math.round(members.reduce((s, m) => s + m.hours, 0) / members.length / 40 * 100);
  const totalTasks = members.reduce((s, m) => s + m.tasks, 0);
  const atCapacity = members.filter((m) => m.hours >= 37).length;

  const shown = members.filter((m) => {
    if (q && !m.name.toLowerCase().includes(q.toLowerCase()) && !m.role.toLowerCase().includes(q.toLowerCase())) return false;
    if (filter === "online") return m.presence !== "offline";
    if (filter === "capacity") return m.hours >= 37;
    return true;
  });

  return (
    <div className="rise-in px-5 pb-16 lg:px-8">
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-[32px] font-extrabold leading-none tracking-tight text-stone-900">
            The <span className="font-serif-italic font-normal text-violet-700">studio</span>
          </h1>
          <p className="mt-1.5 text-[13.5px] font-medium text-stone-500">{members.length} members · {online} active now</p>
        </div>
        <button className="tactile flex items-center gap-1.5 rounded-full bg-stone-900 px-4 py-2.5 text-[13px] font-extrabold text-white"><UserPlus className="h-4 w-4" strokeWidth={2.4} />Invite member</button>
      </div>

      {/* Overview stats */}
      <div className="mb-4 grid grid-cols-2 gap-4 xl:grid-cols-4">
        <StatPill icon={Users} label="Total members" value={String(members.length)} tint="lavender" />
        <StatPill icon={Activity} label="Active now" value={String(online)} tint="lime" />
        <StatPill icon={Zap} label="Sprint tasks" value={String(totalTasks)} tint="sky" />
        <StatPill icon={Gauge} label="Avg capacity" value={`${avgCap}%`} tint={atCapacity > 0 ? "peach" : "mint"} />
      </div>

      {/* Filter + search bar */}
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div className="inline-flex rounded-full bg-white p-1" style={{ border: "1px solid rgba(0,0,0,0.06)" }}>
          {([["all", `Everyone ${members.length}`], ["online", `Active ${online}`], ["capacity", `At capacity ${atCapacity}`]] as [Filter, string][]).map(([f, label]) => (
            <button key={f} onClick={() => setFilter(f)} className={`tactile rounded-full px-3.5 py-1.5 text-[12.5px] font-extrabold transition-colors ${filter === f ? "bg-stone-900 text-white" : "text-stone-500 hover:text-stone-800"}`}>{label}</button>
          ))}
        </div>
        <div className="flex items-center gap-2 rounded-full bg-white px-3.5 py-2" style={{ border: "1px solid rgba(0,0,0,0.06)" }}>
          <Search className="h-4 w-4 text-stone-400" strokeWidth={2} />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search people" className="w-40 bg-transparent text-[13px] font-medium outline-none placeholder:text-stone-400" />
        </div>
      </div>

      {shown.length === 0 ? (
        <div className="bento-card py-16 text-center text-[13.5px] font-medium text-stone-400">No members match “{q}”.</div>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {shown.map((m) => <MemberCard key={m.id} m={m} />)}
        </div>
      )}
    </div>
  );
}
