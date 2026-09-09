import { useState } from "react";
import { Hash, Search, Send, Plus, Paperclip, Check, CheckCheck } from "lucide-react";
import { PASTEL, PastelKey, memberById } from "../data";

interface Channel { id: string; name: string; tint: PastelKey; desc: string; unread?: number }
const CHANNELS: Channel[] = [
  { id: "pub", name: "Publications", tint: "rose", desc: "Marketing & case studies", unread: 3 },
  { id: "com", name: "Commercial", tint: "peach", desc: "Client portals & billing" },
  { id: "des", name: "Design Internal", tint: "lavender", desc: "Design System 2.0", unread: 1 },
];

interface Msg { who: string; text: string; time: string; ref?: string; self?: boolean; read?: boolean }
const THREADS: Record<string, Msg[]> = {
  des: [
    { who: "u2", text: "Pushed the new pastel token set to the branch — can someone review the contrast ratios?", time: "09:12", ref: "MRD-001" },
    { who: "u1", text: "On it. The lavender pairing clears 4.6:1, we're good on AA.", time: "09:15" },
    { who: "u6", text: "Nice. I'll wire the striped progress gradients into the kanban cards this afternoon.", time: "09:18" },
    { who: "u1", text: "Perfect — let's demo the tactile segmented control at standup.", time: "09:21", self: true, read: true },
  ],
  pub: [
    { who: "u4", text: "New Dribbble shots for the launch are in the Figma. Feedback by EOD?", time: "11:02", ref: "MRD-014" },
    { who: "u3", text: "Looks stunning. Ship it.", time: "11:20" },
  ],
  com: [
    { who: "u3", text: "Banking client signed off on the dashboard flows 🎉", time: "08:40", ref: "MRD-012" },
  ],
};

export function Messages() {
  const [active, setActive] = useState("des");
  const [draft, setDraft] = useState("");
  const [threads, setThreads] = useState(THREADS);
  const ch = CHANNELS.find((c) => c.id === active)!;

  const send = () => {
    if (!draft.trim()) return;
    setThreads((p) => ({ ...p, [active]: [...p[active], { who: "u1", text: draft.trim(), time: "now", self: true, read: false }] }));
    setDraft("");
  };

  return (
    <div className="rise-in px-5 pb-16 lg:px-8">
      <div className="grid h-[calc(100vh-140px)] grid-cols-1 gap-4 lg:grid-cols-[300px_minmax(0,1fr)]">
        {/* Channels */}
        <div className="bento-card flex flex-col p-4">
          <div className="mb-3 flex items-center justify-between px-1">
            <h1 className="text-[20px] font-extrabold tracking-tight text-stone-900">Spaces</h1>
            <button className="tactile flex h-7 w-7 items-center justify-center rounded-full hover:bg-stone-100"><Plus className="h-4 w-4 text-stone-500" strokeWidth={2.2} /></button>
          </div>
          <div className="mb-3 flex items-center gap-2 rounded-xl bg-stone-50 px-3 py-2" style={{ border: "1px solid rgba(0,0,0,0.05)" }}>
            <Search className="h-4 w-4 text-stone-400" strokeWidth={2} />
            <input placeholder="Search spaces" className="flex-1 bg-transparent text-[13px] font-medium outline-none placeholder:text-stone-400" />
          </div>
          <div className="space-y-1">
            {CHANNELS.map((c) => {
              const p = PASTEL[c.tint];
              const on = c.id === active;
              return (
                <button key={c.id} onClick={() => setActive(c.id)} className={`tactile flex w-full items-center gap-3 rounded-2xl px-3 py-2.5 text-left ${on ? "bg-stone-50" : "hover:bg-stone-50"}`} style={on ? { border: "1px solid rgba(0,0,0,0.05)" } : undefined}>
                  <span className="flex h-9 w-9 items-center justify-center rounded-xl" style={{ background: p.bg, border: `1px solid ${p.border}` }}><Hash className="h-4 w-4" strokeWidth={2.2} style={{ color: p.text }} /></span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-[13.5px] font-bold text-stone-900">{c.name}</span>
                    <span className="block truncate text-[11px] font-medium text-stone-400">{c.desc}</span>
                  </span>
                  {c.unread && <span className="tnum flex h-5 min-w-5 items-center justify-center rounded-full bg-stone-900 px-1.5 text-[10px] font-extrabold text-white">{c.unread}</span>}
                </button>
              );
            })}
          </div>
        </div>

        {/* Thread */}
        <div className="bento-card flex flex-col overflow-hidden">
          <div className="flex items-center gap-3 border-b border-stone-100 px-6 py-4">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl" style={{ background: PASTEL[ch.tint].bg }}><Hash className="h-4 w-4" strokeWidth={2.2} style={{ color: PASTEL[ch.tint].text }} /></span>
            <div>
              <div className="text-[15px] font-extrabold tracking-tight text-stone-900">{ch.name}</div>
              <div className="text-[11.5px] font-medium text-stone-400">{ch.desc}</div>
            </div>
          </div>

          <div className="flex-1 space-y-4 overflow-y-auto px-6 py-5">
            {threads[active].map((m, i) => {
              const mem = memberById(m.who);
              return (
                <div key={i} className={`flex items-end gap-2.5 ${m.self ? "flex-row-reverse" : ""}`}>
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[10px] font-extrabold text-white" style={{ background: PASTEL[mem.tint].solid }}>{mem.initials}</span>
                  <div className={`max-w-[75%] ${m.self ? "items-end" : "items-start"} flex flex-col`}>
                    <div className={`rounded-2xl px-3.5 py-2.5 text-[13.5px] leading-relaxed ${m.self ? "bg-stone-900 text-white" : "bg-stone-50 text-stone-700"}`} style={!m.self ? { border: "1px solid rgba(0,0,0,0.05)" } : undefined}>
                      {m.ref && <span className="mb-0.5 block tech-badge text-[9px] text-violet-500">#{m.ref}</span>}
                      {m.text}
                    </div>
                    <div className="mt-1 flex items-center gap-1 px-1 text-[10px] font-medium text-stone-400">
                      {!m.self && <span className="font-bold text-stone-500">{mem.name.split(" ")[0]}</span>}
                      <span className="tnum">{m.time}</span>
                      {m.self && (m.read ? <CheckCheck className="h-3 w-3 text-sky-500" strokeWidth={2.4} /> : <Check className="h-3 w-3" strokeWidth={2.4} />)}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="border-t border-stone-100 p-4">
            <div className="flex items-center gap-2 rounded-2xl bg-stone-50 px-3 py-2" style={{ border: "1px solid rgba(0,0,0,0.06)" }}>
              <button className="tactile flex h-8 w-8 items-center justify-center rounded-full hover:bg-stone-200"><Paperclip className="h-4 w-4 text-stone-500" strokeWidth={2} /></button>
              <input value={draft} onChange={(e) => setDraft(e.target.value)} onKeyDown={(e) => e.key === "Enter" && send()} placeholder={`Message #${ch.name}…`} className="flex-1 bg-transparent text-[13.5px] font-medium outline-none placeholder:text-stone-400" />
              <button onClick={send} className="tactile flex h-9 w-9 items-center justify-center rounded-full bg-stone-900 text-white"><Send className="h-4 w-4" strokeWidth={2.2} /></button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
