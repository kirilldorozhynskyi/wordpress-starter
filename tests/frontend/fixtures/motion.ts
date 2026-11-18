import type { Page } from '@inertiajs/core'
import { createInertiaApp } from '@inertiajs/vue3'
import { renderToString } from '@vue/server-renderer'
import { animationDirectives } from '@/directives/client'
import { createInertiaVueApp } from '@/inertia'
import MotionPage from './motion.vue'
import '../../../wp-content/themes/inertia/resources/Private/css/animations.css'

export const renderMotion = (page: Page) =>
	createInertiaApp({
		page,
		render: renderToString,
		resolve: () => MotionPage,
		setup: ({ App, props, plugin }) => createInertiaVueApp({ App, props, plugin, page, ssr: true }),
	})

if (!import.meta.env.SSR) {
	Object.assign(window, {
		countScrollTriggers: async () => {
			const { default: ScrollTrigger } = await import('gsap/ScrollTrigger')
			return ScrollTrigger.getAll().length
		},
	})

	void createInertiaApp({
		resolve: () => MotionPage,
		setup({ App, props, plugin, el }) {
			createInertiaVueApp({
				App,
				props,
				plugin,
				page: props.initialPage,
				hydrate: props.serverRendered,
				directives: animationDirectives,
			}).mount(el)
		},
	})
}
