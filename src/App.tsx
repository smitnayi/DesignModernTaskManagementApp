import { useEffect, useState } from "react";
import { Sidebar, View } from "./components/Sidebar";
import { TopBar } from "./components/TopBar";
import { Dashboard } from "./components/Dashboard";
import { Kanban } from "./components/Kanban";
import { Team } from "./components/Team";
import { Calendar } from "./components/Calendar";
import { Messages } from "./components/Messages";
import { Analytics } from "./components/Analytics";
import { Settings } from "./components/Settings";
import { Login } from "./components/Login";
import { TaskDrawer } from "./components/TaskDrawer";
import { CommandPalette } from "./components/CommandPalette";
import { NewTaskModal } from "./components/NewTaskModal";
import { initialTasks, Task, Status, memberById } from "./data";
import { Toast } from "./components/Toast";

export default function App() {
  const [authed, setAuthed] = useState(false);
  const [view, setView] = useState<View>("dashboard");
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [openTaskId, setOpenTaskId] = useState<string | null>(null);
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [newTaskOpen, setNewTaskOpen] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setPaletteOpen((o) => !o);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const [toast, setToast] = useState<{ id: number; msg: string; tone: "ok" | "info" } | null>(null);
  const notify = (msg: string, tone: "ok" | "info" = "ok") => setToast({ id: Date.now(), msg, tone });
  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 3200);
    return () => clearTimeout(t);
  }, [toast]);

  // Any activity resets the staleness clock — realistic behaviour.
  const touch = (t: Task): Task => ({ ...t, updatedOffsetDays: 0 });

  const toggleSub = (taskId: string, subId: string) =>
    setTasks((prev) =>
      prev.map((t) =>
        t.id === taskId
          ? touch({ ...t, subtasks: t.subtasks.map((s) => (s.id === subId ? { ...s, done: !s.done } : s)) })
          : t
      )
    );

  const setStatus = (taskId: string, status: Status) =>
    setTasks((prev) => prev.map((t) => (t.id === taskId ? touch({ ...t, status }) : t)));

  const addSub = (taskId: string, title: string) =>
    setTasks((prev) =>
      prev.map((t) =>
        t.id === taskId
          ? touch({ ...t, subtasks: [...t.subtasks, { id: `n${Date.now()}`, title, done: false }] })
          : t
      )
    );

  const rescheduleTask = (taskId: string, days: number) => {
    setTasks((prev) => prev.map((t) => (t.id === taskId ? touch({ ...t, dueOffsetDays: days }) : t)));
    notify(days === 1 ? "Rescheduled to tomorrow" : `Rescheduled to +${days} days`);
  };

  const markDone = (taskId: string) => {
    setTasks((prev) => prev.map((t) => (t.id === taskId ? touch({ ...t, status: "done" }) : t)));
    notify("Marked as done — nice work");
  };

  const caughtUp = (taskId: string) => {
    setTasks((prev) => prev.map((t) => (t.id === taskId ? touch(t) : t)));
    notify("Marked as reviewed — clock reset", "info");
  };

  const nudge = (taskId: string) => {
    const t = tasks.find((x) => x.id === taskId);
    const who = t ? memberById(t.assignees[0]).name.split(" ")[0] : "assignee";
    notify(`Nudge sent to ${who}`, "info");
  };

  const openTask = (t: Task) => setOpenTaskId(t.id);
  const activeTask = tasks.find((t) => t.id === openTaskId) ?? null;

  if (!authed) return <Login onLogin={() => setAuthed(true)} />;

  return (
    <div className="flex h-full" style={{ background: "var(--color-canvas)" }}>
      <Sidebar
        view={view}
        onNavigate={setView}
        onLogout={() => setAuthed(false)}
        mobileOpen={mobileNavOpen}
        onClose={() => setMobileNavOpen(false)}
      />

      <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
        <TopBar onCommand={() => setPaletteOpen(true)} onNewTask={() => setNewTaskOpen(true)} onMenu={() => setMobileNavOpen(true)} />

        <main className="flex-1 overflow-y-auto">
          {view === "dashboard" && (
            <Dashboard
              tasks={tasks}
              onOpenTask={openTask}
              onToggleSub={toggleSub}
              onReschedule={rescheduleTask}
              onMarkDone={markDone}
              onCaughtUp={caughtUp}
              onNudge={nudge}
            />
          )}
          {view === "kanban" && <Kanban tasks={tasks} setTasks={setTasks} onOpenTask={openTask} />}
          {view === "team" && <Team />}
          {view === "calendar" && <Calendar />}
          {view === "messages" && <Messages />}
          {view === "analytics" && <Analytics />}
          {view === "settings" && <Settings />}
        </main>
      </div>

      <TaskDrawer
        task={activeTask}
        onClose={() => setOpenTaskId(null)}
        onToggleSub={toggleSub}
        onStatus={setStatus}
        onAddSub={addSub}
      />

      <CommandPalette
        open={paletteOpen}
        onClose={() => setPaletteOpen(false)}
        onNavigate={(v) => setView(v)}
        onNewTask={() => setNewTaskOpen(true)}
      />

      <NewTaskModal
        open={newTaskOpen}
        onClose={() => setNewTaskOpen(false)}
        count={tasks.length + 1}
        onCreate={(t) => {
          setTasks((prev) => [t, ...prev]);
          setView("kanban");
          notify("Task created");
        }}
      />

      <Toast toast={toast} />
    </div>
  );
}
