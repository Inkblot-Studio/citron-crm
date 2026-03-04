import type { VercelRequest, VercelResponse } from '@vercel/node'
import { corsHeaders, jiraFetch } from '../_jira-utils'

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method === 'OPTIONS') {
    return res.status(200).json({ ok: true }).setHeader('Access-Control-Allow-Origin', '*')
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' }).setHeader('Access-Control-Allow-Origin', '*')
  }

  const { domain, email, apiToken } = req.body || {}
  if (!domain || !email || !apiToken) {
    return res.status(400).json({ error: 'Missing domain, email, or apiToken' }).setHeader('Access-Control-Allow-Origin', '*')
  }

  try {
    const response = await jiraFetch({ domain, email, apiToken }, '/myself')
    const data = await response.json()

    if (!response.ok) {
      return res.status(response.status).json({ error: data.errorMessages?.[0] || 'Invalid credentials' }).setHeader('Access-Control-Allow-Origin', '*')
    }

    return res.status(200).json(data).setHeader('Access-Control-Allow-Origin', '*')
  } catch (err) {
    return res.status(500).json({ error: 'Failed to connect to Jira' }).setHeader('Access-Control-Allow-Origin', '*')
  }
}
