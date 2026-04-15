// @ts-nocheck
import PrimeVue from 'primevue/config'
import { definePreset } from '@primevue/themes'
import Aura from '@primeuix/themes/aura'
import { createPrimeVueOptions } from './primevue-options'

const installedApps = new WeakSet()

export const installPrimeVueSSR = (app) => {
	if (!app || installedApps.has(app)) {
		return
	}

	app.use(PrimeVue, createPrimeVueOptions(definePreset, Aura))
	app.directive('tooltip', {})
	installedApps.add(app)
}
