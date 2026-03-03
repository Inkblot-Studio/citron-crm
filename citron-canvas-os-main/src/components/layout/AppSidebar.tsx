import { useLocation, Link } from "react-router-dom";
import {
  MessageSquare,
  Command,
  Mail,
  Users,
  CheckSquare,
  Settings,
  FileText,
} from "lucide-react";

const modules = [
  { icon: MessageSquare, label: "Canvas", path: "/", tourId: "nav-canvas" },
  { icon: FileText, label: "Invoices & Deals", path: "/invoices", tourId: "nav-invoices" },
  { icon: Users, label: "Contacts", path: "/contacts", tourId: "nav-contacts" },
  { icon: Mail, label: "Campaigns", path: "/campaigns", tourId: "nav-campaigns" },
  { icon: CheckSquare, label: "Tasks", path: "/tasks", tourId: "nav-tasks" },
];

const bottomModules = [
  { icon: Settings, label: "Settings", path: "/settings", tourId: "nav-settings" },
];

export function AppSidebar() {
  const location = useLocation();

  return (
    <aside className="w-16 h-full flex flex-col items-center py-4 border-r border-border bg-sidebar gap-1" data-tour="sidebar">
      {/* Logo */}
      <div className="w-9 h-9 rounded-lg bg-primary flex items-center justify-center mb-6">
        <Command className="w-4 h-4 text-primary-foreground" />
      </div>

      {/* Modules */}
      <nav className="flex-1 flex flex-col gap-1 overflow-y-auto hide-scrollbar">
        {modules.map((mod) => {
          const active = location.pathname === mod.path;
          return (
            <Link
              key={mod.path}
              to={mod.path}
              data-tour={mod.tourId}
              className={`
                group relative w-10 h-10 rounded-lg flex items-center justify-center shrink-0
                transition-all duration-200
                ${active
                  ? "bg-secondary text-foreground"
                  : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
                }
              `}
              title={mod.label}
            >
              <mod.icon className="w-[18px] h-[18px]" />
              {active && (
                <span className="absolute left-0 top-1/2 -translate-y-1/2 w-[2px] h-4 rounded-r bg-primary" />
              )}
              <span className="absolute left-full ml-3 px-2 py-1 text-xs font-medium rounded bg-card text-card-foreground border border-border opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50">
                {mod.label}
              </span>
            </Link>
          );
        })}
      </nav>

      {/* Bottom */}
      <div className="flex flex-col gap-1">
        {bottomModules.map((mod) => {
          const active = location.pathname === mod.path;
          return (
            <Link
              key={mod.path}
              to={mod.path}
              data-tour={mod.tourId}
              className={`
                group relative w-10 h-10 rounded-lg flex items-center justify-center
                transition-all duration-200
                ${active
                  ? "bg-secondary text-foreground"
                  : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
                }
              `}
              title={mod.label}
            >
              <mod.icon className="w-[18px] h-[18px]" />
              {active && (
                <span className="absolute left-0 top-1/2 -translate-y-1/2 w-[2px] h-4 rounded-r bg-primary" />
              )}
              <span className="absolute left-full ml-3 px-2 py-1 text-xs font-medium rounded bg-card text-card-foreground border border-border opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50">
                {mod.label}
              </span>
            </Link>
          );
        })}
        <div className="w-2 h-2 rounded-full bg-citrus-lime animate-pulse-glow mt-2 mx-auto" title="System Online" data-tour="system-status" />
      </div>
    </aside>
  );
}
