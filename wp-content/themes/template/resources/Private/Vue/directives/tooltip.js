/*
 * File: /src/scripts/directives/tooltip.js
 * Project: ousa-fe
 * Version: 1.0.0
 * Created Date: Tuesday, June 18th 2024, 15:12:11
 * Author: Kirill Dorozhynskyi - kyrylo.dorozhynskyi@justdev.org
 * -----
 * Last Modified: Tuesday, June 18th 2024 15:23:44
 * Modified By: Kirill Dorozhynskyi
 * -----
 * Copyright (c) 2024 justDev
 */

import Tooltip from 'bootstrap/js/dist/tooltip'

const tooltipDirective = {
	mounted(el) {
		const options = {
			title: el.getAttribute('data-bs-title') || '',
			placement: el.getAttribute('data-bs-placement') || 'top',
			customClass: el.getAttribute('data-bs-custom-class') || '',
			trigger: el.getAttribute('data-bs-trigger') || 'hover focus'
		}

		el.tooltipInstance = new Tooltip(el, options)
	},
	updated(el) {
		if (el.tooltipInstance) {
			el.tooltipInstance.update()
		}
	},
	unmounted(el) {
		if (el.tooltipInstance) {
			el.tooltipInstance.dispose()
			el.tooltipInstance = null
		}
	}
}

export default tooltipDirective
