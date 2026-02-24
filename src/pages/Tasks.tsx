import { useState, useCallback } from 'react'
import { TasksView } from '@citron-systems/citron-ui'
import type { TaskWithStatus, TaskCreatePayload } from '@citron-systems/citron-ui'

const MOCK_TASKS: TaskWithStatus[] = [
  {
    id: '1',
    title: 'Review Q4 forecast',
    company: 'Acme Corp',
    priority: 'high',
    date: '2025-01-15',
    assignee: 'Alex',
    completed: false,
    status: 'todo',
  },
  {
    id: '2',
    title: 'Send contract to Legal',
    company: 'TechVentures',
    priority: 'medium',
    date: '2025-01-14',
    assignee: 'Jordan',
    completed: false,
    status: 'in_progress',
  },
  {
    id: '3',
    title: 'Update pipeline dashboard',
    company: 'Internal',
    priority: 'low',
    date: '2025-01-13',
    assignee: 'Alex',
    completed: true,
    status: 'done',
  },
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
        t.id === taskId ? { ...t, completed: true, status: 'done' as const } : t
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
