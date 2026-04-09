import { createContext, useCallback, useContext, useState, type ReactNode } from 'react'
import type { JiraConfig } from './jira-types'
import { JIRA_CONFIG_KEY } from './jira-types'

interface JiraContextType {
  config: JiraConfig | null
  setConfig: (config: JiraConfig | null) => void
  isConnected: boolean
  saveConfig: (config: JiraConfig) => void
  clearConfig: () => void
}

const JiraContext = createContext<JiraContextType | null>(null)

export function useJiraConfig() {
  const ctx = useContext(JiraContext)
  if (!ctx) throw new Error('useJiraConfig must be used within JiraProvider')
  return ctx
}

function loadConfig(): JiraConfig | null {
  try {
    const raw = localStorage.getItem(JIRA_CONFIG_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw) as JiraConfig
    if (parsed?.domain && parsed?.email && parsed?.apiToken) return parsed
    return null
  } catch {
    return null
  }
}

export function JiraProvider({ children }: { children: ReactNode }) {
  const [config, setConfigState] = useState<JiraConfig | null>(() => loadConfig())

  const setConfig = useCallback((c: JiraConfig | null) => {
    setConfigState(c)
    if (c) localStorage.setItem(JIRA_CONFIG_KEY, JSON.stringify(c))
    else localStorage.removeItem(JIRA_CONFIG_KEY)
  }, [])

  const saveConfig = useCallback((c: JiraConfig) => {
    localStorage.setItem(JIRA_CONFIG_KEY, JSON.stringify(c))
    setConfigState(c)
  }, [])

  const clearConfig = useCallback(() => {
    localStorage.removeItem(JIRA_CONFIG_KEY)
    setConfigState(null)
  }, [])

  return (
    <JiraContext.Provider value={{ config, setConfig, isConnected: !!config, saveConfig, clearConfig }}>
      {children}
    </JiraContext.Provider>
  )
}
