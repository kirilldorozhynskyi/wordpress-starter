import type { App, Component, Directive, Plugin } from 'vue'
import { defineAsyncComponent } from 'vue'
import PrimeVue from 'primevue/config'
import { definePreset } from '@primeuix/themes'
import Aura from '@primeuix/themes/aura'
import createPrimeVueOptions from './primevue-options'
import type { DefinePreset } from './primevue-options'

const installedApps = new WeakSet<App>()
const emptyTooltip: Directive = {}

const installPrimeVueSSR = (app: App) => {
	if (!app || installedApps.has(app)) {
		return
	}

	app.use(PrimeVue as Plugin, createPrimeVueOptions(definePreset as DefinePreset, Aura))
	app.directive('tooltip', emptyTooltip)
	installedApps.add(app)
}

export default installPrimeVueSSR

// Each SSR request installs into its own app; no module-global app instance.
export const registerPrimeVueApp = (app: App) => {
	installPrimeVueSSR(app)
	return app
}

export const ensurePrimeVue = async () => {}

export const definePrimeVueAsyncComponent = (loader: () => Promise<Component | { default?: Component }>) =>
	defineAsyncComponent(async () => {
		const module = await loader()
		return ('default' in Object(module) ? (module as { default?: Component }).default : module) as Component
	})
