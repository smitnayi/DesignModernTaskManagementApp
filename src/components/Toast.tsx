import { Check, Info } from "lucide-react";

export function Toast({ toast }: { toast: { id: number; msg: string; tone: "ok" | "info" } | null }) {
  if (!toast) return null;
  const ok = toast.tone === "ok";
  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-6 z-[70] flex justify-center px-4">
      <div key={toast.id} className="toast-in dynamic-island flex items-center gap-2.5 rounded-full px-4 py-3 text-white">
        <span className="flex h-6 w-6 items-center justify-center rounded-full" style={{ background: ok ? "#84cc16" : "rgba(255,255,255,0.14)" }}>
          {ok ? <Check className="h-3.5 w-3.5 text-stone-900" strokeWidth={3} /> : <Info className="h-3.5 w-3.5 text-white" strokeWidth={2.4} />}
        </span>
        <span className="text-[13px] font-bold">{toast.msg}</span>
      </div>
    </div>
  );
}
