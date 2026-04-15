import "./vue-Cqm1d2TX.js";
//#region wp-content/themes/inertia/resources/Private/js/util/primevue-options.ts
var createPrimeVueOptions = (definePreset, Aura) => ({ theme: {
	preset: definePreset(Aura, { semantic: { primary: {
		50: "{gold.50}",
		100: "{gold.100}",
		200: "{gold.200}",
		300: "{gold.300}",
		400: "{gold.400}",
		500: "{gold.500}",
		600: "{gold.600}",
		700: "{gold.700}",
		800: "{gold.800}",
		900: "{gold.900}",
		950: "{gold.950}"
	} } }),
	options: {
		darkModeSelector: false,
		cssLayer: {
			name: "primevue",
			order: "base, primevue"
		}
	}
} });
//#endregion
//#region wp-content/themes/inertia/resources/Private/js/util/primevue.ts
var appInstance = null;
var primeVueModulesPromise = null;
var installedApps = /* @__PURE__ */ new WeakSet();
var registerPrimeVueApp = (app) => {
	appInstance = app;
	return app;
};
var loadPrimeVueModules = () => {
	if (!primeVueModulesPromise) primeVueModulesPromise = Promise.all([
		import("./config-BydvlNPD.js"),
		import("./tooltip-C9rW-_zU.js"),
		import("./themes-2mzrDuPB.js").then((n) => n.t),
		import("./aura-DktPOngt.js").then((n) => n.n)
	]).then(([primeVueModule, tooltipModule, themesModule, auraModule]) => ({
		PrimeVue: primeVueModule.default,
		Tooltip: tooltipModule.default,
		definePreset: themesModule.definePreset,
		Aura: auraModule.default
	}));
	return primeVueModulesPromise;
};
var installPrimeVue = (app, modules) => {
	if (!app || installedApps.has(app)) return;
	app.use(modules.PrimeVue, createPrimeVueOptions(modules.definePreset, modules.Aura));
	app.directive("tooltip", modules.Tooltip);
	installedApps.add(app);
};
var ensurePrimeVue = async (app = appInstance) => {
	if (!app) return;
	installPrimeVue(app, await loadPrimeVueModules());
};
//#endregion
export { registerPrimeVueApp as n, createPrimeVueOptions as r, ensurePrimeVue as t };
