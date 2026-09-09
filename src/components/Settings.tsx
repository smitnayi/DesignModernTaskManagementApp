import { useState } from "react";
import { User, Bell, Palette, Shield, Users, Check, Camera, Monitor, Smartphone, LogOut, ChevronRight } from "lucide-react";
import { PASTEL, PastelKey } from "../data";

const SECTIONS: { id: string; label: string; icon: any; tint: PastelKey }[] = [
  { id: "profile", label: "Profile", icon: User, tint: "lavender" },
  { id: "notifications", label: "Notifications", icon: Bell, tint: "peach" },
  { id: "appearance", label: "Appearance", icon: Palette, tint: "sky" },
  { id: "members", label: "Members & roles", icon: Users, tint: "mint" },
  { id: "security", label: "Security", icon: Shield, tint: "gold" },
];

function Toggle({ on, onClick }: { on: boolean; onClick: () => void }) {
  return (
    <button onClick={onClick} className="tactile relative h-6 w-11 shrink-0 rounded-full transition-colors" style={{ background: on ? "#111318" : "#d6d3d1" }} role="switch" aria-checked={on}>
      <span className="absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-all" style={{ left: on ? "22px" : "2px", transitionTimingFunction: "cubic-bezier(0.16,1,0.3,1)" }} />
    </button>
  );
}

const ACCENTS: PastelKey[] = ["lavender", "peach", "lime", "sky", "rose", "mint", "gold", "stone"];

export function Settings({ initialSection = "profile" }: { initialSection?: string }) {
  const [active, setActive] = useState(initialSection);
  const [toggles, setToggles] = useState({ email: true, push: false, weekly: true, mentions: true });
  const [accent, setAccent] = useState<PastelKey>("lavender");
  const [density, setDensity] = useState("comfortable");
  const [theme, setTheme] = useState(0);
  const [name, setName] = useState("Kacie Velasquez");
  const [role, setRole] = useState("Lead Product Designer");
  const activeMeta = SECTIONS.find((s) => s.id === active)!;

  return (
    <div className="rise-in px-5 pb-16 lg:px-8">
      <div className="mb-5">
        <h1 className="text-[32px] font-extrabold leading-none tracking-tight text-stone-900">Work<span className="font-serif-italic font-normal text-violet-700">space settings</span></h1>
        <p className="mt-1.5 text-[13.5px] font-medium text-stone-500">Manage your profile, preferences and organization.</p>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[248px_minmax(0,1fr)]">
        <div className="bento-card h-fit p-2.5">
          {SECTIONS.map((s) => {
            const on = s.id === active;
            const c = PASTEL[s.tint];
            return (
              <button key={s.id} onClick={() => setActive(s.id)} className={`tactile flex w-full items-center gap-3 rounded-2xl px-2.5 py-2 text-left text-[13.5px] font-bold ${on ? "bg-stone-50 text-stone-900" : "text-stone-500 hover:bg-stone-50"}`} style={on ? { border: "1px solid rgba(0,0,0,0.05)" } : undefined}>
                <span className="flex h-8 w-8 items-center justify-center rounded-xl transition-colors" style={{ background: on ? c.bg : "#f5f5f4", color: on ? c.text : "#a8a29e", border: on ? `1px solid ${c.border}` : "1px solid transparent" }}>
                  <s.icon className="h-[17px] w-[17px]" strokeWidth={2.1} />
                </span>
                <span className="flex-1">{s.label}</span>
                {on && <ChevronRight className="h-4 w-4 text-stone-300" strokeWidth={2.4} />}
              </button>
            );
          })}
          <div className="my-1.5 h-px bg-stone-100" />
          <button className="tactile flex w-full items-center gap-3 rounded-2xl px-2.5 py-2 text-left text-[13.5px] font-bold text-stone-500 hover:bg-stone-50 hover:text-rose-600">
            <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-stone-50 text-stone-400"><LogOut className="h-[17px] w-[17px]" strokeWidth={2.1} /></span>
            Sign out
          </button>
        </div>

        <div>
          <div className="mb-3 flex items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl" style={{ background: PASTEL[activeMeta.tint].bg, color: PASTEL[activeMeta.tint].text, border: `1px solid ${PASTEL[activeMeta.tint].border}` }}>
              <activeMeta.icon className="h-[18px] w-[18px]" strokeWidth={2.2} />
            </span>
            <h2 className="text-[19px] font-extrabold tracking-tight text-stone-900">{activeMeta.label}</h2>
          </div>

          <div className="bento-card overflow-hidden">
            {active === "profile" && (
              <div>
                <div className="relative h-28" style={{ background: `linear-gradient(120deg, ${PASTEL[accent].bg}, ${PASTEL.peach.bg})` }}>
                  <button className="tactile absolute right-3 top-3 flex items-center gap-1.5 rounded-full bg-white/80 px-3 py-1.5 text-[11.5px] font-extrabold text-stone-700 backdrop-blur"><Camera className="h-3.5 w-3.5" strokeWidth={2.2} />Change cover</button>
                </div>
                <div className="space-y-6 p-6 lg:p-8">
                  <div className="-mt-14 flex items-end gap-4">
                    <div className="relative">
                      <div className="flex h-20 w-20 items-center justify-center rounded-3xl text-[24px] font-extrabold ring-4 ring-white" style={{ background: PASTEL[accent].solid, color: "#fff" }}>KV</div>
                      <button className="tactile absolute -bottom-1 -right-1 flex h-7 w-7 items-center justify-center rounded-full bg-stone-900 text-white ring-2 ring-white"><Camera className="h-3.5 w-3.5" strokeWidth={2.2} /></button>
                    </div>
                    <div className="pb-1">
                      <div className="text-[16px] font-extrabold text-stone-900">{name}</div>
                      <div className="text-[12.5px] font-medium text-stone-500">{role}</div>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <Field label="Full name"><input value={name} onChange={(e) => setName(e.target.value)} className="w-full bg-transparent text-[14px] font-medium outline-none" /></Field>
                    <Field label="Role title"><input value={role} onChange={(e) => setRole(e.target.value)} className="w-full bg-transparent text-[14px] font-medium outline-none" /></Field>
                    <Field label="Email"><input defaultValue="kacie@meridian.design" className="w-full bg-transparent text-[14px] font-medium outline-none" /></Field>
                    <Field label="Timezone"><input defaultValue="GMT+1 · Amsterdam" className="w-full bg-transparent text-[14px] font-medium outline-none" /></Field>
                  </div>
                  <div className="flex items-center gap-2">
                    <button className="tactile rounded-full bg-stone-900 px-5 py-2.5 text-[13px] font-extrabold text-white">Save changes</button>
                    <button className="tactile rounded-full px-4 py-2.5 text-[13px] font-bold text-stone-500 hover:bg-stone-100">Cancel</button>
                  </div>
                </div>
              </div>
            )}

            {active === "notifications" && (
              <div className="p-6 lg:p-8">
                <div className="space-y-1">
                  {[["email", "Email notifications", "Receive digest emails for assigned tasks"], ["push", "Push notifications", "Real-time browser push for @mentions"], ["weekly", "Weekly velocity report", "A Monday summary of sprint progress"], ["mentions", "Mention alerts", "Notify me when someone @mentions me"]].map(([k, t, d]) => (
                    <div key={k} className="flex items-center justify-between gap-4 border-b border-stone-100 py-4 last:border-0">
                      <div><div className="text-[14px] font-bold text-stone-900">{t}</div><div className="text-[12.5px] font-medium text-stone-500">{d}</div></div>
                      <Toggle on={(toggles as any)[k]} onClick={() => setToggles((p) => ({ ...p, [k]: !(p as any)[k] }))} />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {active === "appearance" && (
              <div className="space-y-7 p-6 lg:p-8">
                <div>
                  <div className="mb-3 text-[14px] font-bold text-stone-900">Accent color</div>
                  <div className="flex flex-wrap gap-3">
                    {ACCENTS.map((a) => (
                      <button key={a} onClick={() => setAccent(a)} className="tactile flex h-11 w-11 items-center justify-center rounded-2xl transition-transform hover:scale-105" style={{ background: PASTEL[a].bg, border: `2px solid ${accent === a ? PASTEL[a].solid : "transparent"}` }}>
                        {accent === a && <Check className="h-4 w-4" strokeWidth={3} style={{ color: PASTEL[a].text }} />}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <div className="mb-3 text-[14px] font-bold text-stone-900">Theme</div>
                  <div className="grid grid-cols-2 gap-3 sm:max-w-md">
                    {[{ label: "Alabaster", bg: "#faf8f5", fg: "#1c1917", sub: "#a8a29e" }, { label: "Obsidian", bg: "#111318", fg: "#fff", sub: "#78716c" }].map((t, i) => (
                      <button key={t.label} onClick={() => setTheme(i)} className="tactile rounded-2xl p-3 text-left transition-transform hover:scale-[1.02]" style={{ background: t.bg, border: `2px solid ${theme === i ? PASTEL[accent].solid : "rgba(0,0,0,0.08)"}` }}>
                        <div className="mb-2 flex gap-1">
                          <span className="h-2 w-8 rounded-full" style={{ background: PASTEL[accent].solid }} />
                          <span className="h-2 w-4 rounded-full" style={{ background: t.sub }} />
                        </div>
                        <div className="h-1.5 w-3/4 rounded-full" style={{ background: t.sub }} />
                        <div className="mt-1 h-1.5 w-1/2 rounded-full" style={{ background: t.sub, opacity: 0.5 }} />
                        <div className="mt-3 flex items-center justify-between">
                          <span className="text-[12.5px] font-extrabold" style={{ color: t.fg }}>{t.label}</span>
                          {theme === i && <Check className="h-4 w-4" strokeWidth={3} style={{ color: PASTEL[accent].solid }} />}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <div className="mb-3 text-[14px] font-bold text-stone-900">Density</div>
                  <div className="inline-flex rounded-full bg-stone-100 p-1">
                    {["compact", "comfortable", "spacious"].map((d) => (
                      <button key={d} onClick={() => setDensity(d)} className={`tactile rounded-full px-4 py-1.5 text-[12.5px] font-bold capitalize transition-colors ${density === d ? "bg-white text-stone-900 shadow-sm" : "text-stone-500"}`}>{d}</button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {active === "members" && (
              <div className="p-6 lg:p-8">
                <div className="mb-3 flex items-center justify-between">
                  <span className="tnum text-[12.5px] font-bold text-stone-500">6 seats · 5 used</span>
                  <button className="tactile rounded-full bg-stone-900 px-4 py-2 text-[12.5px] font-extrabold text-white">Invite people</button>
                </div>
                <div className="space-y-1">
                  {[["Kacie Velasquez", "kacie@meridian.design", "OWNER", "lavender"], ["Marcus Chen", "marcus@meridian.design", "LEADER", "sky"], ["Elena Vance", "elena@meridian.design", "MEMBER", "mint"], ["Sophia Aris", "sophia@meridian.design", "MEMBER", "mint"], ["Julian Ward", "julian@ext.com", "GUEST", "stone"]].map(([n, e, r, tint]) => (
                    <div key={n} className="flex items-center gap-3 border-b border-stone-100 py-3 last:border-0">
                      <span className="flex h-9 w-9 items-center justify-center rounded-full text-[11px] font-extrabold text-white" style={{ background: PASTEL[tint as PastelKey].solid }}>{(n as string).split(" ").map((w) => w[0]).join("")}</span>
                      <div className="min-w-0 flex-1">
                        <div className="truncate text-[13.5px] font-bold text-stone-900">{n}</div>
                        <div className="truncate text-[11.5px] font-medium text-stone-400">{e}</div>
                      </div>
                      <span className="tech-badge rounded-full px-2.5 py-1 text-[10px]" style={{ background: PASTEL[tint as PastelKey].bg, color: PASTEL[tint as PastelKey].text }}>{r}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {active === "security" && (
              <div className="space-y-5 p-6 lg:p-8">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <Field label="Current password"><input type="password" defaultValue="password" className="w-full bg-transparent text-[14px] outline-none" /></Field>
                  <Field label="New password"><input type="password" placeholder="••••••••" className="w-full bg-transparent text-[14px] outline-none" /></Field>
                </div>
                <button className="tactile rounded-full bg-stone-900 px-5 py-2.5 text-[13px] font-extrabold text-white">Update password</button>
                <div className="flex items-center justify-between gap-4 rounded-2xl bg-stone-50 px-4 py-3.5" style={{ border: "1px solid rgba(0,0,0,0.05)" }}>
                  <div><div className="text-[14px] font-bold text-stone-900">Two-factor authentication</div><div className="text-[12.5px] font-medium text-stone-500">Add an extra layer of security</div></div>
                  <Toggle on onClick={() => {}} />
                </div>
                <div>
                  <div className="mb-2 text-[14px] font-bold text-stone-900">Active sessions</div>
                  <div className="space-y-1">
                    {[{ icon: Monitor, dev: "MacBook Pro · Amsterdam", meta: "This device · active now", cur: true }, { icon: Smartphone, dev: "iPhone 15 · Amsterdam", meta: "2 hours ago", cur: false }].map((s, i) => (
                      <div key={i} className="flex items-center gap-3 border-b border-stone-100 py-3 last:border-0">
                        <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-stone-100 text-stone-500"><s.icon className="h-[18px] w-[18px]" strokeWidth={2} /></span>
                        <div className="flex-1">
                          <div className="text-[13.5px] font-bold text-stone-900">{s.dev}</div>
                          <div className="text-[11.5px] font-medium text-stone-400">{s.meta}</div>
                        </div>
                        {s.cur ? <span className="beacon h-2 w-2 rounded-full bg-lime-500" /> : <button className="tactile text-[12px] font-extrabold text-rose-600 hover:underline">Revoke</button>}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-[12.5px] font-bold text-stone-600">{label}</span>
      <div className="rounded-2xl bg-stone-50 px-4 py-3 transition-colors focus-within:bg-white" style={{ border: "1px solid rgba(0,0,0,0.06)" }}>{children}</div>
    </label>
  );
}
