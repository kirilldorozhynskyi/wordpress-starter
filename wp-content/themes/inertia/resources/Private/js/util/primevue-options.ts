export type DefinePreset = (preset: unknown, options: Record<string, unknown>) => unknown

const createPrimeVueOptions = (definePreset: DefinePreset, Aura: unknown) => ({
	theme: {
		preset: definePreset(Aura, {
			semantic: {
				primary: {
					50: '{gold.50}',
					100: '{gold.100}',
					200: '{gold.200}',
					300: '{gold.300}',
					400: '{gold.400}',
					500: '{gold.500}',
					600: '{gold.600}',
					700: '{gold.700}',
					800: '{gold.800}',
					900: '{gold.900}',
					950: '{gold.950}',
				},
			},
		}),
		options: {
			darkModeSelector: false,
			cssLayer: {
				name: 'primevue',
				order: 'base, primevue',
			},
		},
	},
})

export default createPrimeVueOptions
