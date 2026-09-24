import { createInertiaApp } from '@inertiajs/vue3'
import LazyLoad from 'vanilla-lazyload'
import { ensurePrimeVue } from '@/util/primevue'
import { createInertiaVueApp, getInitialPage, needsPrimeVueOnFirstRender, resolvePage } from './inertia'
import '../css/style.css'

if (import.meta.env.DEV) {
	const spritemapClientModule = '/@vite-plugin-svg-spritemap/client'
	import(/* @vite-ignore */ spritemapClientModule).catch(() => {})
}

const id = 'app'

const lazyLoad = new LazyLoad({
	threshold: 0,
	elements_selector: '[lazy]',
	class_loading: 'lazy-loading',
	class_loaded: 'lazy-loaded',
	class_applied: 'lazy-bg-loaded',
	class_error: 'lazy-error',
})

const initialPage = getInitialPage(id)

if (initialPage) {
	createInertiaApp({
		id,
		page: initialPage,
		resolve: resolvePage,
		setup({ el, App, props, plugin }) {
			const mountApp = async () => {
				const vueApp = createInertiaVueApp({
					App,
					props,
					plugin,
					page: initialPage,
					lazyLoad,
					hydrate: Boolean(el?.childNodes.length),
				})

				if (needsPrimeVueOnFirstRender(initialPage)) {
					await ensurePrimeVue(vueApp)
				}

				vueApp.mount(el)
			}

			mountApp().catch((error) => {
				console.error('[App] Failed to bootstrap Vue app.', error)
			})
		},
		progress: {
			color: '#0d0525',
		},
	})
} else {
	console.error('[Inertia] Initial page payload was not found in the DOM.')
}
