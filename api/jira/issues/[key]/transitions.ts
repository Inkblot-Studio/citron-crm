import type { VercelRequest, VercelResponse } from '@vercel/node'
import { jiraFetch } from '../../../../lib/jira-utils'

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const key = req.query.key as string
  if (!key) {
    return res.status(400).json({ error: 'Missing issue key' }).setHeader('Access-Control-Allow-Origin', '*')
  }

  if (req.method === 'OPTIONS') {
    return res.status(200).json({ ok: true }).setHeader('Access-Control-Allow-Origin', '*')
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' }).setHeader('Access-Control-Allow-Origin', '*')
  }

  const { domain, email, apiToken, action, transitionId } = req.body || {}
  if (!domain || !email || !apiToken) {
    return res.status(400).json({ error: 'Missing domain, email, or apiToken' }).setHeader('Access-Control-Allow-Origin', '*')
  }

  const creds = { domain, email, apiToken }

  try {
    if (action === 'list' || !transitionId) {
      const response = await jiraFetch(creds, `/issue/${key}/transitions`)
      const data = await response.json()
      if (!response.ok) {
        return res.status(response.status).json({ error: data.errorMessages?.[0] || 'Failed to get transitions' }).setHeader('Access-Control-Allow-Origin', '*')
      }
      return res.status(200).json({ transitions: data.transitions ?? [] }).setHeader('Access-Control-Allow-Origin', '*')
    }

    const response = await jiraFetch(creds, `/issue/${key}/transitions`, {
      method: 'POST',
      body: JSON.stringify({ transition: { id: transitionId } }),
    })

    if (!response.ok) {
      const data = await response.json().catch(() => ({}))
      return res.status(response.status).json({ error: data.errorMessages?.[0] || 'Transition failed' }).setHeader('Access-Control-Allow-Origin', '*')
    }

    return res.status(204).end()
  } catch (err) {
    return res.status(500).json({ error: 'Failed to process transition' }).setHeader('Access-Control-Allow-Origin', '*')
  }
}
