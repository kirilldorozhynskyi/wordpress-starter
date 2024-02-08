/* eslint-disable */
// @ts-nocheck
import '../Scss/style.scss'
import AOS from 'aos'
import 'dom-slider'
import 'virtual:svg-icons-register'

import { merge } from 'lodash'
import LazyLoad from 'vanilla-lazyload'
import type { App } from 'vue'
import { createApp, defineAsyncComponent, ref } from 'vue'
import type { Component } from '@vue/runtime-core'
import VueScrollTo from 'vue-scrollto'
import { SwiperSlide } from 'swiper/vue'
import { i18n } from './util'
import VueDsCookies from './plugins/cookies'
// import PhotoSwipe from './plugins/photo-swipe'
import VideoPlayer from './directives/video-player'
import PageHeader from './components/PageHeader.vue'
import Svgicon from './components/SvgIcon.vue'

const CustomScript = defineAsyncComponent(() => import('./components/CustomScript.vue'))
const CookiesInfoBox = defineAsyncComponent(() => import('./plugins/cookies/InfoBox.vue'))
const AjaxList = defineAsyncComponent(() => import('./components/AjaxList.vue'))
// const Collapse = defineAsyncComponent(() => import('./components/Collapse.vue'))
// const Gallery = defineAsyncComponent(() => import('./components/Gallery.vue'))
// const PageHeroSlider = defineAsyncComponent(() => import('./components/PageHeroSlider.vue'))
// const Quote = defineAsyncComponent(() => import('./components/Quote.vue'))
// const Counter = defineAsyncComponent(() => import('./components/Counter.vue'))
// const Logowall = defineAsyncComponent(() => import('./components/Logowall.vue'))
// const TabNavigation = defineAsyncComponent(() => import('./components/TabNavigation.vue'))

// const NewsList = defineAsyncComponent(() => import('./components/NewsList.vue'))
// const Search = defineAsyncComponent(() => import('./components/Search.vue'))

// // GravityForm component and inputs
// const GravityForm = defineAsyncComponent(() => import('./components/GravityForm.vue'))
// const GfCheckboxes = defineAsyncComponent(() => import('./components/GravityFormElements/Checkboxes.vue'))
// const GfConsent = defineAsyncComponent(() => import('./components/GravityFormElements/Consent.vue'))
// const GfFileUpload = defineAsyncComponent(() => import('./components/GravityFormElements/FileUpload.vue'))
// const GfInput = defineAsyncComponent(() => import('./components/GravityFormElements/Input.vue'))
// const GfRadioButtons = defineAsyncComponent(() => import('./components/GravityFormElements/RadioButtons.vue'))
// const GfSelect = defineAsyncComponent(() => import('./components/GravityFormElements/Select.vue'))
// const GfTextarea = defineAsyncComponent(() => import('./components/GravityFormElements/Textarea.vue'))

const PREVENT_UNLOAD_CLASSES = [
	'.ajax',
	'.download',
	'#scroll-to-top',
	// '[data-photoswipe]',
	'[download]',
	'[href^=\\#]',
	'[href*=ajax]',
	'[href^=javascript]',
	'[href^=mailto]',
	'[href^=tel]',
	'[href*=tx_typoscriptrendering]',
	'[target^=_blank]',
]
const SCROLL_OFFSET = 64
const DESKTOP_BREAKPOINT = 768

export const rootComponent: Component = {
	/* == GLOBAL COMPONENTS == */
	components: {
		CustomScript,
		Svgicon,

		CookiesInfoBox,
		AjaxList,
		PageHeader,
		// Collapse,
		// gallery: Gallery,
		// PageHeroSlider,
		// quote: Quote,
		// counter: Counter,
		// logowall: Logowall,
		// TabNavigation,
		// SwiperSlide,
		// NewsList,
		// search: Search,
		// GravityForm,
		// GfCheckboxes,
		// GfConsent,
		// GfFileUpload,
		// GfInput,
		// GfRadioButtons,
		// GfSelect,
		// GfTextarea,
	},

	/* ======= OPTIONS ======= */
	delimiters: ['<%', '%>'],

	/* ======= DIRECTIVES ======= */
	directives: {
		'scroll-to': VueScrollTo,
		// 'video-player': VideoPlayer,
	},

	computed: {
		scrollOffset() {
			let offset = -SCROLL_OFFSET

			if (this.header && this.header.value) {
				offset -= this.header.value.offsetHeight
			}

			return offset
		},
	},

	provide() {
		return {
			lazyLoad: this.lazyLoad,
			scrollOffset: this.scrollOffset,
		}
	},

	/* ======== SETUP ======== */
	setup() {
		const header = ref<HTMLElement | null>(null)
		const lazyLoad = new LazyLoad({
			threshold: 0,
			elements_selector: '[lazy]',
			class_loading: 'lazy-loading',
			class_loaded: 'lazy-loaded',
			class_applied: 'lazy-bg-loaded',
			class_error: 'lazy-error',
		})
		// const photoSwipe = new PhotoSwipe()

		return {
			header,
			lazyLoad,
			// photoSwipe,
		}
	},

	/* === LIFECYCLE HOOKS === */
	created() {
		window.addEventListener('load', this.onLoad)
		window.addEventListener('scroll', this.onScroll)
		window.addEventListener('beforeunload', this.beforeUnloadListener)
		this.createdHook()
	},
	mounted() {
		AOS.init({
			duration: 900,
			once: true,
			disable: window.innerWidth < DESKTOP_BREAKPOINT,
		})

		this.lazyLoad.update()
		document.body.classList.add('loaded')
		this.mountedHook()
	},

	/* ======= METHODS ======= */
	methods: {
		/* === LIFECYCLE METHODS HOOKS === */
		createdHook() {
			/* Placeholder function used to extend Vue created hook in projects */
		},
		loadedHook() {
			/* Placeholder function used to extend document on-load event in projects */
		},
		mountedHook() {
			/* Placeholder function used to extend Vue mounted hook in projects */
		},

		/* ======= GENERAL METHODS ======= */
		initUnload() {
			let links = 'a'

			PREVENT_UNLOAD_CLASSES.forEach((className) => {
				links += `:not(${className})`
			})

			document.querySelectorAll<HTMLAnchorElement>(links).forEach((link) => {
				link.addEventListener('click', (event) => {
					const target = event.currentTarget as HTMLAnchorElement | null

					if (event.ctrlKey || event.shiftKey || event.metaKey || event.button === 1) {
						return true
					}
					if (target?.pathname === window.location.pathname) {
						return true
					}
					if (target?.getAttribute('id') === 'history-back') {
						event.preventDefault()
						if (window.history.length > 1) {
							window.history.back()
						}

						return false
					}
					document.body.classList.remove('loaded')

					return true
				})
			})
		},
		onLoad() {
			document.body.classList.add('loaded')
			this.initUnload()
			this.loadedHook()
		},
		onScroll() {
			/* Scroll to top show/hide */
			const scrollToTopButton = document.querySelector('.page-return-top')
			if (scrollToTopButton) {
				if (window.scrollY >= 200) {
					scrollToTopButton.classList.add('active')
				} else {
					scrollToTopButton.classList.remove('active')
				}
			}
		},
		scrollToTop() {
			window.scrollTo({ top: 0, behavior: 'smooth' })
		},
	},
}

export default function (projectRootComponent: Component): App<Element> {
	const app = createApp(merge(rootComponent, projectRootComponent))

	app.use(i18n)

	return app
}

// back button fixes
window.addEventListener(
	'pagehide',
	(event) => {
		if (event.persisted) {
			/* the page isn't being discarded, so it can be reused later */
		}
	},
	false
)
window.onpageshow = (event: PageTransitionEvent) => {
	if (event.persisted) {
		window.location.reload()
	}
}

const app = createApp(rootComponent)
app.use(VueDsCookies)
app.mount('#page')
