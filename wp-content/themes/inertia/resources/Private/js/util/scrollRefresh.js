import ScrollTrigger from 'gsap/ScrollTrigger'

const pending = new Set()
const settling = new Set()
let frame = 0
let timer = 0

const refresh = () => {
	ScrollTrigger.sort()
	ScrollTrigger.refresh()
}

// One global measurement per frame, regardless of how many sections request it.
export const requestScrollRefresh = ({ settle = false } = {}) => {
	if (typeof window === 'undefined') return () => {}
	const request = {}
	pending.add(request)
	if (!frame) {
		frame = requestAnimationFrame(() => {
			frame = 0
			pending.clear()
			refresh()
		})
	}
	if (settle) {
		settling.add(request)
		clearTimeout(timer)
		timer = setTimeout(() => {
			timer = 0
			settling.clear()
			refresh()
		}, 200)
	}
	return () => {
		pending.delete(request)
		settling.delete(request)
		if (!pending.size) {
			cancelAnimationFrame(frame)
			frame = 0
		}
		if (!settling.size) {
			clearTimeout(timer)
			timer = 0
		}
	}
}
