import type { App, Directive, Plugin } from 'vue'
import PrimeVue from 'primevue/config'
import { definePreset } from '@primevue/themes'
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
