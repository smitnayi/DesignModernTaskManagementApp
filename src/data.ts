export type Priority = "Low" | "Medium" | "High" | "Critical";
export type Status = "todo" | "in_progress" | "in_review" | "done";
export type Presence = "online" | "busy" | "offline";

export interface Member {
  id: string;
  name: string;
  email: string;
  role: string;
  initials: string;
  tint: PastelKey;
  presence: Presence;
  projects: number;
  tasks: number;
  hours: number;
}

export interface Subtask {
  id: string;
  title: string;
  done: boolean;
}

export interface Task {
  id: string;
  code: string;
  title: string;
  description: string;
  status: Status;
  priority: Priority;
  space: string;
  spaceTint: PastelKey;
  tags: { label: string; tint: PastelKey }[];
  assignees: string[];
  subtasks: Subtask[];
  mockup?: string;
  due: string;
  /** Days from "today". Negative = overdue. null = no date / shipped. */
  dueOffsetDays: number | null;
  /** Days since the task was last touched by anyone. */
  updatedOffsetDays: number;
}

export type PastelKey =
  | "lavender"
  | "peach"
  | "lime"
  | "sky"
  | "rose"
  | "mint"
  | "gold"
  | "stone";

export const PASTEL: Record<
  PastelKey,
  { bg: string; text: string; border: string; solid: string }
> = {
  lavender: { bg: "#EDE9FE", text: "#6D28D9", border: "#DDD6FE", solid: "#a855f7" },
  peach: { bg: "#FFEDD5", text: "#C2410C", border: "#FDBA74", solid: "#f97316" },
  lime: { bg: "#ECFCCB", text: "#3F6212", border: "#D9F99D", solid: "#84cc16" },
  sky: { bg: "#E0F2FE", text: "#0369A1", border: "#BAE6FD", solid: "#0ea5e9" },
  rose: { bg: "#FFE4E6", text: "#BE123C", border: "#FECDD3", solid: "#f43f5e" },
  mint: { bg: "#DCFCE7", text: "#15803D", border: "#BBF7D0", solid: "#22c55e" },
  gold: { bg: "#FEF9C3", text: "#854D0E", border: "#FEF08A", solid: "#eab308" },
  stone: { bg: "#F1EEE8", text: "#57534e", border: "#E7E1D6", solid: "#78716c" },
};

export const PRIORITY_TINT: Record<Priority, PastelKey> = {
  Low: "stone",
  Medium: "sky",
  High: "peach",
  Critical: "rose",
};

export const members: Member[] = [
  { id: "u1", name: "Kacie Velasquez", email: "kacie@meridian.design", role: "Lead Product Designer", initials: "KV", tint: "lavender", presence: "online", projects: 4, tasks: 12, hours: 34.5 },
  { id: "u2", name: "Marcus Chen", email: "marcus@meridian.design", role: "Principal Engineer", initials: "MC", tint: "sky", presence: "online", projects: 3, tasks: 9, hours: 38.2 },
  { id: "u3", name: "Elena Vance", email: "elena@meridian.design", role: "VP of Product", initials: "EV", tint: "peach", presence: "busy", projects: 6, tasks: 5, hours: 28.0 },
  { id: "u4", name: "Sophia Aris", email: "sophia@meridian.design", role: "Art Director", initials: "SA", tint: "rose", presence: "online", projects: 5, tasks: 14, hours: 31.7 },
  { id: "u5", name: "Julian Ward", email: "julian@meridian.design", role: "Managing Partner", initials: "JW", tint: "mint", presence: "offline", projects: 8, tasks: 3, hours: 22.4 },
  { id: "u6", name: "Aisha Johnson", email: "aisha@meridian.design", role: "Senior Frontend Architect", initials: "AJ", tint: "gold", presence: "busy", projects: 4, tasks: 11, hours: 36.9 },
];

export const memberById = (id: string) => members.find((m) => m.id === id)!;

export const SPRINT = {
  name: "Sprint 24",
  daysLeft: 4,
  committed: 48,
  completed: 36,
};

export type HealthKind = "done" | "overdue" | "due-today" | "due-soon" | "on-track" | "undated";

export interface TaskHealth {
  kind: HealthKind;
  stale: boolean;
  daysOverdue: number;
  daysSinceUpdate: number;
  dueLabel: string;
  tint: PastelKey;
}

export function formatDue(offset: number | null): string {
  if (offset === null) return "No date";
  if (offset < 0) return `${-offset}d overdue`;
  if (offset === 0) return "Due today";
  if (offset === 1) return "Due tomorrow";
  return `Due in ${offset}d`;
}

const STALE_THRESHOLD = 5;

export function taskHealth(t: Task): TaskHealth {
  const daysSinceUpdate = t.updatedOffsetDays;
  const stale = t.status !== "done" && daysSinceUpdate >= STALE_THRESHOLD;
  if (t.status === "done") {
    return { kind: "done", stale: false, daysOverdue: 0, daysSinceUpdate, dueLabel: "Done", tint: "mint" };
  }
  const off = t.dueOffsetDays;
  if (off === null) {
    return { kind: "undated", stale, daysOverdue: 0, daysSinceUpdate, dueLabel: "No date", tint: "stone" };
  }
  if (off < 0) {
    return { kind: "overdue", stale, daysOverdue: -off, daysSinceUpdate, dueLabel: `${-off}d overdue`, tint: "rose" };
  }
  if (off === 0) {
    return { kind: "due-today", stale, daysOverdue: 0, daysSinceUpdate, dueLabel: "Due today", tint: "peach" };
  }
  if (off <= 2) {
    return { kind: "due-soon", stale, daysOverdue: 0, daysSinceUpdate, dueLabel: off === 1 ? "Due tomorrow" : `Due in ${off}d`, tint: "gold" };
  }
  return { kind: "on-track", stale, daysOverdue: 0, daysSinceUpdate, dueLabel: `Due in ${off}d`, tint: "mint" };
}

export const initialTasks: Task[] = [
  {
    id: "t1", code: "MRD-001", title: "Design System 2.0 tokens & component specs",
    description: "Finalize the pastel ecosystem tokens, elevation ladder and tactile segmented control specs for the Kinetic 2.0 release.",
    status: "in_progress", priority: "High", space: "Design Internal", spaceTint: "lavender",
    tags: [{ label: "Design", tint: "lavender" }, { label: "Internal", tint: "stone" }],
    assignees: ["u1", "u6"],
    subtasks: [
      { id: "s1", title: "Audit legacy gray tokens", done: true },
      { id: "s2", title: "Define 7-pastel container tints", done: true },
      { id: "s3", title: "Spec elevation ladder", done: true },
      { id: "s4", title: "Document motion curve", done: false },
      { id: "s5", title: "Publish Storybook", done: false },
    ],
    mockup: "https://images.unsplash.com/photo-1618788372246-79faff0c3742?w=640&h=360&fit=crop&auto=format",
    due: "In 2 days",
    dueOffsetDays: 2, updatedOffsetDays: 1,
  },
  {
    id: "t2", code: "MRD-012", title: "Financial banking app — dashboard flows",
    description: "Ship the executive bento dashboard, capacity dials and burn-up speedometers for the commercial banking client.",
    status: "in_progress", priority: "Critical", space: "Commercial", spaceTint: "peach",
    tags: [{ label: "Commercial", tint: "peach" }, { label: "Product", tint: "sky" }],
    assignees: ["u4", "u2", "u3"],
    subtasks: [
      { id: "s6", title: "Wire velocity endpoint", done: true },
      { id: "s7", title: "Build speedometer widget", done: true },
      { id: "s8", title: "Capacity dial polish", done: false },
    ],
    mockup: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=640&h=360&fit=crop&auto=format",
    due: "Today",
    dueOffsetDays: -1, updatedOffsetDays: 0,
  },
  {
    id: "t3", code: "MRD-014", title: "Design 3 variations for card mockup",
    description: "Explore three high-fidelity directions for the kanban card mockup preview frame.",
    status: "todo", priority: "High", space: "Publications", spaceTint: "rose",
    tags: [{ label: "Design", tint: "lavender" }],
    assignees: ["u1"],
    subtasks: [
      { id: "s9", title: "Direction A — editorial", done: false },
      { id: "s10", title: "Direction B — tactile", done: false },
      { id: "s11", title: "Direction C — minimal", done: false },
    ],
    due: "In 4 days",
    dueOffsetDays: 4, updatedOffsetDays: 3,
  },
  {
    id: "t4", code: "MRD-020", title: "Implement OAuth2 single sign-on",
    description: "Google & GitHub OAuth credential exchange with JWT session cookies.",
    status: "todo", priority: "Critical", space: "Commercial", spaceTint: "peach",
    tags: [{ label: "Dev", tint: "sky" }, { label: "Security", tint: "rose" }],
    assignees: ["u2"],
    subtasks: [
      { id: "s12", title: "Google provider", done: false },
      { id: "s13", title: "GitHub provider", done: false },
    ],
    due: "In 1 day",
    dueOffsetDays: -3, updatedOffsetDays: 6,
  },
  {
    id: "t5", code: "MRD-023", title: "Sprint burndown analytics export",
    description: "CSV/BI export for enterprise telemetry lookback windows.",
    status: "in_review", priority: "Medium", space: "Design Internal", spaceTint: "lavender",
    tags: [{ label: "Analytics", tint: "mint" }],
    assignees: ["u6", "u3"],
    subtasks: [
      { id: "s14", title: "Aggregate weekly hours", done: true },
      { id: "s15", title: "CSV serializer", done: true },
    ],
    due: "Tomorrow",
    dueOffsetDays: 1, updatedOffsetDays: 9,
  },
  {
    id: "t6", code: "MRD-025", title: "Kinetic member card presence halos",
    description: "Double-ring pulse presence beacons for the team directory.",
    status: "in_review", priority: "Low", space: "Design Internal", spaceTint: "lavender",
    tags: [{ label: "Design", tint: "lavender" }, { label: "Motion", tint: "gold" }],
    assignees: ["u4"],
    subtasks: [{ id: "s16", title: "Online double-ring", done: true }],
    due: "In 3 days",
    dueOffsetDays: 3, updatedOffsetDays: 12,
  },
  {
    id: "t7", code: "MRD-030", title: "Command palette fuzzy indexing",
    description: "Cmd+K global command palette with fuzzy search across tasks, members and navigation.",
    status: "done", priority: "High", space: "Design Internal", spaceTint: "lavender",
    tags: [{ label: "Dev", tint: "sky" }],
    assignees: ["u2", "u6"],
    subtasks: [
      { id: "s17", title: "Fuzzy matcher", done: true },
      { id: "s18", title: "Keyboard nav", done: true },
    ],
    due: "Shipped",
    dueOffsetDays: null, updatedOffsetDays: 20,
  },
  {
    id: "t8", code: "MRD-031", title: "Dynamic island sprint countdown",
    description: "Obsidian floating HUD with live sprint countdown and standup beacon.",
    status: "done", priority: "Medium", space: "Design Internal", spaceTint: "lavender",
    tags: [{ label: "Design", tint: "lavender" }],
    assignees: ["u1"],
    subtasks: [{ id: "s19", title: "Countdown clock", done: true }],
    due: "Shipped",
    dueOffsetDays: null, updatedOffsetDays: 25,
  },
];

export const STATUS_META: Record<Status, { label: string; tint: PastelKey }> = {
  todo: { label: "To do", tint: "stone" },
  in_progress: { label: "In Progress", tint: "sky" },
  in_review: { label: "In Review", tint: "peach" },
  done: { label: "Done", tint: "mint" },
};

export const weeklyHours = [
  { day: "Mon", v: 18 },
  { day: "Tue", v: 26 },
  { day: "Wed", v: 14 },
  { day: "Thu", v: 22 },
  { day: "Fri", v: 31 },
  { day: "Sat", v: 9 },
  { day: "Sun", v: 6 },
];
