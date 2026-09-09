import { PASTEL, PastelKey, PRIORITY_TINT, Priority, Member, Presence } from "../data";

export function Tag({ label, tint }: { label: string; tint: PastelKey }) {
  const c = PASTEL[tint];
  return (
    <span
      className="inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-bold tracking-tight"
      style={{ background: c.bg, color: c.text, border: `1px solid ${c.border}` }}
    >
      {label}
    </span>
  );
}

export function PriorityBadge({ priority }: { priority: Priority }) {
  const c = PASTEL[PRIORITY_TINT[priority]];
  return (
    <span
      className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-bold"
      style={{ background: c.bg, color: c.text, border: `1px solid ${c.border}` }}
    >
      {priority === "Critical" && (
        <span
          className="beacon inline-block h-1.5 w-1.5 rounded-full"
          style={{ background: c.solid }}
        />
      )}
      {priority}
    </span>
  );
}

export function Avatar({
  member,
  size = 32,
  ring = true,
}: {
  member: Member;
  size?: number;
  ring?: boolean;
}) {
  const c = PASTEL[member.tint];
  const ringColor: Record<Presence, string> = {
    online: "#84cc16",
    busy: "#f59e0b",
    offline: "#a1a1aa",
  };
  return (
    <span className="relative inline-flex shrink-0" style={{ width: size, height: size }}>
      <span
        className="flex items-center justify-center rounded-full font-bold tnum"
        style={{
          width: size,
          height: size,
          background: c.bg,
          color: c.text,
          border: `1px solid ${c.border}`,
          fontSize: size * 0.38,
          boxShadow: "inset 0 1px 2px rgba(255,255,255,0.7)",
        }}
      >
        {member.initials}
      </span>
      {ring && (
        <span
          className={`absolute -bottom-0.5 -right-0.5 rounded-full border-2 border-white ${
            member.presence === "online" ? "beacon" : ""
          }`}
          style={{
            width: size * 0.34,
            height: size * 0.34,
            background: ringColor[member.presence],
          }}
        />
      )}
    </span>
  );
}

export function AvatarStack({ ids, memberById, max = 3 }: { ids: string[]; memberById: (id: string) => Member; max?: number }) {
  const shown = ids.slice(0, max);
  const extra = ids.length - shown.length;
  return (
    <div className="flex items-center">
      <div className="flex -space-x-2">
        {shown.map((id) => (
          <div key={id} className="rounded-full ring-2 ring-white">
            <Avatar member={memberById(id)} size={26} ring={false} />
          </div>
        ))}
      </div>
      {extra > 0 && (
        <span className="ml-1.5 text-[11px] font-bold text-stone-500 tnum">+{extra}</span>
      )}
    </div>
  );
}

export function ProgressBar({
  value,
  striped = "purple",
  height = 8,
}: {
  value: number;
  striped?: "purple" | "orange" | "green" | "sky";
  height?: number;
}) {
  return (
    <div
      className="w-full overflow-hidden rounded-full bg-stone-200/70"
      style={{ height }}
      role="progressbar"
      aria-valuenow={Math.round(value)}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <div
        className={`striped-bar-${striped} striped-anim h-full rounded-full transition-[width] duration-500`}
        style={{ width: `${value}%`, transitionTimingFunction: "cubic-bezier(0.16,1,0.3,1)" }}
      />
    </div>
  );
}

export function SegmentedControl<T extends string>({
  options,
  value,
  onChange,
  size = "md",
}: {
  options: { value: T; label: string }[];
  value: T;
  onChange: (v: T) => void;
  size?: "sm" | "md";
}) {
  const idx = options.findIndex((o) => o.value === value);
  const pad = size === "sm" ? "px-3 py-1.5 text-[12px]" : "px-4 py-2 text-[13px]";
  return (
    <div
      role="tablist"
      className="relative inline-flex rounded-full p-1"
      style={{ background: "#f1eee8", border: "1px solid rgba(0,0,0,0.05)" }}
    >
      <div
        className="absolute top-1 bottom-1 rounded-full bg-white transition-all duration-300"
        style={{
          width: `calc((100% - 8px) / ${options.length})`,
          left: `calc(4px + ${idx} * (100% - 8px) / ${options.length})`,
          transitionTimingFunction: "cubic-bezier(0.16,1,0.3,1)",
          boxShadow: "0 2px 6px -1px rgba(18,19,22,0.12), inset 0 0 0 1px rgba(0,0,0,0.04)",
        }}
      />
      {options.map((o) => (
        <button
          key={o.value}
          role="tab"
          aria-selected={o.value === value}
          onClick={() => onChange(o.value)}
          className={`tactile focus-ring relative z-10 rounded-full font-bold tracking-tight ${pad} ${
            o.value === value ? "text-stone-900" : "text-stone-500 hover:text-stone-700"
          }`}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}
