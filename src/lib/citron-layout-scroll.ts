/**
 * AppLayout (citron-ui) renders route children inside
 * `<main><section data-tour="canvas" class="... overflow-y-auto">`.
 * Nested scroll regions (e.g. Settings) can leave this section scrolled; reset when needed.
 */
export function resetCitronCanvasScroll(): void {
  const el = document.querySelector<HTMLElement>('main section[data-tour="canvas"]')
  if (el) el.scrollTop = 0
}
