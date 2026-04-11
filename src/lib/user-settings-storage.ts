export const PROFILE_KEY = 'citron-settings-profile'
export const NOTIFICATIONS_KEY = 'citron-settings-notifications'
export const SECURITY_KEY = 'citron-settings-security'
export const APPEARANCE_KEY = 'citron-settings-appearance'
export const API_KEYS_KEY = 'citron-settings-api-keys'

export type UserProfileSettings = {
  displayName: string
  email: string
  role: string
  timezone: string
  language: string
}

export type NotificationSettings = {
  emailProductUpdates: boolean
  emailDigest: boolean
  mentionAlerts: boolean
  campaignPerformance: boolean
  desktopPush: boolean
}

export type SecuritySettings = {
  sessionTimeout: string
  twoFactorEnabled: boolean
}

export type AppearanceSettings = {
  density: 'comfortable' | 'compact'
  reduceMotion: boolean
}

export type ApiKeyRecord = {
  id: string
  name: string
  prefix: string
  createdAt: string
}

const defaultProfile: UserProfileSettings = {
  displayName: 'Alex Operator',
  email: 'alex@citronos.io',
  role: 'Revenue Operations Lead',
  timezone: 'America/New_York',
  language: 'en',
}

const defaultNotifications: NotificationSettings = {
  emailProductUpdates: true,
  emailDigest: true,
  mentionAlerts: true,
  campaignPerformance: false,
  desktopPush: false,
}

const defaultSecurity: SecuritySettings = {
  sessionTimeout: '480',
  twoFactorEnabled: false,
}

const defaultAppearance: AppearanceSettings = {
  density: 'comfortable',
  reduceMotion: false,
}

function safeParse<T>(raw: string | null, fallback: T): T {
  if (!raw) return fallback
  try {
    return { ...fallback, ...JSON.parse(raw) } as T
  } catch {
    return fallback
  }
}

export function loadProfile(): UserProfileSettings {
  return safeParse(localStorage.getItem(PROFILE_KEY), defaultProfile)
}

export function saveProfile(v: UserProfileSettings) {
  localStorage.setItem(PROFILE_KEY, JSON.stringify(v))
}

export function loadNotifications(): NotificationSettings {
  return safeParse(localStorage.getItem(NOTIFICATIONS_KEY), defaultNotifications)
}

export function saveNotifications(v: NotificationSettings) {
  localStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(v))
}

export function loadSecurity(): SecuritySettings {
  return safeParse(localStorage.getItem(SECURITY_KEY), defaultSecurity)
}

export function saveSecurity(v: SecuritySettings) {
  localStorage.setItem(SECURITY_KEY, JSON.stringify(v))
}

export function loadAppearance(): AppearanceSettings {
  return safeParse(localStorage.getItem(APPEARANCE_KEY), defaultAppearance)
}

export function saveAppearance(v: AppearanceSettings) {
  localStorage.setItem(APPEARANCE_KEY, JSON.stringify(v))
}

export function loadApiKeys(): ApiKeyRecord[] {
  return safeParse<ApiKeyRecord[]>(localStorage.getItem(API_KEYS_KEY), [])
}

export function saveApiKeys(keys: ApiKeyRecord[]) {
  localStorage.setItem(API_KEYS_KEY, JSON.stringify(keys))
}

export function exportAllSettingsBlob(jiraDomain?: string | null): Blob {
  const payload = {
    exportedAt: new Date().toISOString(),
    profile: loadProfile(),
    notifications: loadNotifications(),
    security: loadSecurity(),
    appearance: loadAppearance(),
    jiraConnected: Boolean(jiraDomain),
    jiraDomain: jiraDomain ?? null,
  }
  return new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' })
}
