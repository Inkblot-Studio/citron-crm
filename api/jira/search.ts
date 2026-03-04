import type { VercelRequest, VercelResponse } from '@vercel/node'
import { jiraFetch } from '../_jira-utils'

const DEFAULT_FIELDS = ['summary', 'status', 'assignee', 'priority', 'duedate', 'project', 'labels', 'issuetype', 'description', 'created', 'updated']

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method === 'OPTIONS') {
    return res.status(200).json({ ok: true }).setHeader('Access-Control-Allow-Origin', '*')
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' }).setHeader('Access-Control-Allow-Origin', '*')
  }

  const { domain, email, apiToken, jql, fields = DEFAULT_FIELDS, maxResults = 50, startAt = 0 } = req.body || {}
  if (!domain || !email || !apiToken) {
    return res.status(400).json({ error: 'Missing domain, email, or apiToken' }).setHeader('Access-Control-Allow-Origin', '*')
  }

  const defaultJql = 'assignee = currentUser() ORDER BY updated DESC'
  const body = {
    jql: jql || defaultJql,
    fields,
    maxResults: Math.min(maxResults, 100),
    startAt,
  }

  try {
    const response = await jiraFetch({ domain, email, apiToken }, '/search', {
      method: 'POST',
      body: JSON.stringify(body),
    })
    const data = await response.json()

    if (!response.ok) {
      return res.status(response.status).json({ error: data.errorMessages?.[0] || 'Search failed' }).setHeader('Access-Control-Allow-Origin', '*')
    }

    return res.status(200).json(data).setHeader('Access-Control-Allow-Origin', '*')
  } catch (err) {
    return res.status(500).json({ error: 'Failed to search Jira' }).setHeader('Access-Control-Allow-Origin', '*')
  }
}
