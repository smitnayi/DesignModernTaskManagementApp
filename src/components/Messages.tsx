import { useState } from "react";
import { Hash, Search, Send, Plus, Paperclip, Check, CheckCheck, Phone, Video, Pin, Smile, Users } from "lucide-react";
import { PASTEL, PastelKey, members, memberById } from "../data";

interface Channel { id: string; name: string; tint: PastelKey; desc: string; unread?: number; members: string[] }
const CHANNELS: Channel[] = [
  { id: "des", name: "Design Internal", tint: "lavender", desc: "Design System 2.0", unread: 1, members: ["u1", "u2", "u6", "u4"] },
  { id: "pub", name: "Publications", tint: "rose", desc: "Marketing & case studies", unread: 3, members: ["u4", "u3", "u1"] },
  { id: "com", name: "Commercial", tint: "peach", desc: "Client portals & delivery", members: ["u3", "u2", "u4"] },
];

interface Msg { who: string; text: string; time: string; ref?: string; self?: boolean; read?: boolean; react?: string }
const THREADS: Record<string, Msg[]> = {
  des: [
    { who: "u2", text: "Pushed the new pastel token set to the branch — can someone review the contrast ratios?", time: "09:12", ref: "MRD-001" },
    { who: "u1", text: "On it. The lavender pairing clears 4.6:1, we're good on AA.", time: "09:15", react: "🔥" },
    { who: "u6", text: "Nice. I'll wire the striped progress gradients into the kanban cards this afternoon.", time: "09:18" },
    { who: "u1", text: "Perfect — let's demo the tactile segmented control at standup.", time: "09:21", self: true, read: true },
  ],
  pub: [
    { who: "u4", text: "New Dribbble shots for the launch are in the Figma. Feedback by EOD?", time: "11:02", ref: "MRD-014" },
    { who: "u3", text: "Looks stunning. Ship it.", time: "11:20", react: "🎉" },
  ],
  com: [
    { who: "u3", text: "Banking client signed off on the dashboard flows 🎉", time: "08:40", ref: "MRD-012" },
  ],
};
const TYPING: Record<string, string | null> = { des: "u6", pub: null, com: null };

export function Messages() {
  const [active, setActive] = useState("des");
  const [draft, setDraft] = useState("");
  const [threads, setThreads] = useState(THREADS);
  const ch = CHANNELS.find((c) => c.id === active)!;
  const typing = TYPING[active];

  const send = () => {
    if (!draft.trim()) return;
    setThreads((p) => ({ ...p, [active]: [...p[active], { who: "u1", text: draft.trim(), time: "now", self: true, read: false }] }));
    setDraft("");
  };

  return (
    <div className="rise-in px-5 pb-16 lg:px-8">
      <div className="grid h-[calc(100vh-140px)] grid-cols-1 gap-4 lg:grid-cols-[288px_minmax(0,1fr)]">
        {/* Channels + presence */}
        <div className="bento-card flex flex-col overflow-hidden p-4">
          <div className="mb-3 flex items-center justify-between px-1">
            <h1 className="text-[20px] font-extrabold tracking-tight text-stone-900">Spaces</h1>
            <button className="tactile flex h-7 w-7 items-center justify-center rounded-full hover:bg-stone-100"><Plus className="h-4 w-4 text-stone-500" strokeWidth={2.2} /></button>
          </div>
          <div className="mb-3 flex items-center gap-2 rounded-xl bg-stone-50 px-3 py-2" style={{ border: "1px solid rgba(0,0,0,0.05)" }}>
            <Search className="h-4 w-4 text-stone-400" strokeWidth={2} />
            <input placeholder="Search spaces" className="flex-1 bg-transparent text-[13px] font-medium outline-none placeholder:text-stone-400" />
          </div>

          <div className="space-y-1 overflow-y-auto">
            {CHANNELS.map((c) => {
              const p = PASTEL[c.tint];
              const on = c.id === active;
              return (
                <button key={c.id} onClick={() => setActive(c.id)} className={`tactile flex w-full items-center gap-3 rounded-2xl px-3 py-2.5 text-left ${on ? "bg-stone-50" : "hover:bg-stone-50"}`} style={on ? { border: "1px solid rgba(0,0,0,0.05)" } : undefined}>
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl" style={{ background: p.bg, border: `1px solid ${p.border}` }}><Hash className="h-4 w-4" strokeWidth={2.2} style={{ color: p.text }} /></span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-[13.5px] font-bold text-stone-900">{c.name}</span>
                    <span className="block truncate text-[11px] font-medium text-stone-400">{c.desc}</span>
                  </span>
                  {c.unread && <span className="tnum flex h-5 min-w-5 items-center justify-center rounded-full bg-stone-900 px-1.5 text-[10px] font-extrabold text-white">{c.unread}</span>}
                </button>
              );
            })}
          </div>

          <div className="mt-auto pt-4">
            <div className="mb-2 flex items-center gap-1.5 px-1 tech-badge text-[9px] text-stone-400"><Users className="h-3 w-3" strokeWidth={2.2} />Online — {members.filter((m) => m.presence !== "offline").length}</div>
            <div className="space-y-0.5">
              {members.filter((m) => m.presence !== "offline").slice(0, 4).map((m) => (
                <div key={m.id} className="flex items-center gap-2.5 rounded-xl px-2 py-1.5 hover:bg-stone-50">
                  <span className="relative">
                    <span className="flex h-7 w-7 items-center justify-center rounded-full text-[9px] font-extrabold text-white" style={{ background: PASTEL[m.tint].solid }}>{m.initials}</span>
                    <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full ring-2 ring-white" style={{ background: m.presence === "online" ? "#84cc16" : "#f59e0b" }} />
                  </span>
                  <span className="flex-1 truncate text-[12.5px] font-bold text-stone-700">{m.name.split(" ")[0]}</span>
                  <span className="text-[10px] font-medium text-stone-400">{m.presence === "online" ? "Online" : "In flow"}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Thread */}
        <div className="bento-card flex flex-col overflow-hidden">
          {/* Header */}
          <div className="flex items-center gap-3 border-b border-stone-100 px-6 py-3.5">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl" style={{ background: PASTEL[ch.tint].bg, border: `1px solid ${PASTEL[ch.tint].border}` }}><Hash className="h-4 w-4" strokeWidth={2.2} style={{ color: PASTEL[ch.tint].text }} /></span>
            <div className="min-w-0 flex-1">
              <div className="truncate text-[15px] font-extrabold tracking-tight text-stone-900">{ch.name}</div>
              <div className="truncate text-[11.5px] font-medium text-stone-400">{ch.members.length} members · {ch.desc}</div>
            </div>
            <div className="flex -space-x-2">
              {ch.members.slice(0, 4).map((id) => {
                const m = memberById(id);
                return <span key={id} className="flex h-7 w-7 items-center justify-center rounded-full text-[9px] font-extrabold text-white ring-2 ring-white" style={{ background: PASTEL[m.tint].solid }}>{m.initials}</span>;
              })}
            </div>
            <div className="ml-1 flex items-center gap-1">
              <button className="tactile flex h-9 w-9 items-center justify-center rounded-full hover:bg-stone-100" aria-label="Call"><Phone className="h-[17px] w-[17px] text-stone-500" strokeWidth={2} /></button>
              <button className="tactile flex h-9 w-9 items-center justify-center rounded-full hover:bg-stone-100" aria-label="Video"><Video className="h-[17px] w-[17px] text-stone-500" strokeWidth={2} /></button>
              <button className="tactile flex h-9 w-9 items-center justify-center rounded-full hover:bg-stone-100" aria-label="Pinned"><Pin className="h-[17px] w-[17px] text-stone-500" strokeWidth={2} /></button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 space-y-4 overflow-y-auto px-6 py-5">
            <div className="flex items-center gap-3">
              <div className="h-px flex-1 bg-stone-100" />
              <span className="tech-badge text-[9px] text-stone-400">Today</span>
              <div className="h-px flex-1 bg-stone-100" />
            </div>

            {threads[active].map((m, i) => {
              const mem = memberById(m.who);
              return (
                <div key={i} className={`group flex items-end gap-2.5 ${m.self ? "flex-row-reverse" : ""}`}>
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[10px] font-extrabold text-white" style={{ background: PASTEL[mem.tint].solid }}>{mem.initials}</span>
                  <div className={`relative flex max-w-[75%] flex-col ${m.self ? "items-end" : "items-start"}`}>
                    <div className={`relative rounded-2xl px-3.5 py-2.5 text-[13.5px] leading-relaxed ${m.self ? "rounded-br-md bg-stone-900 text-white" : "rounded-bl-md bg-stone-50 text-stone-700"}`} style={!m.self ? { border: "1px solid rgba(0,0,0,0.05)" } : undefined}>
                      {m.ref && <span className="mb-0.5 block tech-badge text-[9px] text-violet-400">#{m.ref}</span>}
                      {m.text}
                      {/* hover react button */}
                      <button className={`tactile absolute -top-3 ${m.self ? "left-0 -translate-x-1/2" : "right-0 translate-x-1/2"} flex h-6 w-6 items-center justify-center rounded-full bg-white opacity-0 shadow-md transition-opacity group-hover:opacity-100`} style={{ border: "1px solid rgba(0,0,0,0.08)" }} aria-label="React"><Smile className="h-3.5 w-3.5 text-stone-500" strokeWidth={2} /></button>
                      {m.react && <span className="absolute -bottom-2.5 right-1 rounded-full bg-white px-1 py-0.5 text-[11px] shadow-sm" style={{ border: "1px solid rgba(0,0,0,0.06)" }}>{m.react}</span>}
                    </div>
                    <div className="mt-1.5 flex items-center gap-1 px-1 text-[10px] font-medium text-stone-400">
                      {!m.self && <span className="font-bold text-stone-500">{mem.name.split(" ")[0]}</span>}
                      <span className="tnum">{m.time}</span>
                      {m.self && (m.read ? <CheckCheck className="h-3 w-3 text-sky-500" strokeWidth={2.4} /> : <Check className="h-3 w-3" strokeWidth={2.4} />)}
                    </div>
                  </div>
                </div>
              );
            })}

            {typing && (
              <div className="flex items-end gap-2.5">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[10px] font-extrabold text-white" style={{ background: PASTEL[memberById(typing).tint].solid }}>{memberById(typing).initials}</span>
                <div className="flex items-center gap-1 rounded-2xl rounded-bl-md bg-stone-50 px-3.5 py-3" style={{ border: "1px solid rgba(0,0,0,0.05)" }}>
                  {[0, 1, 2].map((d) => <span key={d} className="typing-dot h-1.5 w-1.5 rounded-full bg-stone-400" style={{ animationDelay: `${d * 160}ms` }} />)}
                </div>
              </div>
            )}
          </div>

          {/* Composer */}
          <div className="border-t border-stone-100 p-4">
            <div className="flex items-center gap-2 rounded-2xl bg-stone-50 px-3 py-2" style={{ border: "1px solid rgba(0,0,0,0.06)" }}>
              <button className="tactile flex h-8 w-8 items-center justify-center rounded-full hover:bg-stone-200"><Paperclip className="h-4 w-4 text-stone-500" strokeWidth={2} /></button>
              <input value={draft} onChange={(e) => setDraft(e.target.value)} onKeyDown={(e) => e.key === "Enter" && send()} placeholder={`Message #${ch.name}…`} className="flex-1 bg-transparent text-[13.5px] font-medium outline-none placeholder:text-stone-400" />
              <button className="tactile flex h-8 w-8 items-center justify-center rounded-full hover:bg-stone-200"><Smile className="h-4 w-4 text-stone-500" strokeWidth={2} /></button>
              <button onClick={send} disabled={!draft.trim()} className="tactile flex h-9 w-9 items-center justify-center rounded-full bg-stone-900 text-white disabled:opacity-40"><Send className="h-4 w-4" strokeWidth={2.2} /></button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
