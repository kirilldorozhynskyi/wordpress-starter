/* eslint-disable */
import '../Scss/app.scss'
// import AOS from 'aos'
import 'dom-slider'

import { merge } from 'lodash'
import LazyLoad from 'vanilla-lazyload'
import { createApp, defineAsyncComponent, ref, onMounted, onBeforeUnmount, defineComponent, computed } from 'vue'
// import { i18n } from './util'
import VueScrollTo from 'vue-scrollto'

import PageHeader from './components/PageHeader.vue'

const CustomScript = defineAsyncComponent(() => import('./components/CustomScript.vue'))
// const GForm = defineAsyncComponent(() => import('./components/GForm.vue'))
// const AjaxList = defineAsyncComponent(() => import('./components/AjaxList.vue'))
// const Collapse = defineAsyncComponent(() => import('./components/Collapse.vue'))
// const Gallery = defineAsyncComponent(() => import('./components/Gallery.vue'))
// const PageHeroSlider = defineAsyncComponent(() => import('./components/PageHeroSlider.vue'))
// const Quote = defineAsyncComponent(() => import('./components/Quote.vue'))
// const Counter = defineAsyncComponent(() => import('./components/Counter.vue'))
// const Logowall = defineAsyncComponent(() => import('./components/Logowall.vue'))
// const TabNavigation = defineAsyncComponent(() => import('./components/TabNavigation.vue'))
// const NewsList = defineAsyncComponent(() => import('./components/NewsList.vue'))
const Search = defineAsyncComponent(() => import('./components/Search.vue'))
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

const rootComponent = defineComponent({
	components: {
		CustomScript,
		PageHeader,
		// AjaxList,
		// Collapse,
		// Gallery,
		// PageHeroSlider,
		// Quote,
		// Counter,
		// Logowall,
		// TabNavigation,
		// NewsList,
		Search,
		// GravityForm,
		// GfCheckboxes,
		// GfConsent,
		// GfFileUpload,
		// GfInput,
		// GfRadioButtons,
		// GfSelect,
		// GfTextarea,
	},
	delimiters: ['<%', '%>'],
	directives: {
		'scroll-to': VueScrollTo,
		// 'video-player': VideoPlayer,
	},
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

		const scrollOffset = computed(() => {
			let offset = -SCROLL_OFFSET
			if (header.value) {
				offset -= header.value.offsetHeight
			}
			return offset
		})

		const onLoad = () => {
			document.body.classList.add('loaded')
			initUnload()
			loadedHook()
		}

		const onScroll = () => {
			const scrollToTopButton = document.querySelector('.page-return-top')
			if (scrollToTopButton) {
				if (window.scrollY >= 200) {
					scrollToTopButton.classList.add('active')
				} else {
					scrollToTopButton.classList.remove('active')
				}
			}
		}

		const beforeUnloadListener = () => {
			/* Placeholder for unload listener logic */
		}

		const initUnload = () => {
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
		}

		const createdHook = () => {
			/* Placeholder function used to extend Vue created hook in projects */
		}
		const loadedHook = () => {
			/* Placeholder function used to extend document on-load event in projects */
		}
		const mountedHook = () => {
			/* Placeholder function used to extend Vue mounted hook in projects */
		}

		onMounted(() => {
			window.addEventListener('load', onLoad)
			window.addEventListener('scroll', onScroll)
			window.addEventListener('beforeunload', beforeUnloadListener)

			// AOS.init({
			// 	duration: 900,
			// 	once: true,
			// 	disable: window.innerWidth < DESKTOP_BREAKPOINT,
			// })

			lazyLoad.update()
			document.body.classList.add('loaded')
			mountedHook()
		})

		onBeforeUnmount(() => {
			window.removeEventListener('load', onLoad)
			window.removeEventListener('scroll', onScroll)
			window.removeEventListener('beforeunload', beforeUnloadListener)
		})

		return {
			header,
			lazyLoad,
			scrollOffset,
			initUnload,
			createdHook,
			loadedHook,
			mountedHook,
		}
	},
})

export default function (projectRootComponent: any) {
	const app = createApp(merge(rootComponent, projectRootComponent))
	// app.use(i18n)
	return app
}

window.addEventListener('pagehide', (event) => {
	if (event.persisted) {
		/* the page isn't being discarded, so it can be reused later */
	}
})

window.onpageshow = (event: { persisted: any }) => {
	if (event.persisted) {
		window.location.reload()
	}
}

const app = createApp(rootComponent)
app.mount('#page')
