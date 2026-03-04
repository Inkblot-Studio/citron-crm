import type { VercelRequest, VercelResponse } from '@vercel/node'


export interface JiraCredentials {
  domain: string
  email: string
  apiToken: string
}

function base64Encode(str: string): string {
  return Buffer.from(str, 'utf-8').toString('base64')
}

export function getAuthHeader(creds: JiraCredentials): string {
  return `Basic ${base64Encode(`${creds.email}:${creds.apiToken}`)}`
}

export async function jiraFetch(
  creds: JiraCredentials,
  path: string,
  options: RequestInit = {}
): Promise<Response> {
  const url = `${creds.domain.replace(/\/$/, '')}/rest/api/3${path}`
  const auth = getAuthHeader(creds)
  return fetch(url, {
    ...options,
    headers: {
      Authorization: auth,
      'Content-Type': 'application/json',
      Accept: 'application/json',
      ...options.headers,
    },
  })
}

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

  const { domain, email, apiToken, projectKey, summary, description, assigneeId, priority, duedate, issuetype } = req.body || {}
  if (!domain || !email || !apiToken || !projectKey || !summary) {
    return res.status(400).json({ error: 'Missing required fields: domain, email, apiToken, projectKey, summary' })
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
      return res.status(response.status).json({ error: errMsg })
    }

    return res.status(201).json({ key: data.key })
  } catch (err) {
    return res.status(500).json({ error: 'Failed to create issue' })
  }
}
