// @ts-nocheck
import '../Scss/app.scss'

import { createApp, h, DefineComponent, App as VueApp } from 'vue'
import { createInertiaApp, Link, Head } from '@inertiajs/vue3'
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers'
import { InertiaProgress } from '@inertiajs/progress'

import Layout from './Layout/Layout.vue'

// Initialize Inertia progress
InertiaProgress.init()

// Define the Inertia App
createInertiaApp({
	title: (title) => `${title}`,

	resolve: (name) => {
		const page = resolvePageComponent(`./Pages/${name}.vue`, import.meta.glob('./Pages/**/*.vue'))
		page.then((module) => {
			module.default.layout = module.default.layout || Layout
		})
		return page
	},
	setup({ el, App, props, plugin }) {
		createApp({ render: () => h(App, props) })
			.use(plugin)
			.component('Link', Link)
			.component('Head', Head)

			.mount(el)
	},

	progress: {
		color: '#4B5563',
	},
})
