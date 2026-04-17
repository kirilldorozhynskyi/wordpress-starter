/// <reference types="vite/client" />

declare module '*.vue' {
	import type { DefineComponent } from 'vue'

	const component: DefineComponent<Record<string, unknown>, Record<string, unknown>, unknown>
	export default component
}

declare module '@evo-mark/inertia-wordpress' {
	import type { Component, DefineComponent } from 'vue'

	type InertiaResolvedComponent = DefineComponent | Promise<DefineComponent> | { default: DefineComponent }
	type PageResolver = (name: string) => InertiaResolvedComponent

	export function resolveInertiaPage(pages: Record<string, unknown>, layout?: Component): PageResolver
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
