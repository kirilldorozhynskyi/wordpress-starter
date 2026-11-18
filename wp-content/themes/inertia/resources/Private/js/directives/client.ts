import type { ObjectDirective } from 'vue'
import Animation from '@/directives/animation.js'

type AnimationDirective = ObjectDirective<HTMLElement>
type MountArguments = Parameters<NonNullable<AnimationDirective['mounted']>>
type DirectiveState = { args: MountArguments; implementation?: AnimationDirective }

function lazyDirective(load: () => Promise<AnimationDirective>, reveal = false): AnimationDirective {
	const states = new WeakMap<HTMLElement, DirectiveState>()

	return {
		beforeMount(el) {
			if (reveal) el.setAttribute('data-reveal-initial', '')
		},
		mounted(...args) {
			const [el] = args
			const state: DirectiveState = { args }
			states.set(el, state)

			void load()
				.then((implementation) => {
					if (states.get(el) !== state) return
					state.implementation = implementation
					implementation.mounted?.(...state.args)
				})
				.catch((error) => {
					if (states.get(el) !== state) return
					if (reveal) el.removeAttribute('data-reveal-initial')
					console.error('[Animation] Failed to initialize directive.', error)
				})
		},
		beforeUpdate(el, ...args) {
			states.get(el)?.implementation?.beforeUpdate?.(el, ...args)
		},
		updated(el, binding, vnode, previousVNode) {
			const state = states.get(el)
			if (!state) return

			if (state.implementation) {
				state.implementation.updated?.(el, binding, vnode, previousVNode)
			} else {
				state.args = [el, binding, vnode, null]
			}
		},
		beforeUnmount(el, ...args) {
			const { implementation } = states.get(el) || {}
			states.delete(el)
			implementation?.beforeUnmount?.(el, ...args)
		},
	}
}

export const animationDirectives = {
	jdAnimate: Animation,
	revealMask: lazyDirective(() => import('@/directives/maskReveal.js').then((module) => module.default)),
	scrollZoomOut: lazyDirective(() => import('@/directives/scrollZoomOut.js').then((module) => module.default)),
	revealHeading: lazyDirective(() => import('@/directives/splitReveal.js').then((module) => module.RevealHeading), true),
	revealText: lazyDirective(() => import('@/directives/splitReveal.js').then((module) => module.RevealText), true),
}
