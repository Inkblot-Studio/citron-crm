export interface JiraCredentials {
  domain: string
  email: string
  apiToken: string
}

export function getAuthHeader(creds: JiraCredentials): string {
  const encoded = Buffer.from(`${creds.email}:${creds.apiToken}`).toString('base64')
  return `Basic ${encoded}`
}

export function corsHeaders(): Record<string, string> {
  return {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  }
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
