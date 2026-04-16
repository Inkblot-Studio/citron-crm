/**
 * AppLayout (citron-ui) renders route children in a scrollable main/canvas region.
 * After fast navigations (e.g. into Settings while another module was scrolled), that
 * region—or `<main>` itself—can keep a non-zero scrollTop; reset every likely root.
 */
export function resetCitronCanvasScroll(): void {
  const seen = new Set<HTMLElement>()

  const push = (el: Element | null | undefined) => {
    if (el instanceof HTMLElement) seen.add(el)
  }

  document
    .querySelectorAll<HTMLElement>('main section[data-tour="canvas"], main [data-tour="canvas"]')
    .forEach((el) => push(el))

  document.querySelectorAll<HTMLElement>('[data-citron-settings-scroll]').forEach((el) => push(el))

  push(document.querySelector('main'))

  for (const el of seen) {
    el.scrollTop = 0
  }
}
