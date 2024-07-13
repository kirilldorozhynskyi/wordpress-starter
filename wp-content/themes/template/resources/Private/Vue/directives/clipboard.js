/*
 * File: /src/scripts/directives/clipboard.js
 * Project: ousa-fe
 * Version: 1.0.0
 * Created Date: Tuesday, June 18th 2024, 15:36:32
 * Author: Kirill Dorozhynskyi - kyrylo.dorozhynskyi@justdev.org
 * -----
 * Last Modified: Tuesday, June 18th 2024 15:54:05
 * Modified By: Kirill Dorozhynskyi
 * -----
 * Copyright (c) 2024 justDev
 */

const clipboardDirective = {
	mounted(el) {
		el.addEventListener('click', () => {
			const url = el.__v_clipboard.url
			const text = el.__v_clipboard.text
			const time = el.__v_clipboard.time ?? 3000

			navigator.clipboard
				.writeText(url)
				.then(() => {
					showNotification(text, time)
				})
				.catch((err) => {
					console.error('Error copying URL to clipboard: ', err)
				})
		})
	},
	beforeMount(el, binding) {
		el.__v_clipboard = binding.value
	},
	beforeUnmount(el) {
		delete el.__v_clipboard
	}
}

function showNotification(message, time) {
	const notification = document.createElement('div')
	notification.className = 'clipboard'
	notification.textContent = message
	document.body.appendChild(notification)

	setTimeout(() => {
		notification.classList.add('show')
	}, 100)
	setTimeout(() => {
		notification.classList.remove('show')
		setTimeout(() => {
			document.body.removeChild(notification)
		}, 500)
	}, time)
}

export default clipboardDirective
