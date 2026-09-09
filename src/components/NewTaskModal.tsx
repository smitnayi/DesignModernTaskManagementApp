import { useEffect, useState } from "react";
import { X, Check } from "lucide-react";
import { PASTEL, PastelKey, Priority, Status, Task, members } from "../data";

const PRIORITIES: Priority[] = ["Low", "Medium", "High", "Critical"];
const STATUSES: { value: Status; label: string }[] = [
  { value: "todo", label: "To do" },
  { value: "in_progress", label: "In Progress" },
  { value: "in_review", label: "In Review" },
  { value: "done", label: "Done" },
];
const SPACES: { name: string; tint: PastelKey }[] = [
  { name: "Design Internal", tint: "lavender" },
  { name: "Commercial", tint: "peach" },
  { name: "Publications", tint: "rose" },
];

export function NewTaskModal({ open, onClose, onCreate, count }: {
  open: boolean;
  onClose: () => void;
  onCreate: (t: Task) => void;
  count: number;
}) {
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [priority, setPriority] = useState<Priority>("Medium");
  const [status, setStatus] = useState<Status>("todo");
  const [spaceIdx, setSpaceIdx] = useState(0);
  const [assignees, setAssignees] = useState<string[]>([]);
  const [due, setDue] = useState("");

  useEffect(() => {
    if (open) {
      setTitle(""); setDesc(""); setPriority("Medium"); setStatus("todo");
      setSpaceIdx(0); setAssignees([]); setDue("");
    }
  }, [open]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    if (open) window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  const space = SPACES[spaceIdx];

  const submit = () => {
    if (!title.trim()) return;
    const code = `MRD-${String(100 + count).padStart(3, "0")}`;
    onCreate({
      id: `t${Date.now()}`,
      code,
      title: title.trim(),
      description: desc.trim() || "No description yet.",
      status,
      priority,
      space: space.name,
      spaceTint: space.tint,
      tags: [{ label: space.name.split(" ")[0], tint: space.tint }],
      assignees: assignees.length ? assignees : [members[0].id],
      subtasks: [],
      due: due.trim() || "No due date",
      dueOffsetDays: 7,
      updatedOffsetDays: 0,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[55] flex items-center justify-center p-4">
      <div className="overlay-in absolute inset-0 bg-stone-900/40 backdrop-blur-[3px]" onClick={onClose} />
      <div className="palette-in relative flex max-h-[88vh] w-full max-w-[520px] flex-col overflow-hidden rounded-[28px] bg-white" role="dialog" aria-modal="true" aria-label="Create task" style={{ border: "1px solid rgba(0,0,0,0.07)", boxShadow: "0 40px 80px -20px rgba(18,19,22,0.3)" }}>
        <div className="flex items-center justify-between border-b border-stone-100 px-6 py-4">
          <h2 className="text-[17px] font-extrabold tracking-tight text-stone-900">New <span className="font-serif-italic font-normal text-violet-700">task</span></h2>
          <button onClick={onClose} className="tactile flex h-9 w-9 items-center justify-center rounded-full hover:bg-stone-100" aria-label="Close"><X className="h-[17px] w-[17px] text-stone-500" strokeWidth={2} /></button>
        </div>

        <div className="flex-1 space-y-5 overflow-y-auto px-6 py-5">
          <div>
            <input
              autoFocus
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && submit()}
              placeholder="Task title…"
              className="w-full bg-transparent text-[20px] font-extrabold tracking-tight text-stone-900 outline-none placeholder:text-stone-300"
            />
          </div>
          <textarea
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
            placeholder="Add a description…"
            rows={2}
            className="w-full resize-none rounded-2xl bg-stone-50 px-4 py-3 text-[14px] font-medium text-stone-700 outline-none placeholder:text-stone-400"
            style={{ border: "1px solid rgba(0,0,0,0.05)" }}
          />

          <Group label="Status">
            <div className="flex flex-wrap gap-1.5">
              {STATUSES.map((s) => {
                const on = status === s.value;
                return <Chip key={s.value} on={on} onClick={() => setStatus(s.value)}>{s.label}</Chip>;
              })}
            </div>
          </Group>

          <Group label="Priority">
            <div className="flex flex-wrap gap-1.5">
              {PRIORITIES.map((p) => {
                const c = PASTEL[p === "Critical" ? "rose" : p === "High" ? "peach" : p === "Medium" ? "sky" : "stone"];
                const on = priority === p;
                return (
                  <button key={p} onClick={() => setPriority(p)} className="tactile rounded-full px-3 py-1.5 text-[12px] font-bold" style={on ? { background: c.bg, color: c.text, border: `1px solid ${c.border}` } : { background: "#fff", color: "#78716c", border: "1px solid rgba(0,0,0,0.08)" }}>{p}</button>
                );
              })}
            </div>
          </Group>

          <Group label="Space">
            <div className="flex flex-wrap gap-1.5">
              {SPACES.map((s, i) => {
                const c = PASTEL[s.tint];
                const on = spaceIdx === i;
                return <button key={s.name} onClick={() => setSpaceIdx(i)} className="tactile rounded-full px-3 py-1.5 text-[12px] font-bold" style={on ? { background: c.bg, color: c.text, border: `1px solid ${c.border}` } : { background: "#fff", color: "#78716c", border: "1px solid rgba(0,0,0,0.08)" }}>{s.name}</button>;
              })}
            </div>
          </Group>

          <Group label="Assignees">
            <div className="flex flex-wrap gap-2">
              {members.map((m) => {
                const c = PASTEL[m.tint];
                const on = assignees.includes(m.id);
                return (
                  <button
                    key={m.id}
                    onClick={() => setAssignees((prev) => on ? prev.filter((x) => x !== m.id) : [...prev, m.id])}
                    className="tactile flex items-center gap-1.5 rounded-full py-1 pl-1 pr-3 text-[12px] font-bold"
                    style={{ background: on ? c.bg : "#fff", color: on ? c.text : "#78716c", border: `1px solid ${on ? c.border : "rgba(0,0,0,0.08)"}` }}
                  >
                    <span className="flex h-6 w-6 items-center justify-center rounded-full text-[9px] font-extrabold text-white" style={{ background: c.solid }}>{m.initials}</span>
                    {m.name.split(" ")[0]}
                    {on && <Check className="h-3 w-3" strokeWidth={3} />}
                  </button>
                );
              })}
            </div>
          </Group>

          <Group label="Due date">
            <input value={due} onChange={(e) => setDue(e.target.value)} placeholder="e.g. Today, In 2 days, Tomorrow" className="w-full rounded-2xl bg-stone-50 px-4 py-2.5 text-[13.5px] font-medium text-stone-700 outline-none placeholder:text-stone-400" style={{ border: "1px solid rgba(0,0,0,0.05)" }} />
          </Group>
        </div>

        <div className="flex items-center justify-end gap-2 border-t border-stone-100 px-6 py-4">
          <button onClick={onClose} className="tactile rounded-full px-4 py-2.5 text-[13px] font-bold text-stone-600 hover:bg-stone-100">Cancel</button>
          <button onClick={submit} disabled={!title.trim()} className="tactile rounded-full bg-stone-900 px-5 py-2.5 text-[13px] font-extrabold text-white disabled:opacity-40">Create task</button>
        </div>
      </div>
    </div>
  );
}

function Group({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="tech-badge mb-2 text-[9px] text-stone-400">{label}</div>
      {children}
    </div>
  );
}

function Chip({ on, onClick, children }: { on: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button onClick={onClick} className="tactile rounded-full px-3 py-1.5 text-[12px] font-bold" style={on ? { background: "#111318", color: "#fff", border: "1px solid #111318" } : { background: "#fff", color: "#78716c", border: "1px solid rgba(0,0,0,0.08)" }}>{children}</button>
  );
}
