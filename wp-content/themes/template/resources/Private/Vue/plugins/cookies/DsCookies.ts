/* eslint-disable */
// @ts-nocheck
import Cookies from 'js-cookie'
import { i18n } from '../../util'
import type { Ref } from 'vue'
import { ref, watch } from 'vue'

const DAYS_IN_MONTH = 31
const DAYS_IN_YEAR = 365
const KEY_COOKIES_SETTINGS = 'cookiesSettings'
const CLASS_MEDIA_OVERLAY = 'cookies-info-overlay'
const HASH_OPEN = 'open-cookiebox'

function cloneScriptTag(script: HTMLScriptElement): HTMLScriptElement {
	const clonedScript: HTMLScriptElement = document.createElement('script')

	for (let i = 0; i < script.attributes.length; i++) {
		clonedScript.setAttribute(script.attributes[i].name, script.attributes[i].value)
	}

	if (script.text) {
		clonedScript.text = script.text
	}

	clonedScript.setAttribute('type', 'text/javascript')

	return clonedScript
}

interface DsCookiesOptions {
	categories: Array<string>
}

export default class DsCookies {
	accepted: Ref<boolean>
	categories: Ref<{ [key: string]: boolean }>
	closed: Ref<boolean>

	constructor(options: DsCookiesOptions) {
		const cookiesSettings = Cookies.get(KEY_COOKIES_SETTINGS)

		this.categories = ref({})
		try {
			if (!cookiesSettings) {
				throw 'Cookies not found'
			}
			const cookiesSettingsObject = JSON.parse(cookiesSettings)
			this.accepted = ref(cookiesSettingsObject.accepted)
			this.closed = ref(cookiesSettingsObject.closed)

			if (cookiesSettingsObject.categories) {
				options?.categories.forEach((category) => {
					this.categories.value[category] = cookiesSettingsObject['categories'][category]
				})
			}
		} catch (e) {
			this.accepted = ref(false)
			this.closed = ref(false)

			options?.categories.forEach((category) => {
				this.categories.value[category] = false
			})
		}

		watch(this.accepted, (isAccepted) => {
			if (isAccepted) {
				this.run()
			}
		})

		document.addEventListener('click', (e) => this.handleOpenLinkClick(e))

		this.run()
	}

	accept(event: Event | null = null) {
		this.close()

		const cookiesSettings = Cookies.get(KEY_COOKIES_SETTINGS)
		let cookiesSettingsObject: { accepted?: any; categories?: any } = {}

		this.accepted.value = true

		try {
			if (!cookiesSettings) {
				throw 'Cookies not found'
			}
			cookiesSettingsObject = JSON.parse(cookiesSettings)
		} catch (e) {
			cookiesSettingsObject = {}
		} finally {
			cookiesSettingsObject.accepted = true
			cookiesSettingsObject.categories = {}
			Object.keys(this.categories.value).forEach((category) => {
				cookiesSettingsObject.categories[category] = this.categories.value[category]
			})

			Cookies.set(KEY_COOKIES_SETTINGS, JSON.stringify(cookiesSettingsObject), {
				expires: DAYS_IN_YEAR,
				sameSite: 'strict',
				secure: true,
			})
			const btnParent = (<HTMLElement>event?.target)?.parentElement
			const cookieNotice = btnParent?.querySelector('.info-panel-notice')

			cookieNotice?.classList.add('show')
			setTimeout(() => {
				cookieNotice?.classList.remove('show')
			}, 5000)
		}
	}

	acceptAll() {
		Object.keys(this.categories.value).forEach((category) => {
			this.categories.value[category] = true
		})

		this.accept()
	}

	close() {
		const cookiesSettings = Cookies.get(KEY_COOKIES_SETTINGS)
		let cookiesSettingsObject

		this.closed.value = true

		try {
			if (!cookiesSettings) {
				throw 'Cookies not found'
			}
			cookiesSettingsObject = JSON.parse(cookiesSettings)
		} catch (e) {
			cookiesSettingsObject = {}
		} finally {
			cookiesSettingsObject.closed = true
			Cookies.set(KEY_COOKIES_SETTINGS, JSON.stringify(cookiesSettingsObject), {
				expires: DAYS_IN_MONTH,
				sameSite: 'strict',
				secure: true,
			})
		}
	}

	isElementAllowed(element: HTMLElement): boolean {
		const elementCookieSettings = element.dataset.cookieconsent?.split(',').map((category) => category.trim())
		return elementCookieSettings ? elementCookieSettings.every((category) => this.categories.value[category]) : this.accepted.value
	}

	async disableIFrames(scope: ParentNode = document) {
		const pTag = document.createElement('p')
		pTag.innerHTML = i18n.t('cookies.info.disabled')
		pTag.classList.add(`${CLASS_MEDIA_OVERLAY}-text`)
		const divTag = document.createElement('div')
		divTag.classList.add(CLASS_MEDIA_OVERLAY)
		divTag.appendChild(pTag)

		await scope.querySelectorAll('iframe').forEach((iframe) => {
			if (iframe.dataset.cookieconsent === 'ignore') {
				return
			}

			if (!this.isElementAllowed(iframe)) {
				iframe.parentNode?.insertBefore(divTag.cloneNode(true), iframe)
				iframe.style.display = 'none'

				document.addEventListener('click', (event) => {
					const target = event.target as HTMLElement

					if (target) {
						const isTargetDivTag = target.classList.contains(`${CLASS_MEDIA_OVERLAY}-text`)

						if (isTargetDivTag) {
							this.open()
						}
					}
				})
			}
		})
	}

	enableIFrames(scope: ParentNode = document) {
		scope.querySelectorAll(`.${CLASS_MEDIA_OVERLAY}`).forEach((message) => {
			message.parentNode?.removeChild(message)
		})

		scope.querySelectorAll('iframe').forEach((iframe) => {
			if (this.isElementAllowed(iframe)) {
				iframe.style.display = 'block'
			}
		})
	}

	enableScripts(scope: Element | Document = document) {
		for (const script of Array.from(scope.getElementsByTagName('script'))) {
			if (this.isElementAllowed(script)) {
				if (script.type.toLowerCase() === 'text/plain') {
					const parent = script.parentNode
					const sibling = script.nextElementSibling
					const clonedScript = cloneScriptTag(script) as HTMLScriptElement
					const newType = clonedScript.getAttribute('data-type')
					if (newType) {
						clonedScript.setAttribute('type', newType)
						clonedScript.removeAttribute('data-type')
					}

					if (parent) {
						parent.removeChild(script)
						parent.insertBefore(clonedScript, sibling || null)
					}
				}
			}
		}
	}

	handleOpenLinkClick(e: MouseEvent): void {
		const target = e.target as HTMLLinkElement

		if (target && target.href) {
			const hash = target.href.split('#')[1]

			if (hash && hash.toLowerCase() === HASH_OPEN) {
				e.preventDefault()
				this.open()
			}
		}
	}

	open() {
		this.accepted.value = false
		this.closed.value = false
	}

	run(scope: Element | Document = document) {
		this.enableScripts(scope)

		this.enableIFrames(scope) // Must be called before disable IFrames
		this.disableIFrames(scope)
	}
}
