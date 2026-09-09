import { useState } from "react";
import { PASTEL, PastelKey, weeklyHours } from "../data";

export function MetricBars({ tint, highlight = 4 }: { tint: PastelKey; highlight?: number }) {
  const [hover, setHover] = useState<number | null>(null);
  const c = PASTEL[tint];
  const max = Math.max(...weeklyHours.map((d) => d.v));
  return (
    <div className="flex h-16 items-end gap-1.5">
      {weeklyHours.map((d, i) => {
        const active = hover === i || (hover === null && i === highlight);
        return (
          <div
            key={d.day}
            className="group relative flex flex-1 flex-col items-center gap-1"
            onMouseEnter={() => setHover(i)}
            onMouseLeave={() => setHover(null)}
          >
            {active && (
              <div className="tnum absolute -top-6 z-10 rounded-md bg-stone-900 px-1.5 py-0.5 text-[10px] font-bold text-white">
                {d.v}h
              </div>
            )}
            <div className="flex h-12 w-full items-end">
              <div
                className="bar-grow w-full rounded-md transition-colors duration-200"
                style={{
                  height: `${(d.v / max) * 100}%`,
                  background: active ? c.solid : c.border,
                  animationDelay: `${i * 45}ms`,
                }}
              />
            </div>
            <span className="text-[9px] font-bold text-stone-400">{d.day[0]}</span>
          </div>
        );
      })}
    </div>
  );
}
