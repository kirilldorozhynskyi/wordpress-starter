// @ts-nocheck
import '../Scss/app.scss'

import { createApp, h, DefineComponent, App as VueApp } from 'vue'
import { createInertiaApp, Link, Head } from '@inertiajs/vue3'
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers'
import { InertiaProgress } from '@inertiajs/progress'
import LazyLoad from 'vanilla-lazyload'
import { createI18n } from 'vue-i18n'

import Layout from './Layout/Layout.vue'
import Image from './Components/Utils/Image.vue'

import i18nConfig from './util/i18n.ts'
const i18n = createI18n(i18nConfig)

const lazyLoad = new LazyLoad({
	threshold: 0,
	elements_selector: '[lazy]',
	class_loading: 'lazy-loading',
	class_loaded: 'lazy-loaded',
	class_applied: 'lazy-bg-loaded',
	class_error: 'lazy-error',
})

// Initialize Inertia progress
InertiaProgress.init()

// Define the Inertia App
createInertiaApp({
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
			.use(i18n)
			.component('Link', Link)
			.component('Head', Head)
			.component('Image', Image)
			.provide('lazyLoad', lazyLoad)
			.mount(el)
	},

	progress: {
		color: '#4B5563',
	},
})
