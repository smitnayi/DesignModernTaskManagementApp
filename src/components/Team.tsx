import { Mail, ArrowRight, UserPlus } from "lucide-react";
import { PASTEL, members, Member } from "../data";
import { Avatar } from "./primitives";

const presenceLabel: Record<Member["presence"], { label: string; color: string }> = {
  online: { label: "Online", color: "#84cc16" },
  busy: { label: "In flow", color: "#f59e0b" },
  offline: { label: "Away", color: "#a1a1aa" },
};

function MemberCard({ m }: { m: Member }) {
  const c = PASTEL[m.tint];
  const p = presenceLabel[m.presence];
  const cap = Math.min(100, Math.round((m.hours / 40) * 100));
  return (
    <div className="bento-card bento-card-interactive group relative overflow-hidden p-5">
      <div className="pointer-events-none absolute -right-10 -top-10 h-28 w-28 rounded-full opacity-0 blur-2xl transition-opacity duration-300 group-hover:opacity-40" style={{ background: c.solid }} />
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <Avatar member={m} size={48} />
          <div>
            <div className="text-[15px] font-extrabold tracking-tight text-stone-900">{m.name}</div>
            <div className="text-[12px] font-medium text-stone-500">{m.email}</div>
          </div>
        </div>
        <span className="rounded-full px-2.5 py-1 text-[10px] font-extrabold" style={{ background: c.bg, color: c.text, border: `1px solid ${c.border}` }}>{m.role}</span>
      </div>

      <div className="mt-4 flex items-center gap-1.5">
        <span className="h-2 w-2 rounded-full" style={{ background: p.color }} />
        <span className="text-[12px] font-bold text-stone-600">{p.label}</span>
      </div>

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
        <div className="mb-1 flex items-center justify-between text-[11px] font-bold text-stone-500">
          <span>Logged this week</span>
          <span className="tnum text-stone-900">{m.hours}h</span>
        </div>
        <div className="h-2 w-full overflow-hidden rounded-full bg-stone-200/70">
          <div className="h-full rounded-full" style={{ width: `${cap}%`, background: c.solid }} />
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
  return (
    <div className="rise-in px-5 pb-16 lg:px-8">
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-[32px] font-extrabold leading-none tracking-tight text-stone-900">
            The <span className="font-serif-italic font-normal text-violet-700">studio</span>
          </h1>
          <p className="mt-1.5 text-[13.5px] font-medium text-stone-500">6 members · 3 online now</p>
        </div>
        <button className="tactile flex items-center gap-1.5 rounded-full bg-stone-900 px-4 py-2.5 text-[13px] font-extrabold text-white"><UserPlus className="h-4 w-4" strokeWidth={2.4} />Invite member</button>
      </div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        {members.map((m) => <MemberCard key={m.id} m={m} />)}
      </div>
    </div>
  );
}
