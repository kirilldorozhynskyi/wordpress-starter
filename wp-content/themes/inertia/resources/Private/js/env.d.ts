/// <reference types="vite/client" />

declare module '*.vue' {
	import type { DefineComponent } from 'vue'

	const component: DefineComponent<Record<string, unknown>, Record<string, unknown>, unknown>
	export default component
}

declare module '@/directives/animation.js' {
	const directive: import('vue').ObjectDirective<HTMLElement>
	export default directive
}

declare module '@/directives/maskReveal.js' {
	const directive: import('vue').ObjectDirective<HTMLElement>
	export default directive
	export function refreshMaskReveal(): void
}

declare module '@/directives/scrollZoomOut.js' {
	const directive: import('vue').ObjectDirective<HTMLElement>
	export default directive
}

declare module '@/directives/splitReveal.js' {
	export const RevealHeading: import('vue').ObjectDirective<HTMLElement>
	export const RevealText: import('vue').ObjectDirective<HTMLElement>
}

interface NavigatorUADataBrand {
	brand: string
	version: string
}

interface NavigatorUAData {
	brands: NavigatorUADataBrand[]
}

interface Navigator {
	userAgentData?: NavigatorUAData
}

interface Window {
	lenis?: {
		start: () => void
		stop: () => void
	}
}
