import type { IncomingMessage, ServerResponse } from 'http'
import type { Plugin } from 'vite'

/** Mirrors `api/jira/myself.ts` so `npm run dev` can verify Jira without `vercel dev`. */
export function jiraMyselfDevPlugin(): Plugin {
  return {
    name: 'citron-jira-myself-dev',
    configureServer(server) {
      server.middlewares.use(async (req, res: ServerResponse, next) => {
        const pathname = req.url?.split('?')[0] ?? ''
        if (pathname !== '/api/jira/myself') {
          return next()
        }
        res.setHeader('Access-Control-Allow-Origin', '*')
        if (req.method === 'OPTIONS') {
          res.statusCode = 204
          return res.end()
        }
        if (req.method !== 'POST') {
          res.statusCode = 405
          res.setHeader('Content-Type', 'application/json')
          return res.end(JSON.stringify({ error: 'Method not allowed' }))
        }
        try {
          const raw = await readBody(req as IncomingMessage)
          const body = JSON.parse(raw || '{}') as { domain?: string; email?: string; apiToken?: string }
          const { domain, email, apiToken } = body
          if (!domain || !email || !apiToken) {
            res.statusCode = 400
            res.setHeader('Content-Type', 'application/json')
            return res.end(JSON.stringify({ error: 'Missing domain, email, or apiToken' }))
          }
          const url = `${domain.replace(/\/$/, '')}/rest/api/3/myself`
          const auth = Buffer.from(`${email}:${apiToken}`).toString('base64')
          const response = await fetch(url, {
            headers: {
              Authorization: `Basic ${auth}`,
              Accept: 'application/json',
            },
          })
          const data = (await response.json()) as { errorMessages?: string[] }
          if (!response.ok) {
            res.statusCode = response.status
            res.setHeader('Content-Type', 'application/json')
            return res.end(JSON.stringify({ error: data.errorMessages?.[0] || 'Invalid credentials' }))
          }
          res.statusCode = 200
          res.setHeader('Content-Type', 'application/json')
          return res.end(JSON.stringify(data))
        } catch (e) {
          res.statusCode = 500
          res.setHeader('Content-Type', 'application/json')
          return res.end(JSON.stringify({ error: e instanceof Error ? e.message : 'Failed to connect to Jira' }))
        }
      })
    },
  }
}

function readBody(req: IncomingMessage): Promise<string> {
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = []
    req.on('data', (c: Buffer) => chunks.push(c))
    req.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')))
    req.on('error', reject)
  })
}
