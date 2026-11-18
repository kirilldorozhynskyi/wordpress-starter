export type DefinePreset = (preset: unknown, options: Record<string, unknown>) => unknown

const createPrimeVueOptions = (definePreset: DefinePreset, Aura: unknown) => ({
	license: import.meta.env.VITE_PRIMEUI_LICENSE?.trim(),
	theme: {
		preset: definePreset(Aura, {
			semantic: {
				primary: {
					50: '{amber.50}',
					100: '{amber.100}',
					200: '{amber.200}',
					300: '{amber.300}',
					400: '{amber.400}',
					500: '{amber.500}',
					600: '{amber.600}',
					700: '{amber.700}',
					800: '{amber.800}',
					900: '{amber.900}',
					950: '{amber.950}',
				},
			},
		}),
		options: {
			darkModeSelector: false,
			cssLayer: {
				name: 'primevue',
				order: 'theme, base, primevue, utilities',
			},
		},
	},
})

export default createPrimeVueOptions
