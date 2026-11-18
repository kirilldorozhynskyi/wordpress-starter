import { gsap } from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'
import { requestScrollRefresh } from '@/util/scrollRefresh'

let registered = false
const ensureRegistered = () => {
	if (!registered) {
		gsap.registerPlugin(ScrollTrigger)
		registered = true
	}
}

const maskReveal = {
	mounted(el, binding) {
		if (typeof window === 'undefined') return

		const { start = 'top 80%', duration = 1.2, ease = 'power2.out', selector, direction = 'top', stagger = 0, slide = false, fade = true } = binding.value || {}
		const targets = selector ? Array.from(el.querySelectorAll(selector)) : [el]
		if (!targets.length) return

		ensureRegistered()
		const media = gsap.matchMedia()
		let revealed = false
		media.add('(prefers-reduced-motion: no-preference)', () => {
			if (revealed) return

			const tween = gsap.timeline({
				defaults: { duration, ease, stagger },
				scrollTrigger: { trigger: el, start, once: true, invalidateOnRefresh: true },
				onComplete: () => {
					revealed = true
				}
			})

			if (slide) {
				// Stationary overflow-hidden frames mask their moving text children.
				const contents = targets.map((target) => target.firstElementChild).filter(Boolean)
				gsap.set(contents, { yPercent: 110 })
				tween.to(contents, { yPercent: 0, clearProps: 'transform' })
			} else {
				const masks = {
					top: 'inset(0% 0% 100% 0%)',
					left: 'inset(0% 100% 0% 0%)',
					bottom: 'inset(100% 0% 0% 0%)'
				}
				gsap.set(targets, { clipPath: masks[direction] || masks.top, ...(fade ? { opacity: 0.35 } : {}) })
				tween.to(targets, { clipPath: 'inset(0% 0% 0% 0%)', ...(fade ? { opacity: 1 } : {}), clearProps: 'clipPath' })
			}

			return () => tween.scrollTrigger?.kill()
		})
		el.__maskReveal = { media, cancelRefresh: requestScrollRefresh({ settle: true }) }
	},
	beforeUnmount(el) {
		el.__maskReveal?.cancelRefresh()
		el.__maskReveal?.media.revert()
		delete el.__maskReveal
	}
}

export default maskReveal

// Utility to refresh ScrollTrigger (helpful when flex components mount via Inertia)
export const refreshMaskReveal = () => {
	if (typeof window === 'undefined') return
	ensureRegistered()
	requestScrollRefresh()
}
