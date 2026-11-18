import type { Component, DefineComponent, Directive, Plugin } from 'vue'
import { createApp, createSSRApp, defineAsyncComponent, h } from 'vue'
import { Head, Link, router } from '@inertiajs/vue3'
import { createI18n } from 'vue-i18n'
import type { Page } from '@inertiajs/core'
import Image from '@/components/Utils/ImageWP.vue'
import { registerPrimeVueApp } from '@/util/primevue'
import { createI18nConfig, resolveLocale } from '@/util/i18n'

const SvgIcon = defineAsyncComponent(() => import('@/components/Utils/SvgIcon.vue'))
const SvgObject = defineAsyncComponent(() => import('@/components/Utils/Object.vue'))
const Button = defineAsyncComponent(() => import('@/components/Utils/Button.vue'))
const IdPage = defineAsyncComponent(() => import('@/components/Utils/IdPage.vue'))

const primeVueCriticalLayouts = new Set<string>([])

const pages = import.meta.glob<{ default: DefineComponent }>('./pages/**/*.vue')

type FlexibleContentItem = {
	acf_fc_layout?: string | null
}

export type InertiaPageProps = Record<string, unknown> & {
	locale?: string | null
	site?: {
		language?: string | null
	} | null
	wp?: {
		language?: string | null
	} | null
	menu?: {
		languages?: { current?: string | null } | null
	} | null
	fields?: {
		flexible_content?: FlexibleContentItem[] | null
	} | null
}

type InertiaPagePayload = Page<InertiaPageProps>

export const getPageLocale = (page: InertiaPagePayload | null) =>
	page?.props?.locale || page?.props?.menu?.languages?.current || page?.props?.site?.language || page?.props?.wp?.language || null

export const resolvePage = async (name: string) => {
	const [component] = name.split('?', 1)
	const loadPage = pages[`./pages/${component}.vue`]

	if (!loadPage) {
		throw new Error(`[Inertia] Unknown page component "${component}".`)
	}

	return (await loadPage()).default
}

export const needsPrimeVueOnFirstRender = (page: InertiaPagePayload | null) => {
	const layouts = Array.isArray(page?.props?.fields?.flexible_content) ? page.props.fields.flexible_content : []

	return layouts.slice(0, 2).some((item) => primeVueCriticalLayouts.has(item?.acf_fc_layout ?? ''))
}

type AnimationDirectives = {
	jdAnimate: Directive
	revealMask: Directive
	scrollZoomOut: Directive
	revealHeading: Directive
	revealText: Directive
}

const noopDirective: Directive = {}
const revealSsrDirective: Directive = { getSSRProps: () => ({ 'data-reveal-initial': '' }) }

type CreateInertiaVueAppOptions = {
	directives?: AnimationDirectives
	App: Component
	props: object
	plugin: Plugin
	page: InertiaPagePayload | null
	hydrate?: boolean
	ssr?: boolean
}

export const createInertiaVueApp = ({ App, props, plugin, page, directives, hydrate = false, ssr = false }: CreateInertiaVueAppOptions) => {
	const vueApp = (ssr || hydrate ? createSSRApp : createApp)({
		render: () => h(App, props),
	})
	const i18n = createI18n<false>(createI18nConfig(getPageLocale(page)) as never)

	registerPrimeVueApp(vueApp)
	if (!ssr && typeof document !== 'undefined') {
		const stop = router.on('navigate', ({ detail }) => {
			const nextPage: InertiaPagePayload = detail.page
			const language = nextPage.props.menu?.languages?.current
			if (typeof language === 'string' && language) {
				document.documentElement.lang = language.replaceAll('_', '-')
			}
			i18n.global.locale.value = resolveLocale(getPageLocale(nextPage))
		})
		vueApp.onUnmount(stop)
	}

	vueApp
		.use(plugin)
		.use(i18n)
		.component('Link', Link)
		.component('Head', Head)
		.component('Image', Image)
		.component('Button', Button)
		.component('SvgIcon', SvgIcon)
		.component('SvgObject', SvgObject)
		.component('IdPage', IdPage)
		.directive('jdAnimate', directives?.jdAnimate ?? noopDirective)
		.directive('jd-animate', directives?.jdAnimate ?? noopDirective)
		.directive('revealMask', directives?.revealMask ?? noopDirective)
		.directive('reveal-mask', directives?.revealMask ?? noopDirective)
		.directive('scrollZoomOut', directives?.scrollZoomOut ?? noopDirective)
		.directive('scroll-zoom-out', directives?.scrollZoomOut ?? noopDirective)
		.directive('reveal-heading', directives?.revealHeading ?? revealSsrDirective)
		.directive('reveal-text', directives?.revealText ?? revealSsrDirective)

	return vueApp
}
