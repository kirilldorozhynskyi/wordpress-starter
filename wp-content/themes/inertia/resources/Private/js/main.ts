import { createInertiaApp } from '@inertiajs/vue3'
import { ensurePrimeVue } from '@/util/primevue'
import { startLazyMedia } from '@/util/lazy-media'
import Layout from '@/layouts/Layout.vue'
import { animationDirectives } from '@/directives/client'
import { createInertiaVueApp, needsPrimeVueOnFirstRender, resolvePage, type InertiaPageProps } from './inertia'
import '../css/style.css'

if (import.meta.env.DEV) {
	const spritemapClientModule = '/@vite-plugin-svg-spritemap/client'
	import(/* @vite-ignore */ spritemapClientModule).catch(() => {})
}

createInertiaApp<InertiaPageProps>({
	layout: () => Layout,
	resolve: resolvePage,
	serverHead: 'seoHead',
	async setup({ el, App, props, plugin }) {
		const vueApp = createInertiaVueApp({
			App,
			props,
			plugin,
			page: props.initialPage,
			directives: animationDirectives,
			hydrate: props.serverRendered,
		})

		if (needsPrimeVueOnFirstRender(props.initialPage)) {
			await ensurePrimeVue(vueApp)
		}

		vueApp.mount(el)
		const stopLazyMedia = startLazyMedia(el)
		vueApp.onUnmount(stopLazyMedia)
		import.meta.hot?.dispose(stopLazyMedia)
	},
	progress: {
		color: '#0d0525',
	},
}).catch((error) => {
	console.error('[Inertia] Failed to bootstrap Vue app.', error)
})
