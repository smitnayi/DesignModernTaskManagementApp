import { useState } from "react";
import { Plus, MoreHorizontal, Check } from "lucide-react";
import { PASTEL, Task, Status, STATUS_META, memberById } from "../data";
import { Tag, PriorityBadge, AvatarStack, SegmentedControl } from "./primitives";
import { ImageWithFallback } from "./figma/ImageWithFallback";

const COLUMNS: Status[] = ["todo", "in_progress", "in_review", "done"];

function Card({ task, onOpen, onDragStart, dragging }: {
  task: Task; onOpen: () => void; onDragStart: () => void; dragging: boolean;
}) {
  const done = task.subtasks.filter((s) => s.done).length;
  const total = task.subtasks.length;
  return (
    <div
      draggable
      onDragStart={onDragStart}
      onClick={onOpen}
      className={`bento-card bento-card-interactive cursor-pointer p-3.5 ${dragging ? "card-dragging" : ""}`}
    >
      <div className="flex items-center justify-between">
        <span className="tech-badge rounded-md bg-stone-100 px-1.5 py-0.5 text-[10px] text-stone-500">{task.code}</span>
        <PriorityBadge priority={task.priority} />
      </div>
      <h3 className="mt-2.5 line-clamp-2 text-[14px] font-bold leading-snug tracking-tight text-stone-900">{task.title}</h3>

      {task.mockup && (
        <div className="mt-3 overflow-hidden rounded-xl bg-stone-100" style={{ aspectRatio: "16/9", border: "1px solid rgba(0,0,0,0.05)" }}>
          <ImageWithFallback src={task.mockup} alt={`${task.code} mockup preview`} className="h-full w-full object-cover" />
        </div>
      )}

      {total > 0 && (
        <div className="mt-3">
          <div className="mb-1 flex items-center justify-between text-[11px] font-bold text-stone-500">
            <span>Subtasks</span>
            <span className="tnum">{done}/{total}</span>
          </div>
          <div className="flex gap-1">
            {task.subtasks.map((s) => (
              <div key={s.id} className="h-1.5 flex-1 rounded-full" style={{ background: s.done ? "#84cc16" : "#e7e5e4" }} />
            ))}
          </div>
        </div>
      )}

      <div className="mt-3 flex items-center justify-between">
        <div className="flex flex-wrap gap-1">
          {task.tags.map((t) => <Tag key={t.label} label={t.label} tint={t.tint} />)}
        </div>
        <AvatarStack ids={task.assignees} memberById={memberById} />
      </div>
    </div>
  );
}

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
// deterministic-ish bar placement derived from task index
function TimelineView({ tasks, onOpenTask }: { tasks: Task[]; onOpenTask: (t: Task) => void }) {
  return (
    <div className="bento-card overflow-x-auto p-6">
      <div className="min-w-[720px]">
        <div className="mb-3 grid grid-cols-[200px_repeat(7,1fr)] gap-2 border-b border-stone-100 pb-2">
          <span className="tech-badge text-[10px] text-stone-400">Task</span>
          {DAYS.map((d) => <span key={d} className="tech-badge text-center text-[10px] text-stone-400">{d}</span>)}
        </div>
        <div className="space-y-2">
          {tasks.map((t, i) => {
            const meta = STATUS_META[t.status];
            const c = PASTEL[meta.tint];
            const start = i % 5;
            const span = 2 + (i % 3);
            const pct = t.subtasks.length ? Math.round((t.subtasks.filter((s) => s.done).length / t.subtasks.length) * 100) : 0;
            return (
              <div key={t.id} className="grid grid-cols-[200px_repeat(7,1fr)] items-center gap-2">
                <button onClick={() => onOpenTask(t)} className="tactile flex items-center gap-2 truncate text-left">
                  <span className="tech-badge text-[9px] text-stone-400">{t.code}</span>
                  <span className="truncate text-[12.5px] font-bold text-stone-800">{t.title}</span>
                </button>
                <div className="col-span-7 grid grid-cols-7 gap-2">
                  {DAYS.map((_, day) => {
                    const inBar = day >= start && day < start + span;
                    const isStart = day === start;
                    if (!inBar) return <div key={day} className="h-7 rounded-lg bg-stone-50" />;
                    return (
                      <button key={day} onClick={() => onOpenTask(t)} className="tactile relative h-7 overflow-hidden rounded-lg" style={{ background: c.bg, border: `1px solid ${c.border}` }}>
                        <span className="absolute inset-y-0 left-0 opacity-60" style={{ width: `${pct}%`, background: c.solid }} />
                        {isStart && <span className="tnum relative z-10 pl-1.5 text-[9px] font-extrabold leading-7" style={{ color: c.text }}>{pct}%</span>}
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function BoardAnalytics({ tasks }: { tasks: Task[] }) {
  const cols = COLUMNS.map((c) => ({ status: c, count: tasks.filter((t) => t.status === c).length }));
  const total = tasks.length;
  const prio = (["Critical", "High", "Medium", "Low"] as const).map((p) => ({ p, count: tasks.filter((t) => t.priority === p).length }));
  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
      <div className="bento-card p-6">
        <h2 className="mb-4 text-[17px] font-extrabold tracking-tight text-stone-900">Pipeline distribution</h2>
        <div className="space-y-4">
          {cols.map(({ status, count }) => {
            const meta = STATUS_META[status];
            const c = PASTEL[meta.tint];
            return (
              <div key={status}>
                <div className="mb-1.5 flex items-center justify-between text-[12.5px] font-bold">
                  <span className="text-stone-700">{meta.label}</span>
                  <span className="tnum text-stone-500">{count} · {total ? Math.round((count / total) * 100) : 0}%</span>
                </div>
                <div className="h-3 w-full overflow-hidden rounded-full bg-stone-100"><div className="h-full rounded-full transition-[width] duration-500" style={{ width: `${total ? (count / total) * 100 : 0}%`, background: c.solid }} /></div>
              </div>
            );
          })}
        </div>
      </div>
      <div className="bento-card p-6">
        <h2 className="mb-4 text-[17px] font-extrabold tracking-tight text-stone-900">Priority mix</h2>
        <div className="space-y-4">
          {prio.map(({ p, count }) => (
            <div key={p} className="flex items-center gap-3">
              <span className="w-20"><PriorityBadge priority={p} /></span>
              <div className="h-3 flex-1 overflow-hidden rounded-full bg-stone-100"><div className="h-full rounded-full" style={{ width: `${total ? (count / total) * 100 : 0}%`, background: PASTEL[p === "Critical" ? "rose" : p === "High" ? "peach" : p === "Medium" ? "sky" : "stone"].solid }} /></div>
              <span className="tnum w-6 text-right text-[13px] font-extrabold text-stone-900">{count}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function Kanban({ tasks, setTasks, onOpenTask }: {
  tasks: Task[];
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
  onOpenTask: (t: Task) => void;
}) {
  const [view, setView] = useState<"board" | "list" | "timeline" | "analytics">("board");
  const [dragId, setDragId] = useState<string | null>(null);
  const [overCol, setOverCol] = useState<Status | null>(null);

  const drop = (status: Status) => {
    if (!dragId) return;
    setTasks((prev) => prev.map((t) => (t.id === dragId ? { ...t, status } : t)));
    setDragId(null);
    setOverCol(null);
  };

  return (
    <div className="rise-in px-5 pb-16 lg:px-8">
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-[32px] font-extrabold leading-none tracking-tight text-stone-900">
            Sprint <span className="font-serif-italic font-normal text-violet-700">board</span>
          </h1>
          <p className="mt-1.5 text-[13.5px] font-medium text-stone-500">Drag cards to move them across the pipeline.</p>
        </div>
        <SegmentedControl
          value={view}
          onChange={setView}
          options={[
            { value: "board", label: "Board" },
            { value: "list", label: "List" },
            { value: "timeline", label: "Timeline" },
            { value: "analytics", label: "Analytics" },
          ]}
        />
      </div>

      {view === "board" ? (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
          {COLUMNS.map((col) => {
            const meta = STATUS_META[col];
            const c = PASTEL[meta.tint];
            const items = tasks.filter((t) => t.status === col);
            return (
              <div
                key={col}
                onDragOver={(e) => { e.preventDefault(); setOverCol(col); }}
                onDragLeave={() => setOverCol((o) => (o === col ? null : o))}
                onDrop={() => drop(col)}
                className={`rounded-3xl p-3 transition-colors duration-200 ${
                  overCol === col ? "bg-stone-100" : "bg-transparent"
                }`}
                style={overCol === col ? { outline: "2px dashed rgba(0,0,0,0.12)", outlineOffset: "-4px" } : undefined}
              >
                <div className="mb-3 flex items-center justify-between px-1">
                  <div className="flex items-center gap-2">
                    <span className="h-2.5 w-2.5 rounded-full" style={{ background: c.solid }} />
                    <span className="text-[13.5px] font-extrabold tracking-tight text-stone-900">{meta.label}</span>
                    <span className="tnum rounded-full bg-white px-1.5 py-0.5 text-[11px] font-bold text-stone-500" style={{ border: "1px solid rgba(0,0,0,0.06)" }}>{items.length}</span>
                  </div>
                  <div className="flex items-center gap-0.5">
                    <button className="tactile flex h-6 w-6 items-center justify-center rounded-lg text-stone-400 hover:bg-white"><Plus className="h-4 w-4" strokeWidth={2.4} /></button>
                    <button className="tactile flex h-6 w-6 items-center justify-center rounded-lg text-stone-400 hover:bg-white"><MoreHorizontal className="h-4 w-4" strokeWidth={2.4} /></button>
                  </div>
                </div>
                <div className="space-y-3">
                  {items.map((t) => (
                    <Card key={t.id} task={t} onOpen={() => onOpenTask(t)} onDragStart={() => setDragId(t.id)} dragging={dragId === t.id} />
                  ))}
                  {items.length === 0 && (
                    <div className="rounded-2xl py-10 text-center text-[12px] font-medium text-stone-400" style={{ border: "1.5px dashed rgba(0,0,0,0.08)" }}>Drop tasks here</div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : view === "list" ? (
        <div className="bento-card p-6">
          <div className="divide-y divide-stone-100">
            {tasks.map((t) => {
              const meta = STATUS_META[t.status];
              const c = PASTEL[meta.tint];
              return (
                <button key={t.id} onClick={() => onOpenTask(t)} className="tactile flex w-full items-center gap-3 py-3 text-left">
                  <span className="tech-badge w-16 text-[10px] text-stone-400">{t.code}</span>
                  <span className="flex-1 truncate text-[14px] font-bold text-stone-900">{t.title}</span>
                  <span className="rounded-full px-2.5 py-1 text-[11px] font-bold" style={{ background: c.bg, color: c.text, border: `1px solid ${c.border}` }}>{meta.label}</span>
                  <PriorityBadge priority={t.priority} />
                  <AvatarStack ids={t.assignees} memberById={memberById} />
                </button>
              );
            })}
          </div>
        </div>
      ) : view === "timeline" ? (
        <TimelineView tasks={tasks} onOpenTask={onOpenTask} />
      ) : (
        <BoardAnalytics tasks={tasks} />
      )}
    </div>
  );
}
