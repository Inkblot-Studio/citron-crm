import type { JiraConfig } from './jira-types'

const API_BASE = '/api'

/** Server verifies credentials; on success, host saves config so the Tasks Manager remote can read the same localStorage key. */
export async function verifyJiraConnection(config: JiraConfig): Promise<{ ok: boolean; error?: string }> {
  const res = await fetch(`${API_BASE}/jira/myself`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ domain: config.domain, email: config.email, apiToken: config.apiToken }),
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    return { ok: false, error: err.error || 'Connection failed' }
  }
  return { ok: true }
}
