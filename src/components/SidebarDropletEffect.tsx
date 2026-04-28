import { useEffect } from 'react'

/**
 * Animated puddle indicator for AppSidebar (citron-ui).
 *
 * - Appends a single absolutely-positioned element inside [data-tour="sidebar"].
 * - Wobbles in place while a module is selected (water-blob breathing).
 * - On active item change, stretches into a droplet and falls or rises onto the next button.
 *
 * Requires the sidebar (and AppLayout) to remain mounted across route changes —
 * App.tsx lifts AppLayout above <Routes> so the sidebar DOM persists.
 */
export function SidebarDropletEffect() {
  useEffect(() => {
    const sidebar = document.querySelector<HTMLElement>('[data-tour="sidebar"]')
    if (!sidebar) return

    const droplet = document.createElement('div')
    droplet.className = 'citron-sidebar-droplet'
    droplet.setAttribute('aria-hidden', 'true')
    sidebar.appendChild(droplet)

    let prevTop: number | null = null
    let cancelled = false
    let runningAnim: Animation | null = null

    const findActive = () =>
      sidebar.querySelector<HTMLButtonElement>('button[aria-current="page"]')

    const positionTo = (btn: HTMLButtonElement, animateTravel: boolean) => {
      const sbRect = sidebar.getBoundingClientRect()
      const r = btn.getBoundingClientRect()
      const top = r.top - sbRect.top
      const left = r.left - sbRect.left

      droplet.style.width = `${r.width}px`
      droplet.style.height = `${r.height}px`
      droplet.style.left = `${left}px`
      droplet.style.opacity = '1'

      if (prevTop === null || !animateTravel || prevTop === top) {
        if (runningAnim) {
          runningAnim.cancel()
          runningAnim = null
        }
        droplet.classList.remove('citron-sidebar-droplet--travel')
        droplet.style.top = `${top}px`
        prevTop = top
        return
      }

      const distance = top - prevTop
      const goingDown = distance > 0
      const duration = Math.min(720, 360 + Math.abs(distance) * 1.5)

      droplet.classList.add('citron-sidebar-droplet--travel')

      if (runningAnim) runningAnim.cancel()

      const keyframes: Keyframe[] = [
        {
          top: `${prevTop}px`,
          borderRadius: '36% 36% 38% 38% / 36% 36% 38% 38%',
          transform: 'scaleX(1) scaleY(1)',
        },
        {
          offset: 0.3,
          top: `${prevTop + distance * 0.18}px`,
          borderRadius: goingDown
            ? '46% 46% 50% 50% / 30% 30% 70% 70%'
            : '50% 50% 46% 46% / 70% 70% 30% 30%',
          transform: 'scaleX(0.55) scaleY(1.7)',
        },
        {
          offset: 0.78,
          top: `${top}px`,
          borderRadius: '40% 40% 36% 36% / 40% 40% 32% 32%',
          transform: 'scaleX(1.18) scaleY(0.78)',
        },
        {
          top: `${top}px`,
          borderRadius: '36% 36% 38% 38% / 36% 36% 38% 38%',
          transform: 'scaleX(1) scaleY(1)',
        },
      ]

      const anim = droplet.animate(keyframes, {
        duration,
        easing: 'cubic-bezier(0.5, 0.05, 0.2, 1)',
        fill: 'forwards',
      })
      runningAnim = anim

      anim.onfinish = () => {
        if (cancelled) return
        droplet.style.top = `${top}px`
        droplet.classList.remove('citron-sidebar-droplet--travel')
        if (runningAnim === anim) runningAnim = null
      }

      prevTop = top
    }

    const raf = requestAnimationFrame(() => {
      const initial = findActive()
      if (initial) positionTo(initial, false)
    })

    const observer = new MutationObserver(() => {
      const btn = findActive()
      if (!btn) {
        droplet.style.opacity = '0'
        prevTop = null
        return
      }
      positionTo(btn, true)
    })
    observer.observe(sidebar, {
      subtree: true,
      attributes: true,
      attributeFilter: ['aria-current'],
    })

    const onResize = () => {
      const btn = findActive()
      if (btn) positionTo(btn, false)
    }
    window.addEventListener('resize', onResize)

    return () => {
      cancelled = true
      cancelAnimationFrame(raf)
      observer.disconnect()
      window.removeEventListener('resize', onResize)
      if (runningAnim) runningAnim.cancel()
      droplet.remove()
    }
  }, [])

  return null
}
