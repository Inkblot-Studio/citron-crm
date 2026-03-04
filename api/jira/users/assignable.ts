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

  const { domain, email, apiToken, projectKey } = req.body || {}
  if (!domain || !email || !apiToken || !projectKey) {
    return res.status(400).json({ error: 'Missing domain, email, apiToken, or projectKey' })
  }

  const creds = { domain, email, apiToken }

  try {
    const response = await jiraFetch(
      creds,
      `/user/assignable/search?project=${encodeURIComponent(projectKey)}&maxResults=50`
    )
    const data = await response.json()

    if (!response.ok) {
      return res
        .status(response.status)
        .json({ error: data.errorMessages?.[0] || 'Failed to fetch assignable users' })
    }

    const users = (Array.isArray(data) ? data : []).map(
      (u: { accountId: string; displayName: string }) => ({
        id: u.accountId,
        displayName: u.displayName,
      })
    )
    return res.status(200).json({ users })
  } catch (err) {
    return res.status(500).json({ error: 'Failed to fetch assignable users' })
  }
}
