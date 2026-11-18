import { gsap } from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'
import SplitText from 'gsap/SplitText'

import { requestScrollRefresh } from '@/util/scrollRefresh'

const queueRefresh = (state) => {
	state.cancelRefresh?.()
	state.cancelRefresh = requestScrollRefresh()
}

const sameContent = (next, previous) => {
	if (next === previous) return true
	if (typeof next !== 'object' || typeof previous !== 'object') return false
	if (!next || !previous || next.type !== previous.type) return false
	for (const key of ['innerHTML', 'textContent']) {
		if (next.props?.[key] !== previous.props?.[key]) return false
	}
	if (next.children === previous.children) return true
	return (
		Array.isArray(next.children) &&
		Array.isArray(previous.children) &&
		next.children.length === previous.children.length &&
		next.children.every((child, index) => sameContent(child, previous.children[index]))
	)
}

const clearInitialState = (el) => {
	el.removeAttribute('data-reveal-initial')
	el.style.removeProperty('visibility')
}

// Apply to individual headings/paragraphs, not containers with interactive content.
const createSplitReveal = (characters) => {
	const states = new WeakMap()
	const stop = (state) => {
		state.visibilityObserver?.disconnect()
		state.visibilityObserver = null
		state.readyObserver?.disconnect()
		state.readyObserver = null
		state.progress = state.tween?.totalProgress() || state.progress
		state.cancelRefresh?.()
		state.media?.revert()
		state.media = null
		state.tween = null
	}
	const setup = (el, binding) => {
		if (typeof window === 'undefined') return
		let state = states.get(el)
		// Unrelated parent renders must leave SplitText's DOM and animation intact.
		if (state?.media || state?.readyObserver || state?.visibilityObserver) return
		if (!state) {
			state = { content: el.innerHTML, revealed: false, progress: 0 }
			states.set(el, state)
		} else if (state.content !== el.innerHTML) {
			state.content = el.innerHTML
			state.revealed = false
			state.progress = 0
		}
		// Keep native semantics and Vue-owned controls untouched; never split <pre>.
		if (!el.textContent.trim() || el.matches('pre, a, button') || el.querySelector('pre, a, button, input, select, textarea, [tabindex]')) {
			clearInitialState(el)
			return
		}
		const pendingLayout = el.closest('[data-reveal-pending]')
		if (pendingLayout) {
			state.readyObserver = new MutationObserver(() => {
				if (pendingLayout.hasAttribute('data-reveal-pending')) return
				state.readyObserver.disconnect()
				state.readyObserver = null
				setup(el, binding)
			})
			state.readyObserver.observe(pendingLayout, { attributes: true, attributeFilter: ['data-reveal-pending'] })
			return
		}

		if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
			clearInitialState(el)
			return
		}
		// Defer layout measurements and character wrappers for text below the viewport.
		if (!state.nearViewport && 'IntersectionObserver' in window) {
			state.visibilityObserver = new IntersectionObserver(
				(entries) => {
					if (!entries.some((entry) => entry.isIntersecting)) return
					state.visibilityObserver.disconnect()
					state.visibilityObserver = null
					state.nearViewport = true
					setup(el, binding)
				},
				{ rootMargin: '200px' }
			)
			state.visibilityObserver.observe(el)
			return
		}

		gsap.registerPlugin(ScrollTrigger, SplitText)
		const { start = 'top 80%', duration = characters ? 0.6 : 1, stagger = characters ? 0.02 : 0.12, rotation = 12, delay = 0 } = binding.value || {}
		state.media = gsap.matchMedia()
		state.media.add('(prefers-reduced-motion: no-preference)', (context) => {
			let characterSplit
			let split
			// SplitText replaces its DOM before onRevert. Own animation cleanup instead
			// of letting GSAP restore transforms on detached character wrappers.
			context.ignore(() => {
				split = SplitText.create(el, {
					type: 'lines',
					mask: characters ? undefined : 'lines',
					tag: 'span',
					// Measure complete words first, retaining the font's kerning and original line breaks.
					wordsClass: 'inline',
					linesClass: 'block',
					aria: el.matches('h1, h2, h3, h4, h5, h6, [role=heading]') ? 'auto' : 'none',
					autoSplit: true,
					onRevert() {
						if (state.tween) {
							state.progress = state.tween.totalProgress()
							state.tween.scrollTrigger?.kill(false)
							state.tween.kill()
							state.tween = null
						}
						characterSplit?.revert()
						characterSplit = null
					},
					onSplit(self) {
						if (characters) {
							// Character wrappers must not wrap a second time inside a measured line.
							gsap.set(self.lines, { whiteSpace: 'nowrap' })
							characterSplit = SplitText.create(self.lines, {
								type: 'chars',
								mask: 'chars',
								tag: 'span',
								charsClass: 'inline-block',
								aria: 'none'
							})
						}
						const targets = characters ? characterSplit.chars : self.lines
						const masks = characters ? characterSplit.masks : self.masks
						// Leave room for accents and glyph overhangs without changing layout size.
						gsap.set(masks, {
							display: characters ? 'inline-block' : 'block',
							verticalAlign: 'top',
							padding: '0.2em 0.12em',
							margin: '-0.2em -0.12em'
						})
						queueRefresh(state)
						if (state.revealed) {
							clearInitialState(el)
							return
						}
						state.tween = gsap.fromTo(
							targets,
							{ yPercent: 160, rotation: characters ? rotation : 0, transformOrigin: '0% 100%' },
							{
								yPercent: 0,
								rotation: 0,
								duration,
								delay,
								stagger,
								ease: 'power3.out',
								scrollTrigger: { trigger: el, start, once: true },
								onComplete: () => {
									state.revealed = true
								}
							}
						)
						if (state.progress) state.tween.totalProgress(state.progress)
						// Reveal only after GSAP has synchronously applied the starting transform.
						clearInitialState(el)
						// Do not return the tween: SplitText would revert it after removing its targets.
					}
				})
			})
			return () => split.revert()
		})
		if (!window.matchMedia('(prefers-reduced-motion: no-preference)').matches) clearInitialState(el)
	}

	return {
		beforeMount(el) {
			el.setAttribute('data-reveal-initial', '')
			if (window.matchMedia('(prefers-reduced-motion: no-preference)').matches) el.style.visibility = 'hidden'
		},
		mounted: setup,
		beforeUpdate(el, binding, vnode, previousVNode) {
			const options = ['start', 'duration', 'stagger', 'rotation', 'delay']
			if (sameContent(vnode, previousVNode) && options.every((key) => binding.value?.[key] === binding.oldValue?.[key])) return
			const state = states.get(el)
			if (state) stop(state) // Restore original nodes before Vue patches text/v-html.
		},
		updated: setup,
		beforeUnmount(el) {
			const state = states.get(el)
			if (state) stop(state)
			states.delete(el)
		},
		getSSRProps: () => ({ 'data-reveal-initial': '' })
	}
}

export const RevealHeading = createSplitReveal(true)
export const RevealText = createSplitReveal(false)
