// @ts-nocheck
import '../Scss/app.css'

import { createApp, h, defineAsyncComponent } from 'vue'
import { createInertiaApp, Link, Head } from '@inertiajs/vue3'
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers'

import LazyLoad from 'vanilla-lazyload'
import { createI18n } from 'vue-i18n'

import Layout from './Layout/Layout.vue'

const Image = defineAsyncComponent(() => import('@/Components/Utils/Image.vue'))
const Button = defineAsyncComponent(() => import('@/Components/Utils/Button.vue'))
const SvgIcon = defineAsyncComponent(() => import('@/Components/Utils/SvgIcon.vue'))

import i18nConfig from './util/i18n'

const i18n = createI18n(i18nConfig)

const lazyLoad = new LazyLoad({
	threshold: 0,
	elements_selector: '[lazy]',
	class_loading: 'lazy-loading',
	class_loaded: 'lazy-loaded',
	class_applied: 'lazy-bg-loaded',
	class_error: 'lazy-error',
})

// Define the Inertia App
createInertiaApp({
	resolve: async (name) => {
		const page = await resolvePageComponent(`./Pages/${name}.vue`, import.meta.glob('./Pages/**/*.vue'))
		page.default.layout ??= Layout
		return page
	},
	setup({ el, App, props, plugin }) {
		createApp({ render: () => h(App, props) })
			.use(plugin)
			.use(i18n)
			.component('Link', Link)
			.component('Head', Head)
			.component('Image', Image)
			.component('Button', Button)
			.component('SvgIcon', SvgIcon)

			.provide('lazyLoad', lazyLoad)
			.mount(el)
	},
	progress: {
		color: '#0d0525',
	},
})
