import type { VercelRequest, VercelResponse } from '@vercel/node'
import { jiraFetch } from '../../lib/jira-utils'

const DEFAULT_FIELDS = ['summary', 'status', 'assignee', 'priority', 'duedate', 'project', 'labels', 'issuetype', 'description', 'created', 'updated']

function setCors(res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*')
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  setCors(res)
  if (req.method === 'OPTIONS') {
    return res.status(200).json({ ok: true })
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { domain, email, apiToken, jql, fields = DEFAULT_FIELDS, maxResults = 50, startAt = 0 } = req.body || {}
  if (!domain || !email || !apiToken) {
    return res.status(400).json({ error: 'Missing domain, email, or apiToken' })
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
      return res.status(response.status).json({ error: data.errorMessages?.[0] || 'Search failed' })
    }

    return res.status(200).json(data)
  } catch (err) {
    return res.status(500).json({ error: 'Failed to search Jira' })
  }
}
