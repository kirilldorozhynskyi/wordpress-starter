import { gsap } from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'
import { requestScrollRefresh } from '@/util/scrollRefresh'

let registered = false

const ensureRegistered = () => {
	if (registered) return

	gsap.registerPlugin(ScrollTrigger)
	registered = true
}

export default {
	mounted(el, binding) {
		if (typeof window === 'undefined') return

		const { from = 1.4, to = 1, start = 'top bottom', end = 'bottom top', scrub = true } = binding.value || {}

		if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
			gsap.set(el, { scale: to })
			return
		}

		ensureRegistered()

		el.__scrollZoomOut = gsap.fromTo(
			el,
			{ scale: from, transformOrigin: 'center center' },
			{
				scale: to,
				ease: 'none',
				scrollTrigger: {
					trigger: el.parentElement || el,
					start,
					end,
					scrub,
					invalidateOnRefresh: true
				}
			}
		)

		el.__cancelZoomRefresh = requestScrollRefresh({ settle: true })
	},
	beforeUnmount(el) {
		el.__cancelZoomRefresh?.()
		delete el.__cancelZoomRefresh
		el.__scrollZoomOut?.scrollTrigger?.kill()
		el.__scrollZoomOut?.kill()
		gsap.set(el, { clearProps: 'transform,transformOrigin' })
		delete el.__scrollZoomOut
	}
}
