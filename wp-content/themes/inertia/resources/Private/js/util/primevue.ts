// @ts-nocheck
import { defineAsyncComponent } from 'vue'
import { createPrimeVueOptions } from './primevue-options'

let appInstance = null
let primeVueModulesPromise = null
const installedApps = new WeakSet()

export const registerPrimeVueApp = (app) => {
	appInstance = app
	return app
}

const loadPrimeVueModules = () => {
	if (!primeVueModulesPromise) {
		primeVueModulesPromise = Promise.all([
			import('primevue/config'),
			import('primevue/tooltip'),
			import('@primevue/themes'),
			import('@primeuix/themes/aura'),
		]).then(([primeVueModule, tooltipModule, themesModule, auraModule]) => ({
			PrimeVue: primeVueModule.default,
			Tooltip: tooltipModule.default,
			definePreset: themesModule.definePreset,
			Aura: auraModule.default,
		}))
	}

	return primeVueModulesPromise
}

const installPrimeVue = (app, modules) => {
	if (!app || installedApps.has(app)) {
		return
	}

	app.use(modules.PrimeVue, createPrimeVueOptions(modules.definePreset, modules.Aura))
	app.directive('tooltip', modules.Tooltip)
	installedApps.add(app)
}

export const ensurePrimeVue = async (app = appInstance) => {
	if (!app) {
		return
	}

	const modules = await loadPrimeVueModules()
	installPrimeVue(app, modules)
}

export const definePrimeVueAsyncComponent = (loader) =>
	defineAsyncComponent(async () => {
		await ensurePrimeVue()
		const module = await loader()
		return module.default ?? module
	})
