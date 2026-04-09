/**
 * Dev-only handlers mirroring `api/jira/*.ts` so `npm run dev` serves the same routes Tasks Manager calls.
 */
import type { IncomingMessage, ServerResponse } from 'http'
import type { Plugin } from 'vite'

type Creds = { domain: string; email: string; apiToken: string }

function jiraFetch(creds: Creds, path: string, options: RequestInit = {}) {
  const url = `${creds.domain.replace(/\/$/, '')}/rest/api/3${path}`
  const auth = Buffer.from(`${creds.email}:${creds.apiToken}`).toString('base64')
  return fetch(url, {
    ...options,
    headers: {
      Authorization: `Basic ${auth}`,
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
    content: [{ type: 'paragraph', content: [{ type: 'text', text }] }],
  }
}

const DEFAULT_FIELDS = [
  'summary',
  'status',
  'assignee',
  'priority',
  'duedate',
  'project',
  'labels',
  'issuetype',
  'description',
  'created',
  'updated',
]

function readBody(req: IncomingMessage): Promise<string> {
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = []
    req.on('data', (c: Buffer) => chunks.push(c))
    req.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')))
    req.on('error', reject)
  })
}

function sendJson(res: ServerResponse, status: number, body: unknown) {
  res.statusCode = status
  res.setHeader('Content-Type', 'application/json')
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.end(JSON.stringify(body))
}

export function jiraApiDevPlugin(): Plugin {
  return {
    name: 'citron-jira-api-dev',
    configureServer(server) {
      server.middlewares.use(async (req, res: ServerResponse, next) => {
        const pathname = req.url?.split('?')[0] ?? ''
        if (!pathname.startsWith('/api/jira')) {
          return next()
        }

        res.setHeader('Access-Control-Allow-Origin', '*')
        if (req.method === 'OPTIONS') {
          res.statusCode = 204
          return res.end()
        }

        try {
          const raw = await readBody(req as IncomingMessage)
          const body = (() => {
            try {
              return JSON.parse(raw || '{}') as Record<string, unknown>
            } catch {
              return {}
            }
          })()

          // POST /api/jira/myself
          if (pathname === '/api/jira/myself' && req.method === 'POST') {
            const domain = body.domain as string | undefined
            const email = body.email as string | undefined
            const apiToken = body.apiToken as string | undefined
            if (!domain || !email || !apiToken) {
              return sendJson(res, 400, { error: 'Missing domain, email, or apiToken' })
            }
            const url = `${domain.replace(/\/$/, '')}/rest/api/3/myself`
            const auth = Buffer.from(`${email}:${apiToken}`).toString('base64')
            const response = await fetch(url, {
              headers: { Authorization: `Basic ${auth}`, Accept: 'application/json' },
            })
            const data = (await response.json()) as { errorMessages?: string[] }
            if (!response.ok) {
              return sendJson(res, response.status, { error: data.errorMessages?.[0] || 'Invalid credentials' })
            }
            return sendJson(res, 200, data)
          }

          // POST /api/jira/search
          if (pathname === '/api/jira/search' && req.method === 'POST') {
            const domain = body.domain as string
            const email = body.email as string
            const apiToken = body.apiToken as string
            if (!domain || !email || !apiToken) {
              return sendJson(res, 400, { error: 'Missing domain, email, or apiToken' })
            }
            const creds = { domain, email, apiToken }
            const defaultJql = 'assignee = currentUser() ORDER BY updated DESC'
            const jql = (body.jql as string) || defaultJql
            const fields = (body.fields as string[]) || DEFAULT_FIELDS
            const maxResults = Math.min(Number(body.maxResults) || 50, 100)
            const payload: Record<string, unknown> = { jql, fields, maxResults }
            if (body.nextPageToken) payload.nextPageToken = body.nextPageToken
            const response = await jiraFetch(creds, '/search/jql', {
              method: 'POST',
              body: JSON.stringify(payload),
            })
            const data = await response.json()
            if (!response.ok) {
              return sendJson(res, response.status, { error: data.errorMessages?.[0] || 'Search failed' })
            }
            return sendJson(res, 200, data)
          }

          // POST /api/jira/projects
          if (pathname === '/api/jira/projects' && req.method === 'POST') {
            const domain = body.domain as string
            const email = body.email as string
            const apiToken = body.apiToken as string
            if (!domain || !email || !apiToken) {
              return sendJson(res, 400, { error: 'Missing domain, email, or apiToken' })
            }
            const response = await jiraFetch({ domain, email, apiToken }, '/project')
            const data = await response.json()
            if (!response.ok) {
              return sendJson(res, response.status, { error: data.errorMessages?.[0] || 'Failed to fetch projects' })
            }
            const arr = Array.isArray(data) ? data : data.values ?? []
            const projects = arr.map((p: { key: string; name: string; id: string }) => ({
              key: p.key,
              name: p.name,
              id: p.id,
            }))
            return sendJson(res, 200, { projects })
          }

          // POST /api/jira/users/assignable
          if (pathname === '/api/jira/users/assignable' && req.method === 'POST') {
            const domain = body.domain as string
            const email = body.email as string
            const apiToken = body.apiToken as string
            const projectKey = body.projectKey as string
            if (!domain || !email || !apiToken || !projectKey) {
              return sendJson(res, 400, { error: 'Missing domain, email, apiToken, or projectKey' })
            }
            const creds = { domain, email, apiToken }
            const response = await jiraFetch(
              creds,
              `/user/assignable/search?project=${encodeURIComponent(projectKey)}&maxResults=50`
            )
            const data = await response.json()
            if (!response.ok) {
              return sendJson(res, response.status, { error: data.errorMessages?.[0] || 'Failed to fetch assignable users' })
            }
            const users = (Array.isArray(data) ? data : []).map((u: { accountId: string; displayName: string }) => ({
              id: u.accountId,
              displayName: u.displayName,
            }))
            return sendJson(res, 200, { users })
          }

          // POST /api/jira/issues (create)
          if (pathname === '/api/jira/issues' && req.method === 'POST') {
            const domain = body.domain as string
            const email = body.email as string
            const apiToken = body.apiToken as string
            const projectKey = body.projectKey as string
            const summary = body.summary as string
            if (!domain || !email || !apiToken || !projectKey || !summary) {
              return sendJson(res, 400, {
                error: 'Missing required fields: domain, email, apiToken, projectKey, summary',
              })
            }
            const fields: Record<string, unknown> = {
              project: { key: projectKey },
              summary,
              issuetype: { name: (body.issuetype as string) || 'Task' },
            }
            const description = body.description as string | undefined
            if (description) fields.description = textToAdf(description)
            if (body.assigneeId) fields.assignee = { accountId: body.assigneeId as string }
            if (body.priority) fields.priority = { name: body.priority as string }
            if (body.duedate) fields.duedate = body.duedate
            const response = await jiraFetch({ domain, email, apiToken }, '/issue', {
              method: 'POST',
              body: JSON.stringify({ fields }),
            })
            const data = await response.json()
            if (!response.ok) {
              const errMsg = data.errors
                ? Object.values(data.errors as Record<string, unknown>)
                    .flat()
                    .join(', ')
                : data.errorMessages?.[0] || 'Create failed'
              return sendJson(res, response.status, { error: errMsg })
            }
            return sendJson(res, 201, { key: data.key })
          }

          const transMatch = pathname.match(/^\/api\/jira\/issues\/([^/]+)\/transitions$/)
          if (transMatch && req.method === 'POST') {
            const key = transMatch[1]
            const domain = body.domain as string
            const email = body.email as string
            const apiToken = body.apiToken as string
            const action = body.action as string | undefined
            const transitionId = body.transitionId as string | undefined
            if (!domain || !email || !apiToken) {
              return sendJson(res, 400, { error: 'Missing domain, email, or apiToken' })
            }
            const creds = { domain, email, apiToken }
            if (action === 'list' || !transitionId) {
              const response = await jiraFetch(creds, `/issue/${key}/transitions`)
              const data = await response.json()
              if (!response.ok) {
                return sendJson(res, response.status, { error: data.errorMessages?.[0] || 'Failed to get transitions' })
              }
              return sendJson(res, 200, { transitions: data.transitions ?? [] })
            }
            const response = await jiraFetch(creds, `/issue/${key}/transitions`, {
              method: 'POST',
              body: JSON.stringify({ transition: { id: transitionId } }),
            })
            if (!response.ok) {
              const data = await response.json().catch(() => ({}))
              return sendJson(res, response.status, { error: data.errorMessages?.[0] || 'Transition failed' })
            }
            res.statusCode = 204
            return res.end()
          }

          const issueMatch = pathname.match(/^\/api\/jira\/issues\/([^/]+)$/)
          if (issueMatch && req.method === 'PUT') {
            const key = issueMatch[1]
            const domain = body.domain as string
            const email = body.email as string
            const apiToken = body.apiToken as string
            if (!domain || !email || !apiToken) {
              return sendJson(res, 400, { error: 'Missing domain, email, or apiToken' })
            }
            const fields: Record<string, unknown> = {}
            if (body.summary !== undefined) fields.summary = body.summary
            if (body.description !== undefined)
              fields.description = body.description ? textToAdf(body.description as string) : null
            if (body.assigneeId !== undefined)
              fields.assignee = body.assigneeId ? { accountId: body.assigneeId as string } : null
            if (body.priority !== undefined) fields.priority = body.priority ? { name: body.priority as string } : null
            if (body.duedate !== undefined) fields.duedate = body.duedate || null
            if (Object.keys(fields).length === 0) {
              return sendJson(res, 400, { error: 'No fields to update' })
            }
            const response = await jiraFetch({ domain, email, apiToken }, `/issue/${key}`, {
              method: 'PUT',
              body: JSON.stringify({ fields }),
            })
            if (!response.ok) {
              const data = await response.json().catch(() => ({}))
              const errMsg = data.errors
                ? Object.values(data.errors as Record<string, unknown>)
                    .flat()
                    .join(', ')
                : data.errorMessages?.[0] || 'Update failed'
              return sendJson(res, response.status, { error: errMsg })
            }
            res.statusCode = 204
            return res.end()
          }

          return next()
        } catch (e) {
          return sendJson(res, 500, { error: e instanceof Error ? e.message : 'Jira proxy error' })
        }
      })
    },
  }
}
