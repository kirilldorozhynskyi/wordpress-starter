const cleanups = new WeakMap()

const isInViewport = (el) => {
	const rect = el.getBoundingClientRect()
	const viewportHeight = window.innerHeight || document.documentElement.clientHeight

	return rect.bottom > 0 && rect.top < viewportHeight
}

export default {
	mounted(el, binding) {
		if (!('IntersectionObserver' in window) || window.matchMedia('(prefers-reduced-motion: reduce)').matches || isInViewport(el)) return

		const { effect = 'fade-up', once = false, delay = 0, duration = 2000 } = binding.value || {}
		let timer
		const reset = () => {
			el.classList.remove('jd-init', 'jd-animate', effect)
			el.style.transitionDelay = initialDelay
			el.style.transitionDuration = initialDuration
		}
		const { transitionDelay: initialDelay, transitionDuration: initialDuration } = el.style
		const prepare = () => {
			el.style.transitionDelay = `${delay}ms`
			el.style.transitionDuration = `${duration}ms`
			el.classList.add('jd-init', effect)
		}

		prepare()
		const observer = new IntersectionObserver(([entry]) => {
			if (!entry.isIntersecting) {
				if (!once) {
					window.clearTimeout(timer)
					reset()
					prepare()
				}
				return
			}
			if (!el.classList.contains('jd-init') || el.classList.contains('jd-animate')) return

			el.classList.add('jd-animate')
			timer = window.setTimeout(reset, Number(delay) + Number(duration))
			if (once) observer.disconnect()
		})

		observer.observe(el)
		cleanups.set(el, () => {
			observer.disconnect()
			window.clearTimeout(timer)
			reset()
		})
	},
	beforeUnmount(el) {
		cleanups.get(el)?.()
		cleanups.delete(el)
	}
}
