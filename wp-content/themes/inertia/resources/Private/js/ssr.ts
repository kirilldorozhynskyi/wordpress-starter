import { createInertiaApp } from '@inertiajs/vue3'
import createServer from '@inertiajs/vue3/server'
import { renderToString } from '@vue/server-renderer'
import { createInertiaVueApp, createNoopLazyLoad, needsPrimeVueOnFirstRender, resolvePage } from './inertia'
import { installPrimeVueSSR } from './util/primevue-ssr'

createServer((page) =>
	createInertiaApp({
		page,
		render: renderToString,
		resolve: resolvePage,
		setup({ App, props, plugin }) {
			const vueApp = createInertiaVueApp({
				App,
				props,
				plugin,
				page,
				lazyLoad: createNoopLazyLoad(),
				ssr: true,
			})

			if (needsPrimeVueOnFirstRender(page)) {
				installPrimeVueSSR(vueApp)
			}

			return vueApp
		},
	})
)
