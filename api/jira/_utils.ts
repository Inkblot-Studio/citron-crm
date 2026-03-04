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
