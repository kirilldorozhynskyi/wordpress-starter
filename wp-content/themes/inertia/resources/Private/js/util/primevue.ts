import type { App, Component, Directive, Plugin } from 'vue'
import { defineAsyncComponent } from 'vue'
import createPrimeVueOptions from './primevue-options'
import type { DefinePreset } from './primevue-options'

type PrimeVueModules = {
	PrimeVue: Plugin
	Tooltip: Directive
	definePreset: DefinePreset
	Aura: unknown
}

type ComponentModule = Component | {
	default?: Component
}

let appInstance: App | null = null
let primeVueModulesPromise: Promise<PrimeVueModules> | null = null
const installedApps = new WeakSet<App>()

export const registerPrimeVueApp = (app: App) => {
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
			PrimeVue: primeVueModule.default as Plugin,
			Tooltip: tooltipModule.default as Directive,
			definePreset: themesModule.definePreset as DefinePreset,
			Aura: auraModule.default,
		}))
	}

	return primeVueModulesPromise
}

const installPrimeVue = (app: App | null, modules: PrimeVueModules) => {
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

export const definePrimeVueAsyncComponent = (loader: () => Promise<ComponentModule>) =>
	defineAsyncComponent(async () => {
		await ensurePrimeVue()
		const module = await loader()
		return ('default' in Object(module) ? (module as { default?: Component }).default : module) as Component
	})
