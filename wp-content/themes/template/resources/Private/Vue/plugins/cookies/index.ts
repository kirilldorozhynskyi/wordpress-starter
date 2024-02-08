import type { Plugin } from '@vue/runtime-core'
import DsCookies from './DsCookies'

const DsCookiesPlugin: Plugin = {
	install(app, options) {
		const cookies = new DsCookies(options)

		app.provide('cookies', cookies)
		app.component('CookiesInfoBox')
	},
}

export default DsCookiesPlugin
