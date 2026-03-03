import {
  Mail,
  FileText,
  CreditCard,
  GitBranch,
  Phone,
  Zap,
} from "lucide-react";

const events = [
  {
    id: 1,
    type: "email",
    icon: Mail,
    title: "Email opened",
    meta: "Jane Smith · Acme Corp",
    time: "2m ago",
    status: "info" as const,
  },
  {
    id: 2,
    type: "invoice",
    icon: CreditCard,
    title: "Invoice #1042 paid",
    meta: "$24,500 · TechVentures",
    time: "8m ago",
    status: "success" as const,
  },
  {
    id: 3,
    type: "deployment",
    icon: Zap,
    title: "Pipeline stage changed",
    meta: "Negotiation → Closing",
    time: "14m ago",
    status: "warning" as const,
  },
  {
    id: 4,
    type: "call",
    icon: Phone,
    title: "Call completed",
    meta: "12 min · Mark Johnson",
    time: "23m ago",
    status: "info" as const,
  },
  {
    id: 5,
    type: "document",
    icon: FileText,
    title: "Contract signed",
    meta: "NDA · GlobalTech Inc",
    time: "1h ago",
    status: "success" as const,
  },
  {
    id: 6,
    type: "graph",
    icon: GitBranch,
    title: "New relationship detected",
    meta: "Acme ↔ DataFlow Labs",
    time: "2h ago",
    status: "info" as const,
  },
  {
    id: 7,
    type: "invoice",
    icon: CreditCard,
    title: "Invoice overdue",
    meta: "$8,200 · StartupXYZ",
    time: "3h ago",
    status: "danger" as const,
  },
];

const statusColors: Record<string, string> = {
  success: "bg-status-success",
  warning: "bg-status-warning",
  danger: "bg-status-danger",
  info: "bg-status-info",
};

export function EventFeed() {
  return (
    <div className="p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
          Event Stream
        </h3>
        <span className="text-[10px] text-muted-foreground font-mono">Live</span>
      </div>
      <div className="space-y-1">
        {events.map((event, i) => (
          <div
            key={event.id}
            className="flex items-start gap-3 p-2.5 rounded-lg hover:bg-secondary/50 transition-colors cursor-pointer group animate-fade-in"
            style={{ animationDelay: `${i * 50}ms` }}
          >
            <div className="w-7 h-7 rounded-md surface-2 flex items-center justify-center flex-shrink-0 mt-0.5">
              <event.icon className="w-3.5 h-3.5 text-muted-foreground group-hover:text-foreground transition-colors" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${statusColors[event.status]}`} />
                <p className="text-xs font-medium text-foreground truncate">
                  {event.title}
                </p>
              </div>
              <p className="text-[10px] text-muted-foreground mt-0.5 truncate">
                {event.meta}
              </p>
            </div>
            <span className="text-[10px] text-muted-foreground flex-shrink-0 mt-0.5">
              {event.time}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
