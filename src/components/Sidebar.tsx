import {
  LayoutDashboard,
  KanbanSquare,
  Users,
  Calendar,
  MessageSquare,
  BarChart3,
  Settings,
  ChevronsUpDown,
  Check,
  LogOut,
} from "lucide-react";
import { useState } from "react";
import { members } from "../data";

export type View = "dashboard" | "kanban" | "team" | "calendar" | "messages" | "analytics" | "settings";

const NAV: { view: View; label: string; icon: any }[] = [
  { view: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { view: "kanban", label: "Kanban", icon: KanbanSquare },
  { view: "team", label: "Team", icon: Users },
  { view: "calendar", label: "Calendar", icon: Calendar },
  { view: "messages", label: "Messages", icon: MessageSquare },
  { view: "analytics", label: "Analytics", icon: BarChart3 },
  { view: "settings", label: "Settings", icon: Settings },
];

const ORGS = [
  { name: "Acme Studio", slug: "acme", role: "Owner" },
  { name: "Apex Labs", slug: "apex", role: "Member" },
];

export function Sidebar({ view, onNavigate, onLogout, mobileOpen = false, onClose }: {
  view: View;
  onNavigate: (v: View) => void;
  onLogout: () => void;
  mobileOpen?: boolean;
  onClose?: () => void;
}) {
  const [org, setOrg] = useState(ORGS[0]);
  const [orgOpen, setOrgOpen] = useState(false);

  const go = (v: View) => {
    onNavigate(v);
    onClose?.();
  };

  return (
    <>
      {mobileOpen && (
        <div className="fixed inset-0 z-40 bg-stone-900/40 backdrop-blur-sm lg:hidden" onClick={onClose} />
      )}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-[264px] shrink-0 flex-col gap-6 overflow-y-auto px-4 py-6 shadow-2xl transition-transform duration-300 lg:static lg:z-auto lg:w-[248px] lg:translate-x-0 lg:shadow-none ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
        style={{ background: "var(--color-canvas-subtle)", transitionTimingFunction: "cubic-bezier(0.16,1,0.3,1)" }}
      >
      {/* Brand */}
      <div className="flex items-center gap-2.5 px-2">
        <div
          className="flex h-9 w-9 items-center justify-center rounded-xl text-white"
          style={{ background: "#111318", boxShadow: "0 6px 16px -4px rgba(0,0,0,0.4)" }}
        >
          <span className="font-serif-italic text-xl leading-none">M</span>
        </div>
        <div className="leading-tight">
          <div className="text-[15px] font-extrabold tracking-tight text-stone-900">Meridian</div>
          <div className="tech-badge text-[9px] text-stone-500">Clarity Pro</div>
        </div>
      </div>

      {/* Org switcher */}
      <div className="relative px-1">
        <button
          onClick={() => setOrgOpen((o) => !o)}
          className="tactile focus-ring flex w-full items-center gap-2.5 rounded-2xl bg-white px-3 py-2.5 text-left"
          style={{ border: "1px solid rgba(0,0,0,0.06)", boxShadow: "0 2px 8px -2px rgba(18,19,22,0.05)" }}
          aria-expanded={orgOpen}
        >
          <div
            className="flex h-8 w-8 items-center justify-center rounded-lg text-[13px] font-extrabold text-white"
            style={{ background: "#6D28D9" }}
          >
            {org.name[0]}
          </div>
          <div className="min-w-0 flex-1">
            <div className="truncate text-[13px] font-bold text-stone-900">{org.name}</div>
            <div className="text-[11px] font-medium text-stone-500">{org.role}</div>
          </div>
          <ChevronsUpDown className="h-4 w-4 text-stone-400" strokeWidth={2} />
        </button>
        {orgOpen && (
          <>
          <div className="fixed inset-0 z-20" onClick={() => setOrgOpen(false)} />
          <div
            className="palette-in absolute left-1 right-1 z-30 mt-2 rounded-2xl bg-white p-1.5"
            style={{ border: "1px solid rgba(0,0,0,0.08)", boxShadow: "0 16px 34px -6px rgba(18,19,22,0.16)" }}
          >
            {ORGS.map((o) => (
              <button
                key={o.slug}
                onClick={() => {
                  setOrg(o);
                  setOrgOpen(false);
                }}
                className="tactile flex w-full items-center gap-2 rounded-xl px-2.5 py-2 text-left hover:bg-stone-100"
              >
                <div className="min-w-0 flex-1">
                  <div className="truncate text-[13px] font-bold text-stone-900">{o.name}</div>
                  <div className="text-[11px] text-stone-500">{o.role}</div>
                </div>
                {o.slug === org.slug && <Check className="h-4 w-4 text-violet-700" strokeWidth={2.2} />}
              </button>
            ))}
            <div className="my-1 h-px bg-stone-100" />
            <button className="tactile w-full rounded-xl px-2.5 py-2 text-left text-[12px] font-bold text-stone-600 hover:bg-stone-100">
              + Create organization
            </button>
            <button className="tactile w-full rounded-xl px-2.5 py-2 text-left text-[12px] font-bold text-stone-600 hover:bg-stone-100">
              Join via code
            </button>
          </div>
          </>
        )}
      </div>

      {/* Nav */}
      <nav className="flex flex-1 flex-col gap-1 px-1">
        {NAV.map(({ view: v, label, icon: Icon }) => {
          const active = v === view;
          return (
            <button
              key={v}
              onClick={() => go(v)}
              aria-current={active ? "page" : undefined}
              className={`tactile focus-ring flex items-center gap-3 rounded-2xl px-3 py-2.5 text-[13.5px] font-bold tracking-tight ${
                active ? "bg-white text-stone-900" : "text-stone-500 hover:bg-white/60 hover:text-stone-800"
              }`}
              style={active ? { boxShadow: "0 2px 10px -2px rgba(18,19,22,0.07)", border: "1px solid rgba(0,0,0,0.05)" } : undefined}
            >
              <Icon className="h-[18px] w-[18px]" strokeWidth={active ? 2.2 : 1.9} />
              {label}
            </button>
          );
        })}
      </nav>

      {/* Upgrade card */}
      <div
        className="relative overflow-hidden rounded-2xl p-4 text-white"
        style={{ background: "#111318", boxShadow: "0 12px 28px -8px rgba(0,0,0,0.4)" }}
      >
        <div
          className="pointer-events-none absolute -right-8 -top-8 h-24 w-24 rounded-full opacity-40 blur-2xl"
          style={{ background: "#a855f7" }}
        />
        <div className="tech-badge text-[9px] text-lime-400">Enterprise</div>
        <div className="mt-1 font-serif-italic text-[19px] leading-tight">Unlock unlimited spaces</div>
        <button className="tactile mt-3 w-full rounded-xl bg-white py-2 text-[12.5px] font-extrabold text-stone-900">
          Upgrade plan
        </button>
      </div>

      {/* Profile + logout */}
      <div className="flex items-center gap-2.5 rounded-2xl bg-white px-3 py-2" style={{ border: "1px solid rgba(0,0,0,0.06)" }}>
        <div className="flex h-8 w-8 items-center justify-center rounded-full text-[11px] font-extrabold text-white" style={{ background: "#6D28D9" }}>
          {members[0].initials}
        </div>
        <div className="min-w-0 flex-1 leading-tight">
          <div className="truncate text-[12.5px] font-bold text-stone-900">{members[0].name}</div>
          <div className="truncate text-[10.5px] font-medium text-stone-500">Owner</div>
        </div>
        <button onClick={onLogout} className="tactile focus-ring flex h-8 w-8 items-center justify-center rounded-full text-stone-400 hover:bg-stone-100 hover:text-rose-600" aria-label="Log out">
          <LogOut className="h-[17px] w-[17px]" strokeWidth={2} />
        </button>
      </div>
    </aside>
    </>
  );
}
