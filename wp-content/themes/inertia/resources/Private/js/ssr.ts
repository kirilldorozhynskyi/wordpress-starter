import { createInertiaApp } from '@inertiajs/vue3'
import createServer from '@inertiajs/vue3/server'
import { renderToString } from '@vue/server-renderer'
import Layout from '@/layouts/Layout.vue'
import { createInertiaVueApp, resolvePage, type InertiaPageProps } from './inertia'

const ssrPort = Number(process.env.PORT || 13714)

createServer(
	(page) =>
		createInertiaApp<InertiaPageProps>({
			layout: () => Layout,
			page,
			render: async (App) => {
				const html = await renderToString(App)
				return html.trim()
			},
			resolve: resolvePage,
			setup({ App, props, plugin }) {
				const vueApp = createInertiaVueApp({
					App,
					props,
					plugin,
					page,
					ssr: true,
				})

				return vueApp
			},
		}),
	{ host: '127.0.0.1', port: ssrPort }
)
