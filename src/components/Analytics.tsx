import { useState, useEffect } from "react";
import { ArrowUpRight, ArrowDownRight, Flame, Timer, Gauge, OctagonAlert } from "lucide-react";
import { PASTEL, PastelKey, members } from "../data";
import { SegmentedControl } from "./primitives";

const BURNDOWN = [
  { d: "W1", ideal: 100, actual: 100 },
  { d: "W2", ideal: 83, actual: 88 },
  { d: "W3", ideal: 66, actual: 71 },
  { d: "W4", ideal: 50, actual: 52 },
  { d: "W5", ideal: 33, actual: 30 },
  { d: "W6", ideal: 16, actual: 14 },
  { d: "W7", ideal: 0, actual: 4 },
];

const VELOCITY = [32, 38, 29, 44, 41, 48, 42, 51];
const DIST = [
  { label: "Design", v: 34, tint: "lavender" as PastelKey },
  { label: "Dev", v: 41, tint: "sky" as PastelKey },
  { label: "QA", v: 15, tint: "mint" as PastelKey },
  { label: "Research", v: 10, tint: "peach" as PastelKey },
];

// 7 cols (days) x 5 rows (weeks) of activity intensity 0-4
const HEAT = [
  [1, 2, 0, 3, 2, 1, 0],
  [2, 3, 4, 2, 3, 1, 0],
  [0, 1, 2, 4, 3, 2, 1],
  [1, 4, 3, 2, 4, 2, 0],
  [2, 3, 4, 3, 4, 1, 0],
];
const HEAT_TINTS = ["#f1efe9", "#dcedc8", "#bef264", "#a3e635", "#84cc16"];
const DOW = ["M", "T", "W", "T", "F", "S", "S"];

function Sparkline({ data, color }: { data: number[]; color: string }) {
  const w = 96, h = 30;
  const min = Math.min(...data), max = Math.max(...data);
  const x = (i: number) => (i / (data.length - 1)) * w;
  const y = (v: number) => h - ((v - min) / (max - min || 1)) * (h - 4) - 2;
  const line = data.map((v, i) => `${i === 0 ? "M" : "L"}${x(i)},${y(v)}`).join(" ");
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="h-8 w-24" preserveAspectRatio="none">
      <path d={`${line} L${w},${h} L0,${h} Z`} fill={color} fillOpacity="0.1" />
      <path d={line} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx={x(data.length - 1)} cy={y(data[data.length - 1])} r="2.5" fill={color} />
    </svg>
  );
}

function StatTile({ icon: Icon, label, value, delta, up, tint, spark }: { icon: any; label: string; value: string; delta: string; up: boolean; tint: PastelKey; spark: number[] }) {
  const c = PASTEL[tint];
  return (
    <div className="bento-card bento-card-interactive p-5">
      <div className="flex items-center justify-between">
        <span className="flex h-9 w-9 items-center justify-center rounded-xl" style={{ background: c.bg, color: c.text, border: `1px solid ${c.border}` }}>
          <Icon className="h-[18px] w-[18px]" strokeWidth={2.2} />
        </span>
        <span className="tnum inline-flex items-center gap-0.5 rounded-full px-2 py-0.5 text-[11px] font-extrabold" style={{ background: up ? PASTEL.lime.bg : PASTEL.rose.bg, color: up ? PASTEL.lime.text : PASTEL.rose.text }}>
          {up ? <ArrowUpRight className="h-3 w-3" strokeWidth={2.6} /> : <ArrowDownRight className="h-3 w-3" strokeWidth={2.6} />}{delta}
        </span>
      </div>
      <div className="mt-3 text-[12.5px] font-bold text-stone-500">{label}</div>
      <div className="mt-0.5 flex items-end justify-between gap-2">
        <div className="tnum text-[30px] font-extrabold leading-none tracking-tight text-stone-900">{value}</div>
        <Sparkline data={spark} color={c.solid} />
      </div>
    </div>
  );
}

function LineChart() {
  const w = 620, h = 210, pad = 12;
  const [hover, setHover] = useState<number | null>(null);
  const x = (i: number) => pad + (i / (BURNDOWN.length - 1)) * (w - pad * 2);
  const y = (v: number) => pad + (1 - v / 100) * (h - pad * 2);
  const path = (key: "ideal" | "actual") => BURNDOWN.map((p, i) => `${i === 0 ? "M" : "L"}${x(i)},${y(p[key])}`).join(" ");
  const area = `${path("actual")} L${x(BURNDOWN.length - 1)},${h - pad} L${x(0)},${h - pad} Z`;
  const hp = hover !== null ? BURNDOWN[hover] : null;
  return (
    <div className="relative">
      <svg viewBox={`0 0 ${w} ${h}`} className="h-56 w-full">
        <defs>
          <linearGradient id="burnfill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#a855f7" stopOpacity="0.16" />
            <stop offset="100%" stopColor="#a855f7" stopOpacity="0" />
          </linearGradient>
        </defs>
        {[0, 25, 50, 75, 100].map((g) => (
          <g key={g}>
            <line x1={pad} x2={w - pad} y1={y(g)} y2={y(g)} stroke="rgba(0,0,0,0.05)" strokeWidth="1" />
            <text x={0} y={y(g) - 3} className="tnum" fontSize="9" fontWeight="700" fill="#a8a29e">{g}</text>
          </g>
        ))}
        <path d={area} fill="url(#burnfill)" />
        <path d={path("ideal")} fill="none" stroke="#d6d3d1" strokeWidth="2" strokeDasharray="5 5" strokeLinecap="round" />
        <path d={path("actual")} fill="none" stroke="#a855f7" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
        {hover !== null && <line x1={x(hover)} x2={x(hover)} y1={pad} y2={h - pad} stroke="#a855f7" strokeWidth="1.5" strokeDasharray="3 3" opacity="0.5" />}
        {BURNDOWN.map((p, i) => (
          <circle key={i} cx={x(i)} cy={y(p.actual)} r={hover === i ? 6 : 4} fill="#fff" stroke="#a855f7" strokeWidth="2.5" className="transition-all" />
        ))}
        {BURNDOWN.map((_, i) => (
          <rect key={i} x={x(i) - (w / BURNDOWN.length) / 2} y={0} width={w / BURNDOWN.length} height={h} fill="transparent" onMouseEnter={() => setHover(i)} onMouseLeave={() => setHover(null)} />
        ))}
      </svg>
      {hp && (
        <div className="pointer-events-none absolute -translate-x-1/2 rounded-xl bg-stone-900 px-2.5 py-1.5 text-white shadow-lg" style={{ left: `${(x(hover!) / w) * 100}%`, top: 0 }}>
          <div className="tech-badge text-[8px] text-lime-400">{hp.d}</div>
          <div className="tnum text-[12px] font-extrabold">{hp.actual} pts left</div>
        </div>
      )}
    </div>
  );
}

function Donut() {
  const total = DIST.reduce((s, d) => s + d.v, 0);
  const [active, setActive] = useState<number | null>(null);
  const [mounted, setMounted] = useState(false);
  useEffect(() => { const t = setTimeout(() => setMounted(true), 40); return () => clearTimeout(t); }, []);

  const size = 168, R = 66, SW = 20, C = 2 * Math.PI * R, GAP = 0.02; // gap as fraction
  let cursor = 0;
  const segs = DIST.map((d, i) => {
    const frac = d.v / total;
    const dash = Math.max(frac - GAP, 0.001) * C;
    const rot = cursor * 360 - 90;
    cursor += frac;
    return { d, i, dash, rot };
  });
  const sel = active !== null ? DIST[active] : null;
  const selPct = sel ? Math.round((sel.v / total) * 100) : 100;

  return (
    <div className="flex flex-col items-center gap-6 sm:flex-row">
      <div className="relative shrink-0" style={{ width: size, height: size }} onMouseLeave={() => setActive(null)}>
        <svg viewBox={`0 0 ${size} ${size}`} className="h-full w-full">
          {/* track */}
          <circle cx={size / 2} cy={size / 2} r={R} fill="none" stroke="#f4f0e6" strokeWidth={SW} />
          {segs.map(({ d, i, dash, rot }) => {
            const on = active === i;
            const dim = active !== null && !on;
            return (
              <circle
                key={d.label}
                className="donut-seg cursor-pointer"
                cx={size / 2}
                cy={size / 2}
                r={R}
                fill="none"
                stroke={PASTEL[d.tint].solid}
                strokeWidth={on ? SW + 7 : SW}
                strokeLinecap="round"
                strokeDasharray={`${dash} ${C}`}
                strokeDashoffset={mounted ? 0 : C}
                opacity={dim ? 0.28 : 1}
                transform={`rotate(${rot} ${size / 2} ${size / 2})`}
                style={{ ["--dash-len" as any]: `${C}px`, ["--dash-to" as any]: "0px", animationDelay: `${i * 120}ms`, filter: on ? "drop-shadow(0 4px 10px rgba(0,0,0,0.14))" : "none" }}
                onMouseEnter={() => setActive(i)}
              />
            );
          })}
        </svg>
        {/* center readout */}
        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center text-center">
          <div key={active ?? "all"} className="count-pop">
            <div className="tnum text-[34px] font-extrabold leading-none tracking-tight" style={{ color: sel ? PASTEL[sel.tint].solid : "#1c1917" }}>{selPct}%</div>
            <div className="tech-badge mt-1 text-[9px] text-stone-400">{sel ? sel.label : "Total tasks"}</div>
            {sel && <div className="tnum mt-0.5 text-[11px] font-bold text-stone-500">{sel.v} of {total}</div>}
          </div>
        </div>
      </div>

      <div className="w-full flex-1 space-y-1.5">
        {DIST.map((d, i) => {
          const on = active === i;
          const pct = Math.round((d.v / total) * 100);
          return (
            <button
              key={d.label}
              onMouseEnter={() => setActive(i)}
              onMouseLeave={() => setActive(null)}
              className="tactile flex w-full items-center gap-3 rounded-xl px-2.5 py-2 text-left transition-colors"
              style={{ background: on ? PASTEL[d.tint].bg : "transparent" }}
            >
              <span className="h-3 w-3 shrink-0 rounded-full transition-transform" style={{ background: PASTEL[d.tint].solid, transform: on ? "scale(1.35)" : "scale(1)" }} />
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between">
                  <span className="text-[12.5px] font-bold text-stone-700">{d.label}</span>
                  <span className="tnum text-[12.5px] font-extrabold" style={{ color: on ? PASTEL[d.tint].text : "#1c1917" }}>{pct}%</span>
                </div>
                <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-stone-100">
                  <div className="h-full rounded-full transition-all duration-500" style={{ width: `${pct}%`, background: PASTEL[d.tint].solid, opacity: active === null || on ? 1 : 0.35 }} />
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

export function Analytics() {
  const [range, setRange] = useState<"7d" | "30d" | "90d">("30d");
  const maxVel = Math.max(...VELOCITY);

  return (
    <div className="rise-in px-5 pb-16 lg:px-8">
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-[32px] font-extrabold leading-none tracking-tight text-stone-900">Sprint <span className="font-serif-italic font-normal text-violet-700">telemetry</span></h1>
          <p className="mt-1.5 text-[13.5px] font-medium text-stone-500">Velocity, burndown & throughput across the org.</p>
        </div>
        <SegmentedControl value={range} onChange={setRange} options={[{ value: "7d", label: "7 days" }, { value: "30d", label: "30 days" }, { value: "90d", label: "90 days" }]} />
      </div>

      <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
        <StatTile icon={Gauge} label="Velocity" value="42" delta="+8.2%" up tint="lime" spark={[32, 38, 29, 44, 41, 48, 42]} />
        <StatTile icon={Timer} label="Avg cycle time" value="2.4d" delta="-12%" up tint="mint" spark={[3.2, 3.0, 2.9, 2.7, 2.6, 2.5, 2.4]} />
        <StatTile icon={Flame} label="Throughput" value="137" delta="+20%" up tint="lavender" spark={[98, 104, 112, 118, 124, 130, 137]} />
        <StatTile icon={OctagonAlert} label="Blocked" value="6" delta="+2" up={false} tint="rose" spark={[2, 3, 3, 4, 5, 4, 6]} />
      </div>

      <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="bento-card p-6 lg:col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="text-[17px] font-extrabold tracking-tight text-stone-900">Sprint <span className="font-serif-italic font-normal text-stone-500">burndown</span></h2>
              <p className="mt-0.5 text-[12px] font-medium text-stone-400">4 pts ahead of ideal · on track to close early</p>
            </div>
            <div className="flex items-center gap-4 text-[11.5px] font-bold">
              <span className="flex items-center gap-1.5 text-stone-500"><span className="h-2.5 w-4 rounded-full" style={{ background: "#a855f7" }} />Actual</span>
              <span className="flex items-center gap-1.5 text-stone-400"><span className="h-2.5 w-4 rounded-full border-b-2 border-dashed border-stone-300" />Ideal</span>
            </div>
          </div>
          <LineChart />
          <div className="mt-1 flex justify-between px-2 text-[10px] font-bold text-stone-400">{BURNDOWN.map((p) => <span key={p.d}>{p.d}</span>)}</div>
        </div>

        <div className="bento-card p-6">
          <h2 className="mb-4 text-[17px] font-extrabold tracking-tight text-stone-900">Work distribution</h2>
          <Donut />
        </div>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="bento-card p-6 lg:col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-[17px] font-extrabold tracking-tight text-stone-900">Weekly <span className="font-serif-italic font-normal text-stone-500">velocity</span></h2>
            <span className="tnum text-[12px] font-bold text-stone-400">avg {Math.round(VELOCITY.reduce((a, b) => a + b, 0) / VELOCITY.length)} pts</span>
          </div>
          <div className="flex h-44 items-end gap-3">
            {VELOCITY.map((v, i) => {
              const last = i === VELOCITY.length - 1;
              return (
                <div key={i} className="group flex flex-1 flex-col items-center gap-2">
                  <span className="tnum text-[11px] font-extrabold text-stone-500 opacity-0 transition-opacity group-hover:opacity-100">{v}</span>
                  <div className="flex w-full flex-1 items-end">
                    <div className="bar-grow w-full rounded-lg transition-colors group-hover:brightness-95" style={{ height: `${(v / maxVel) * 100}%`, background: last ? "#84cc16" : "#e7e5e4", animationDelay: `${i * 50}ms` }} />
                  </div>
                  <span className="tnum text-[10px] font-bold text-stone-400">S{i + 1}</span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="bento-card p-6">
          <h2 className="mb-1 text-[17px] font-extrabold tracking-tight text-stone-900">Activity map</h2>
          <p className="mb-4 text-[12px] font-medium text-stone-400">Commits & completions, last 5 weeks</p>
          <div className="flex flex-col items-center gap-1.5">
            <div className="flex gap-1.5 pl-5">
              {DOW.map((d, i) => <span key={i} className="w-6 text-center text-[9px] font-bold text-stone-300">{d}</span>)}
            </div>
            {HEAT.map((week, wi) => (
              <div key={wi} className="flex items-center gap-1.5">
                <span className="w-3.5 text-[8px] font-bold text-stone-300">{5 - wi}w</span>
                {week.map((lvl, di) => (
                  <span key={di} className="h-6 w-6 rounded-md transition-transform hover:scale-110" style={{ background: HEAT_TINTS[lvl] }} title={`${lvl * 3} actions`} />
                ))}
              </div>
            ))}
            <div className="mt-2 flex items-center gap-1.5 self-end text-[9px] font-bold text-stone-400">
              Less {HEAT_TINTS.map((c) => <span key={c} className="h-3 w-3 rounded-sm" style={{ background: c }} />)} More
            </div>
          </div>
        </div>
      </div>

      <div className="mt-4 bento-card p-6">
        <h2 className="mb-4 text-[17px] font-extrabold tracking-tight text-stone-900">Top <span className="font-serif-italic font-normal text-stone-500">contributors</span></h2>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {members.slice(0, 4).map((m, i) => {
            const max = members[0].tasks;
            return (
              <div key={m.id} className="flex items-center gap-3 rounded-2xl bg-stone-50 p-3" style={{ border: "1px solid rgba(0,0,0,0.04)" }}>
                <span className="tnum flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[11px] font-extrabold" style={{ background: i === 0 ? PASTEL.gold.bg : "#fff", color: i === 0 ? PASTEL.gold.text : "#a8a29e", border: "1px solid rgba(0,0,0,0.06)" }}>{i + 1}</span>
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-[11px] font-extrabold text-white" style={{ background: PASTEL[m.tint].solid }}>{m.initials}</span>
                <div className="min-w-0 flex-1">
                  <div className="truncate text-[13px] font-bold text-stone-800">{m.name}</div>
                  <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-stone-200">
                    <div className="h-full rounded-full" style={{ width: `${(m.tasks / max) * 100}%`, background: PASTEL[m.tint].solid }} />
                  </div>
                </div>
                <span className="tnum text-[15px] font-extrabold text-stone-900">{m.tasks}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
