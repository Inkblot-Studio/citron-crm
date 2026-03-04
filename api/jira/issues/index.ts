import type { VercelRequest, VercelResponse } from '@vercel/node'
import { jiraFetch } from '../../_jira-utils'

function textToAdf(text: string) {
  if (!text?.trim()) return undefined
  return {
    type: 'doc',
    version: 1,
    content: [
      {
        type: 'paragraph',
        content: [{ type: 'text', text }],
      },
    ],
  }
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method === 'OPTIONS') {
    return res.status(200).json({ ok: true }).setHeader('Access-Control-Allow-Origin', '*')
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' }).setHeader('Access-Control-Allow-Origin', '*')
  }

  const { domain, email, apiToken, projectKey, summary, description, assigneeId, priority, duedate, issuetype } = req.body || {}
  if (!domain || !email || !apiToken || !projectKey || !summary) {
    return res.status(400).json({ error: 'Missing required fields: domain, email, apiToken, projectKey, summary' }).setHeader('Access-Control-Allow-Origin', '*')
  }

  const fields: Record<string, unknown> = {
    project: { key: projectKey },
    summary,
    issuetype: { name: issuetype || 'Task' },
  }
  if (description) fields.description = textToAdf(description)
  if (assigneeId) fields.assignee = { accountId: assigneeId }
  if (priority) fields.priority = { name: priority }
  if (duedate) fields.duedate = duedate

  try {
    const response = await jiraFetch({ domain, email, apiToken }, '/issue', {
      method: 'POST',
      body: JSON.stringify({ fields }),
    })
    const data = await response.json()

    if (!response.ok) {
      const errMsg = data.errors ? Object.values(data.errors).flat().join(', ') : data.errorMessages?.[0] || 'Create failed'
      return res.status(response.status).json({ error: errMsg }).setHeader('Access-Control-Allow-Origin', '*')
    }

    return res.status(201).json({ key: data.key }).setHeader('Access-Control-Allow-Origin', '*')
  } catch (err) {
    return res.status(500).json({ error: 'Failed to create issue' }).setHeader('Access-Control-Allow-Origin', '*')
  }
}
