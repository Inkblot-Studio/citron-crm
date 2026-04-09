/** Same shape / storage key used by the Tasks Manager remote (`citron-jira-config`). */
export interface JiraConfig {
  domain: string
  email: string
  apiToken: string
}

export const JIRA_CONFIG_KEY = 'citron-jira-config'
