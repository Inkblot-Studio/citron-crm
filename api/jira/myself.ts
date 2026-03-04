import type { VercelRequest, VercelResponse } from '@vercel/node'
import { jiraFetch } from '../../lib/jira-utils'

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

  const { domain, email, apiToken } = req.body || {}
  if (!domain || !email || !apiToken) {
    return res.status(400).json({ error: 'Missing domain, email, or apiToken' })
  }

  try {
    const response = await jiraFetch({ domain, email, apiToken }, '/myself')
    const data = await response.json()

    if (!response.ok) {
      return res.status(response.status).json({ error: data.errorMessages?.[0] || 'Invalid credentials' })
    }

    return res.status(200).json(data)
  } catch (err) {
    return res.status(500).json({ error: 'Failed to connect to Jira' })
  }
}
