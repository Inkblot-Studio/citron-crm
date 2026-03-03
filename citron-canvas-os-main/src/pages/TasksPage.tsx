import { AppLayout } from "../components/layout/AppLayout";
import {
  CheckSquare,
  Plus,
  Circle,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Calendar,
  User,
} from "lucide-react";

const tasks = [
  { title: "Follow up with Sarah Chen on proposal", assignee: "You", due: "Today", priority: "high" as const, status: "todo" as const, deal: "Acme Corp" },
  { title: "Prepare demo for TechVentures", assignee: "You", due: "Tomorrow", priority: "high" as const, status: "in_progress" as const, deal: "TechVentures" },
  { title: "Send contract to StartupXYZ", assignee: "Mike R.", due: "Feb 26", priority: "medium" as const, status: "todo" as const, deal: "StartupXYZ" },
  { title: "Review GlobalTech churn signals", assignee: "You", due: "Feb 25", priority: "urgent" as const, status: "todo" as const, deal: "GlobalTech" },
  { title: "Update pricing deck Q1", assignee: "Lisa K.", due: "Mar 1", priority: "low" as const, status: "in_progress" as const, deal: null },
  { title: "Schedule QBR with Acme Corp", assignee: "You", due: "Feb 28", priority: "medium" as const, status: "done" as const, deal: "Acme Corp" },
  { title: "Send onboarding docs to DataFlow", assignee: "Mike R.", due: "Feb 24", priority: "medium" as const, status: "done" as const, deal: "DataFlow Labs" },
];

const priorityConfig = {
  urgent: { label: "Urgent", color: "text-destructive", bg: "bg-destructive/10" },
  high: { label: "High", color: "text-citrus-orange", bg: "bg-citrus-orange/10" },
  medium: { label: "Medium", color: "text-citrus-lemon", bg: "bg-citrus-lemon/10" },
  low: { label: "Low", color: "text-muted-foreground", bg: "bg-secondary" },
};

const statusGroups = [
  { key: "todo" as const, label: "To Do", icon: Circle },
  { key: "in_progress" as const, label: "In Progress", icon: Clock },
  { key: "done" as const, label: "Done", icon: CheckCircle2 },
];

const TasksPage = () => {
  return (
    <AppLayout showRightPanel>
      <div className="h-full flex flex-col">
        <header className="px-8 py-5 border-b border-border flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-citrus-green/10 flex items-center justify-center">
              <CheckSquare className="w-4 h-4 text-citrus-green" />
            </div>
            <div>
              <h1 className="text-lg font-semibold tracking-tight text-foreground">Tasks</h1>
              <p className="text-xs text-muted-foreground mt-0.5">
                {tasks.filter((t) => t.status !== "done").length} pending · {tasks.filter((t) => t.priority === "urgent").length} urgent
              </p>
            </div>
          </div>
          <button className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-primary text-primary-foreground text-xs font-medium hover:bg-primary/90 transition-colors">
            <Plus className="w-3 h-3" />
            New Task
          </button>
        </header>

        <div className="flex-1 overflow-y-auto hide-scrollbar px-8 py-6 space-y-6">
          {statusGroups.map((group) => {
            const groupTasks = tasks.filter((t) => t.status === group.key);
            if (groupTasks.length === 0) return null;
            return (
              <div key={group.key}>
                <div className="flex items-center gap-2 mb-3">
                  <group.icon className="w-3.5 h-3.5 text-muted-foreground" />
                  <h2 className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    {group.label}
                  </h2>
                  <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-secondary text-secondary-foreground">
                    {groupTasks.length}
                  </span>
                </div>
                <div className="space-y-2">
                  {groupTasks.map((task, i) => {
                    const p = priorityConfig[task.priority];
                    return (
                      <div
                        key={i}
                        className={`glass rounded-xl p-4 flex items-center gap-4 hover:bg-secondary/20 transition-colors ${
                          group.key === "done" ? "opacity-50" : ""
                        }`}
                      >
                        <button className="shrink-0">
                          {group.key === "done" ? (
                            <CheckCircle2 className="w-4 h-4 text-citrus-lime" />
                          ) : (
                            <Circle className="w-4 h-4 text-muted-foreground/40 hover:text-citrus-lime transition-colors" />
                          )}
                        </button>
                        <div className="flex-1 min-w-0">
                          <p className={`text-sm font-medium text-foreground ${group.key === "done" ? "line-through" : ""}`}>
                            {task.title}
                          </p>
                          {task.deal && (
                            <span className="text-[10px] text-muted-foreground">{task.deal}</span>
                          )}
                        </div>
                        <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${p.bg} ${p.color}`}>{p.label}</span>
                        <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {task.due}
                        </span>
                        <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                          <User className="w-3 h-3" />
                          {task.assignee}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </AppLayout>
  );
};

export default TasksPage;
