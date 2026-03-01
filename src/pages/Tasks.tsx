import { useState, useCallback } from 'react'
import { TasksView } from '@citron-systems/citron-ui'
import type { TaskWithStatus, TaskCreatePayload } from '@citron-systems/citron-ui'

const MOCK_TASKS: TaskWithStatus[] = [
  { id: '1', title: 'Follow up with Sarah Chen on proposal', company: 'Acme Corp', priority: 'high', date: 'Today', assignee: 'You', completed: false, status: 'todo' },
  { id: '2', title: 'Prepare demo for TechVentures', company: 'TechVentures', priority: 'high', date: 'Tomorrow', assignee: 'You', completed: false, status: 'in_progress' },
  { id: '3', title: 'Send contract to StartupXYZ', company: 'StartupXYZ', priority: 'medium', date: 'Feb 26', assignee: 'Mike R.', completed: false, status: 'todo' },
  { id: '4', title: 'Review GlobalTech churn signals', company: 'GlobalTech', priority: 'urgent', date: 'Feb 25', assignee: 'You', completed: false, status: 'todo' },
  { id: '5', title: 'Update pricing deck Q1', company: '', priority: 'low', date: 'Mar 1', assignee: 'Lisa K.', completed: false, status: 'in_progress' },
  { id: '6', title: 'Schedule QBR with Acme Corp', company: 'Acme Corp', priority: 'medium', date: 'Feb 28', assignee: 'You', completed: true, status: 'done' },
  { id: '7', title: 'Send onboarding docs to DataFlow', company: 'DataFlow Labs', priority: 'medium', date: 'Feb 24', assignee: 'Mike R.', completed: true, status: 'done' },
]

export function TasksPage() {
  const [tasks, setTasks] = useState<TaskWithStatus[]>(MOCK_TASKS)

  const handleTaskCreate = useCallback((payload: TaskCreatePayload) => {
    setTasks((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        title: payload.title,
        company: payload.company ?? '',
        priority: payload.priority ?? 'medium',
        date: new Date().toISOString().slice(0, 10),
        assignee: 'Me',
        completed: false,
        status: 'todo',
      },
    ])
  }, [])

  const handleTaskToggle = useCallback((taskId: string) => {
    setTasks((prev) =>
      prev.map((t) =>
        t.id === taskId
          ? { ...t, completed: !t.completed, status: (t.completed ? 'todo' : 'done') as 'todo' | 'done' }
          : t
      )
    )
  }, [])

  return (
    <div className="flex h-full flex-col overflow-y-auto p-4 sm:p-6 min-w-0">
      <TasksView
        initialTasks={tasks}
        onTaskCreate={handleTaskCreate}
        onTaskToggle={handleTaskToggle}
      />
    </div>
  )
}
