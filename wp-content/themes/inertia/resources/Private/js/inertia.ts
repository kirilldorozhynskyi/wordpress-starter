import type { Component, Plugin } from 'vue'
import { createApp, createSSRApp, defineAsyncComponent, h } from 'vue'
import { Head, Link } from '@inertiajs/vue3'
import { createI18n } from 'vue-i18n'
import type { Page } from '@inertiajs/core'
import { resolveInertiaPage } from '@evo-mark/inertia-wordpress'
import Layout from '@/layouts/Layout.vue'
import { registerPrimeVueApp } from '@/util/primevue'
import { createI18nConfig } from '@/util/i18n'

const Image = defineAsyncComponent(() => import('@/Components/Utils/ImageWP.vue'))
const Button = defineAsyncComponent(() => import('@/components/Utils/Button.vue'))
const SvgIcon = defineAsyncComponent(() => import('@/components/Utils/SvgIcon.vue'))
const SvgObject = defineAsyncComponent(() => import('@/components/Utils/Object.vue'))
const IdPage = defineAsyncComponent(() => import('@/components/Utils/IdPage.vue'))

const primeVueCriticalLayouts = new Set<string>([])

const clientPages = import.meta.glob('./pages/**/*.vue')

type FlexibleContentItem = {
	acf_fc_layout?: string | null
}

type InertiaPageProps = Record<string, unknown> & {
	locale?: string | null
	site?: {
		language?: string | null
	} | null
	wp?: {
		language?: string | null
	} | null
	fields?: {
		flexible_content?: FlexibleContentItem[] | null
	} | null
}

type InertiaPagePayload = Page<InertiaPageProps>

export const createNoopLazyLoad = () => ({
	update() {},
	loadAll() {},
	restoreAll() {},
})

export const getInitialPage = (id = 'app'): InertiaPagePayload | null => {
	if (typeof document === 'undefined') {
		return null
	}

	const pageScript = document.querySelector(`script[data-page="${id}"][type="application/json"]`)
	if (pageScript?.textContent) {
		return JSON.parse(pageScript.textContent) as InertiaPagePayload
	}

	const appElement = document.getElementById(id)
	const legacyPage = appElement?.getAttribute('data-page')

	if (!legacyPage) {
		return null
	}

	return JSON.parse(legacyPage) as InertiaPagePayload
}

export const getPageLocale = (page: InertiaPagePayload | null) => page?.props?.locale || page?.props?.site?.language || page?.props?.wp?.language || null

export const resolvePage = resolveInertiaPage(clientPages, Layout)

export const needsPrimeVueOnFirstRender = (page: InertiaPagePayload | null) => {
	const layouts = Array.isArray(page?.props?.fields?.flexible_content) ? page.props.fields.flexible_content : []

	return layouts.slice(0, 2).some((item) => primeVueCriticalLayouts.has(item?.acf_fc_layout))
}

type CreateInertiaVueAppOptions = {
	App: Component
	props: object
	plugin: Plugin
	page: InertiaPagePayload | null
	lazyLoad?: {
		update?: () => void
		loadAll?: () => void
		restoreAll?: () => void
	} | null
	hydrate?: boolean
	ssr?: boolean
}

export const createInertiaVueApp = ({ App, props, plugin, page, lazyLoad, hydrate = false, ssr = false }: CreateInertiaVueAppOptions) => {
	const vueApp = (ssr || hydrate ? createSSRApp : createApp)({
		render: () => h(App, props),
	})

	registerPrimeVueApp(vueApp)

	vueApp
		.use(plugin)
		.use(createI18n(createI18nConfig(getPageLocale(page)) as never))
		.component('Link', Link)
		.component('Head', Head)
		.component('Image', Image)
		.component('Button', Button)
		.component('SvgIcon', SvgIcon)
		.component('SvgObject', SvgObject)
		.component('IdPage', IdPage)
		.provide('lazyLoad', lazyLoad ?? createNoopLazyLoad())

	return vueApp
}
