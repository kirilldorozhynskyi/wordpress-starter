// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import { Component, CreateAppFunction } from '@vue/runtime-core'
import type { ILazyLoadInstance } from 'vanilla-lazyload'
import VueScrollTo from 'vue-scrollto'

export declare const rootComponent: Component

declare const createApp: CreateAppFunction<Element>

export default createApp

export * from '../plugins'

interface domSliderOptions {
	element: HTMLElement | null
	slideSpeed?: number // speed in milliseconds
	easing?: string // CSS transition timing function,
	delay?: number // delay in milliseconds,
	// eslint-disable-next-line max-len
	visibleDisplayValue?: string // the CSS display value when the element is visible; the default value is "block"
}

declare global {
	interface Window {
		domSlider: {
			slideDown: (_ref: domSliderOptions) => Promise<HTMLElement>
			slideUp: (_ref: domSliderOptions) => Promise<HTMLElement>
			slideToggle: (_ref: domSliderOptions) => Promise<HTMLElement>
		}
	}

	export type Dictionary<T> = Record<string, T>
}

declare module '@vue/runtime-core' {
	interface ComponentCustomProperties {
		lazyLoad: ILazyLoadInstance
		scrollOffset: number
		$scrollTo: typeof VueScrollTo.scrollTo
	}
}

declare module '*.svg' {
	import type { DefineComponent } from 'vue'

	const component: DefineComponent
	export default component
}
