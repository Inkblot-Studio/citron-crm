/** Minimal class merger — mirrors cn usage without adding dependencies. */
export function cn(...parts: Array<string | undefined | false>): string {
  return parts.filter(Boolean).join(' ')
}
