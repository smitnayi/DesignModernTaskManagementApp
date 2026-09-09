import { useState } from "react";
import { ArrowRight, Zap } from "lucide-react";

function GoogleMark() {
  return (
    <svg className="h-4 w-4" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1Z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.15-4.53H2.18v2.84A11 11 0 0 0 12 23Z"/><path fill="#FBBC05" d="M5.85 14.1a6.6 6.6 0 0 1 0-4.2V7.06H2.18a11 11 0 0 0 0 9.88l3.67-2.84Z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1A11 11 0 0 0 2.18 7.06l3.67 2.84C6.71 7.31 9.14 5.38 12 5.38Z"/></svg>
  );
}
function GithubMark() {
  return <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor"><path d="M12 1a11 11 0 0 0-3.48 21.44c.55.1.75-.24.75-.53v-1.85c-3.06.67-3.71-1.47-3.71-1.47-.5-1.28-1.23-1.62-1.23-1.62-1-.69.08-.67.08-.67 1.11.08 1.69 1.14 1.69 1.14.98 1.69 2.58 1.2 3.21.92.1-.71.39-1.2.7-1.47-2.44-.28-5.01-1.22-5.01-5.44 0-1.2.43-2.18 1.14-2.95-.11-.28-.5-1.4.11-2.92 0 0 .93-.3 3.05 1.13a10.6 10.6 0 0 1 5.56 0c2.12-1.43 3.05-1.13 3.05-1.13.61 1.52.22 2.64.11 2.92.71.77 1.14 1.75 1.14 2.95 0 4.23-2.58 5.16-5.03 5.43.4.34.75 1.01.75 2.04v3.02c0 .3.2.64.76.53A11 11 0 0 0 12 1Z"/></svg>;
}

export function Login({ onLogin }: { onLogin: () => void }) {
  const [mode, setMode] = useState<"login" | "signup">("login");

  return (
    <div className="flex h-full" style={{ background: "var(--color-canvas)" }}>
      {/* Form panel */}
      <div className="flex w-full flex-col justify-center px-6 py-10 sm:px-16 lg:w-[46%] lg:px-20">
        <div className="mx-auto w-full max-w-sm">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-stone-900 text-white"><span className="font-serif-italic text-xl leading-none">M</span></div>
            <div className="leading-tight"><div className="text-[15px] font-extrabold tracking-tight text-stone-900">Meridian</div><div className="tech-badge text-[9px] text-stone-500">Clarity Pro</div></div>
          </div>

          <h1 className="mt-10 text-[34px] font-extrabold leading-tight tracking-tight text-stone-900">
            {mode === "login" ? <>Welcome <span className="font-serif-italic font-normal text-violet-700">back</span></> : <>Build something <span className="font-serif-italic font-normal text-violet-700">iconic</span></>}
          </h1>
          <p className="mt-2 text-[14px] font-medium text-stone-500">
            {mode === "login" ? "Sign in to your workspace to keep the sprint moving." : "Create your account and orchestrate work beautifully."}
          </p>

          <div className="mt-7 flex gap-3">
            <button className="tactile flex flex-1 items-center justify-center gap-2 rounded-2xl bg-white py-3 text-[13.5px] font-bold text-stone-800" style={{ border: "1px solid rgba(0,0,0,0.08)" }}><GoogleMark />Google</button>
            <button className="tactile flex flex-1 items-center justify-center gap-2 rounded-2xl bg-white py-3 text-[13.5px] font-bold text-stone-800" style={{ border: "1px solid rgba(0,0,0,0.08)" }}><GithubMark />GitHub</button>
          </div>

          <div className="my-6 flex items-center gap-3 text-[11px] font-bold text-stone-400"><span className="h-px flex-1 bg-stone-200" />OR<span className="h-px flex-1 bg-stone-200" /></div>

          <form onSubmit={(e) => { e.preventDefault(); onLogin(); }} className="space-y-3">
            {mode === "signup" && <Input label="Full name" placeholder="Kacie Velasquez" />}
            <Input label="Email" type="email" placeholder="you@studio.com" defaultValue="kacie@meridian.design" />
            <Input label="Password" type="password" placeholder="••••••••" defaultValue="password" />
            <button type="submit" className="tactile flex w-full items-center justify-center gap-2 rounded-2xl bg-stone-900 py-3.5 text-[14px] font-extrabold text-white" style={{ boxShadow: "0 10px 24px -8px rgba(0,0,0,0.4)" }}>
              {mode === "login" ? "Sign in" : "Create account"}<ArrowRight className="h-4 w-4" strokeWidth={2.4} />
            </button>
          </form>

          <p className="mt-6 text-center text-[13px] font-medium text-stone-500">
            {mode === "login" ? "New to Meridian? " : "Already have an account? "}
            <button onClick={() => setMode(mode === "login" ? "signup" : "login")} className="font-extrabold text-violet-700 hover:underline">
              {mode === "login" ? "Create an account" : "Sign in"}
            </button>
          </p>
        </div>
      </div>

      {/* Obsidian showcase panel */}
      <div className="relative hidden overflow-hidden lg:block lg:w-[54%]">
        <div className="absolute inset-4 rounded-[32px]" style={{ background: "#111318" }} />
        <div className="absolute inset-4 overflow-hidden rounded-[32px]">
          <div className="absolute -right-20 -top-20 h-80 w-80 rounded-full opacity-40 blur-3xl" style={{ background: "#a855f7" }} />
          <div className="absolute -bottom-24 -left-10 h-80 w-80 rounded-full opacity-30 blur-3xl" style={{ background: "#84cc16" }} />
          <div className="relative flex h-full flex-col justify-between p-12">
            <div className="inline-flex w-fit items-center gap-2 rounded-full bg-white/10 px-3.5 py-1.5 text-[12px] font-bold text-white"><Zap className="h-3.5 w-3.5 text-lime-400" fill="#a3e635" strokeWidth={2} />Sprint 24 · live</div>
            <div>
              <div className="font-serif-italic text-[44px] leading-[1.1] text-white">Where <span className="text-lime-400">exceptional</span> teams build <span className="text-violet-400">iconic</span> products.</div>
              <p className="mt-4 max-w-md text-[15px] font-medium text-white/60">The haute-horlogerie of project orchestration. Tactile, editorial, and fast — the operating system your team will actually love.</p>
            </div>
            <div className="grid grid-cols-3 gap-4">
              {[["+35%", "faster turnaround"], ["<45ms", "interaction latency"], ["4.9/5", "team satisfaction"]].map(([v, l]) => (
                <div key={l}><div className="tnum text-[26px] font-extrabold text-white">{v}</div><div className="text-[11.5px] font-medium text-white/50">{l}</div></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Input({ label, ...props }: { label: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-[12.5px] font-bold text-stone-600">{label}</span>
      <input {...props} className="focus-ring w-full rounded-2xl bg-white px-4 py-3 text-[14px] font-medium text-stone-800 outline-none transition-shadow placeholder:text-stone-400" style={{ border: "1px solid rgba(0,0,0,0.08)" }} />
    </label>
  );
}
