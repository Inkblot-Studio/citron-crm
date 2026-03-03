import { Button, Input, Select, Label } from '@citron-systems/citron-ui'
import * as Popover from '@radix-ui/react-popover'
import {
  CheckSquare,
  Plus,
  Circle,
  CheckCircle2,
  Clock,
  Calendar,
  User,
} from 'lucide-react'
import { useState } from 'react'
import { useToast } from '@/lib/ToastContext'

type TaskStatus = 'todo' | 'in_progress' | 'done'
type TaskPriority = 'urgent' | 'high' | 'medium' | 'low'

interface Task {
  id: string
  title: string
  assignee: string
  due: string
  priority: TaskPriority
  status: TaskStatus
  deal: string | null
}

const initialTasks: Task[] = [
  { id: '1', title: 'Follow up with Sarah Chen on proposal', assignee: 'You', due: 'Today', priority: 'high', status: 'todo', deal: 'Acme Corp' },
  { id: '2', title: 'Prepare demo for TechVentures', assignee: 'You', due: 'Tomorrow', priority: 'high', status: 'in_progress', deal: 'TechVentures' },
  { id: '3', title: 'Send contract to StartupXYZ', assignee: 'Mike R.', due: 'Feb 26', priority: 'medium', status: 'todo', deal: 'StartupXYZ' },
  { id: '4', title: 'Review GlobalTech churn signals', assignee: 'You', due: 'Feb 25', priority: 'urgent', status: 'todo', deal: 'GlobalTech' },
  { id: '5', title: 'Update pricing deck Q1', assignee: 'Lisa K.', due: 'Mar 1', priority: 'low', status: 'in_progress', deal: null },
  { id: '6', title: 'Schedule QBR with Acme Corp', assignee: 'You', due: 'Feb 28', priority: 'medium', status: 'done', deal: 'Acme Corp' },
  { id: '7', title: 'Send onboarding docs to DataFlow', assignee: 'Mike R.', due: 'Feb 24', priority: 'medium', status: 'done', deal: 'DataFlow Labs' },
]

const priorityConfig = {
  urgent: { label: 'Urgent', color: 'text-destructive', bg: 'bg-destructive/10' },
  high: { label: 'High', color: 'text-citrus-orange', bg: 'bg-citrus-orange/10' },
  medium: { label: 'Medium', color: 'text-citrus-lemon', bg: 'bg-citrus-lemon/10' },
  low: { label: 'Low', color: 'text-muted-foreground', bg: 'bg-secondary' },
}

const statusGroups = [
  { key: 'todo' as const, label: 'To Do', icon: Circle },
  { key: 'in_progress' as const, label: 'In Progress', icon: Clock },
  { key: 'done' as const, label: 'Done', icon: CheckCircle2 },
]

const priorityOptions = [
  { value: 'urgent', label: 'Urgent' },
  { value: 'high', label: 'High' },
  { value: 'medium', label: 'Medium' },
  { value: 'low', label: 'Low' },
]

const assigneeOptions = [
  { value: 'You', label: 'You' },
  { value: 'Mike R.', label: 'Mike R.' },
  { value: 'Lisa K.', label: 'Lisa K.' },
]

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>(initialTasks)
  const [addOpen, setAddOpen] = useState(false)
  const [newTask, setNewTask] = useState({ title: '', assignee: 'You', due: 'Today', priority: 'medium' as TaskPriority, deal: '' })
  const { addToast } = useToast()

  const toggleTaskStatus = (task: Task) => {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id !== task.id) return t
        if (t.status === 'done') return { ...t, status: 'todo' as TaskStatus }
        return { ...t, status: 'done' as TaskStatus }
      })
    )
    if (task.status !== 'done') {
      addToast({ title: 'Task completed', variant: 'success' })
    }
  }

  const handleAddTask = () => {
    if (!newTask.title.trim()) return
    const task: Task = {
      id: crypto.randomUUID(),
      title: newTask.title.trim(),
      assignee: newTask.assignee,
      due: newTask.due,
      priority: newTask.priority,
      status: 'todo',
      deal: newTask.deal.trim() || null,
    }
    setTasks((prev) => [task, ...prev])
    setNewTask({ title: '', assignee: 'You', due: 'Today', priority: 'medium', deal: '' })
    setAddOpen(false)
    addToast({ title: 'Task added', variant: 'success' })
  }

  return (
    <div className="h-full flex flex-col">
      <header className="px-8 py-5 border-b border-border flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-citrus-green/10 flex items-center justify-center">
            <CheckSquare className="w-4 h-4 text-citrus-green" />
          </div>
          <div>
            <h1 className="text-lg font-semibold tracking-tight text-foreground">Tasks</h1>
            <p className="text-xs text-muted-foreground mt-0.5">
              {tasks.filter((t) => t.status !== 'done').length} pending · {tasks.filter((t) => t.priority === 'urgent').length} urgent
            </p>
          </div>
        </div>
        <Popover.Root open={addOpen} onOpenChange={setAddOpen}>
          <Popover.Trigger className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-primary text-primary-foreground text-xs font-medium hover:bg-primary/90 transition-colors">
            <Plus className="w-3 h-3" />
            New Task
          </Popover.Trigger>
          <Popover.Portal>
            <Popover.Content side="left" align="end" sideOffset={8} collisionPadding={16} className="w-80 p-4 glass rounded-xl border border-border shadow-lg z-50">
            <p className="text-xs font-medium text-foreground mb-3">New Task</p>
            <div className="space-y-3">
              <div className="space-y-1.5">
                <Label className="text-[10px]">Title</Label>
                <Input
                  value={newTask.title}
                  onChange={(e) => setNewTask((p) => ({ ...p, title: e.target.value }))}
                  placeholder="Task title..."
                  onKeyDown={(e) => e.key === 'Enter' && handleAddTask()}
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-[10px]">Assignee</Label>
                <Select
                  options={assigneeOptions}
                  value={newTask.assignee}
                  onChange={(e) => setNewTask((p) => ({ ...p, assignee: e.target.value }))}
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-[10px]">Due</Label>
                <Input
                  value={newTask.due}
                  onChange={(e) => setNewTask((p) => ({ ...p, due: e.target.value }))}
                  placeholder="e.g. Today, Tomorrow"
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-[10px]">Priority</Label>
                <Select
                  options={priorityOptions}
                  value={newTask.priority}
                  onChange={(e) => setNewTask((p) => ({ ...p, priority: e.target.value as TaskPriority }))}
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-[10px]">Deal (optional)</Label>
                <Input
                  value={newTask.deal}
                  onChange={(e) => setNewTask((p) => ({ ...p, deal: e.target.value }))}
                  placeholder="e.g. Acme Corp"
                />
              </div>
            </div>
            <div className="flex gap-2 mt-4 pt-3 border-t border-border">
              <Button variant="secondary" onClick={() => setAddOpen(false)} className="flex-1 text-xs">
                Cancel
              </Button>
              <Button onClick={handleAddTask} disabled={!newTask.title.trim()} className="flex-1 text-xs">
                Add Task
              </Button>
            </div>
            </Popover.Content>
          </Popover.Portal>
        </Popover.Root>
      </header>

      <div className="flex-1 overflow-y-auto hide-scrollbar px-8 py-6 space-y-6">
        {statusGroups.map((group) => {
          const groupTasks = tasks.filter((t) => t.status === group.key)
          if (groupTasks.length === 0) return null
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
                {groupTasks.map((task) => {
                  const p = priorityConfig[task.priority]
                  return (
                    <div
                      key={task.id}
                      className={`glass rounded-xl p-4 flex items-center gap-4 hover:bg-secondary/20 transition-colors ${
                        group.key === 'done' ? 'opacity-50' : ''
                      }`}
                    >
                      <button
                        onClick={() => toggleTaskStatus(task)}
                        className="shrink-0"
                        aria-label={task.status === 'done' ? 'Mark incomplete' : 'Mark complete'}
                      >
                        {group.key === 'done' ? (
                          <CheckCircle2 className="w-4 h-4 text-citrus-lime" />
                        ) : (
                          <Circle className="w-4 h-4 text-muted-foreground/40 hover:text-citrus-lime transition-colors" />
                        )}
                      </button>
                      <div className="flex-1 min-w-0">
                        <p className={`text-sm font-medium text-foreground ${group.key === 'done' ? 'line-through' : ''}`}>
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
                  )
                })}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
