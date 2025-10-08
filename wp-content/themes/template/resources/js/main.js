import { createApp as createClientApp, createSSRApp, h, defineAsyncComponent } from 'vue'
import { createInertiaApp } from '@inertiajs/vue3'
import { resolveInertiaPage } from '@evo-mark/inertia-wordpress'
import DefaultLayout from './Layouts/DefaultLayout.vue'
import '../css/app.css'

const SvgIcon = defineAsyncComponent(() => import('./Components/Utils/SvgIcon.vue'))

createInertiaApp({
	resolve: resolveInertiaPage(import.meta.glob('./pages/**/*.vue', { eager: false }), DefaultLayout),
	setup({ el, App, props, plugin }) {
		const useSSRHydration = el.hasChildNodes()

		const app = useSSRHydration ? createSSRApp({ render: () => h(App, props) }) : createClientApp({ render: () => h(App, props) })

		app.use(plugin).component('SvgIcon', SvgIcon).mount(el)
	}
})
