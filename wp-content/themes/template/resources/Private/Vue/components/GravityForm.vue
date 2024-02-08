<template>
	<div ref="gForm">
		<slot
			:fields="fields"
			:isLoading="isLoading"
			:submitted="submitted"
			:confirmation="confirmation"
			:isSubmitting="isSubmitting"
			:submitBtnText="submitBtnText"
		/>
	</div>
</template>

<script lang="ts">
/**
 * Default component for gravity forms
 */

import axios from 'axios'
import VueScrollTo from 'vue-scrollto'
import { defineComponent } from 'vue'

declare interface IField {
	key: string
	data: {
		error: null | string
		id: string
		key: string
		label: string
		required: boolean
		value: null | string
	}
	value: null | string
	error: null | string
}

declare interface IGravityFormElement {
	key: string
	value: string
	error: null | string
	id: string
	label: string
	required: boolean
	submitData: () => void
}

declare type TConfirmation = {
	type: string
	pageId: string
	url: string
}

const FORM_GET_URL = '/wp-json/jdev/get-form'
const FORM_SUBMIT_URL = '/wp-json/jdev/submit-form'

export default defineComponent({
	inject: ['scrollOffset'],
	provide() {
		return {
			gravityForm: this
		}
	},
	props: {
		id: {
			type: Number,
			required: true
		},
		ceId: {
			type: Number,
			required: true
		},
		lang: {
			type: String,
			default: null
		}
	},
	data() {
		return {
			confirmation: {} as TConfirmation,
			currentPage: 1,
			fields: {} as { [key: string]: IField },
			formData: {},
			formElement: null as HTMLFormElement | null,
			formElements: {} as { [key: string]: IGravityFormElement },
			honeypot: null as HTMLInputElement | null,
			isLoading: true,
			isSubmitting: false,
			name: null,
			numberOfPages: 1,
			queryParams: {} as { [key: string]: string },
			submitted: false,
			submitBtnText: null
		}
	},
	created() {
		this.loadForm()
		this.parseQueryParams()
	},
	mounted() {
		this.formElement = this.$el.querySelector('form')
	},
	methods: {
		addHoneypot() {
			const honeypot = document.createElement('input')
			honeypot.setAttribute('type', 'checkbox')
			honeypot.setAttribute('name', 'contact_me_by_fax_only')
			honeypot.setAttribute('value', '0')
			honeypot.setAttribute('autocomplete', 'off')
			honeypot.setAttribute('tabindex', '-1')
			honeypot.setAttribute('style', 'display:none')
			this.formElement?.appendChild(honeypot)
			this.honeypot = honeypot
		},

		clearErrorMessages() {
			Object.values(this.formElements).forEach((element) => {
				// eslint-disable-next-line no-param-reassign
				element.error = null
			})
		},

		createFormData() {
			const formData = {
				honeypot: this.honeypot?.value,
				currentPage: this.numberOfPages > 1 ? this.currentPage : null,
				id: this.id
			}
			Object.keys(this.fields).forEach((fieldKey) => {
				Object.values(this.formElements).forEach((element) => {
					if (fieldKey === element.key) Object.assign(formData, element.submitData())
				})
			})
			this.formData = formData
			return formData
		},

		fillErrorMessages(messages: { [key: string]: string }) {
			// eslint-disable-next-line no-restricted-syntax
			for (const [errorKey, errorMessage] of Object.entries(messages)) {
				Object.values(this.formElements).forEach((element) => {
					// eslint-disable-next-line no-param-reassign
					if (`input_${errorKey}` === element.key) element.error = errorMessage
				})
			}
			this.scrollToFirstEl('.form-group.has-error')
		},

		getFieldValue(fieldName: string) {
			if (!this.queryParams || !fieldName.length) return ''
			// eslint-disable-next-line no-restricted-syntax
			for (const [key, value] of Object.entries(this.queryParams)) {
				if (key === fieldName) return value
			}

			return ''
		},

		handleConfirmation() {
			switch (this.confirmation.type) {
				case 'message':
					this.scrollToFirstEl('#confirmation')
					break
				case 'page':
					window.location.href = `${window.location.origin}?page_id=${this.confirmation.pageId}`
					break
				case 'redirect':
					window.location.href = this.confirmation.url
					break
				default:
			}
		},

		// eslint-disable-next-line
		initForm(data: any) {
			this.name = data.title
			this.submitBtnText = data.button.text
			this.confirmation = Object.values(data.confirmations)[0] as TConfirmation
			// eslint-disable-next-line
			this.numberOfPages = data.fields.reduce((a: any, b: any) => {
				return a.pageNumber > b.pageNumber ? a.pageNumber : b.pageNumber
			})
			// eslint-disable-next-line
			data.fields.forEach((field: any) => {
				this.fields[`input_${field.id}`] = {
					key: `input_${field.id}`,
					data: field,
					value: field.allowsPrepopulate ? this.getFieldValue(field.inputName) : null,
					error: null
				}
			})
			this.addHoneypot()
			if (this.formElement) {
				this.formElement.noValidate = true
			}
			this.formElement?.addEventListener('submit', (event) => {
				event.preventDefault()
				this.submit()
			})
		},

		loadForm() {
			this.isLoading = true
			axios
				.get(FORM_GET_URL, {
					params: {
						id: this.id,
						lang: this.lang
					}
				})
				.then((response) => {
					if (!response.data || !+response.data.is_active) {
						console.error(`Error: Unable to create form with ID ${this.id}. Form either doesn't exist or is inactive.`)
					} else {
						this.initForm(response.data)
					}
				})
				.catch((error) => {
					console.error('Oops an error occurred: ', error)
				})
				.then(() => {
					this.isLoading = false
				})
		},

		parseQueryParams() {
			if (!window.location.search.length) return
			const urlQueryParams = window.location.search.substring(1).split('&')
			this.queryParams = {}
			urlQueryParams.forEach((param) => {
				const paramPair = param.split('=')
				this.queryParams[paramPair[0]] = decodeURIComponent(paramPair[1])
			})
		},

		scrollToFirstEl(className: string) {
			this.$nextTick(() => {
				const firstElement = this.$el.querySelector(className)
				if (!firstElement) return
				VueScrollTo.scrollTo(firstElement, {
					offset: this.scrollOffset
				})
			})
		},

		submit() {
			this.isSubmitting = true
			axios
				.post(FORM_SUBMIT_URL, this.createFormData())
				.then((response) => {
					if (response.data === 'BOT') {
						const botMessage = document.createElement('p')
						botMessage.innerText = 'You were recognized as BOT'
						this.formElement?.append(botMessage)
					} else {
						this.clearErrorMessages()
						if (response.data.is_valid) {
							if (this.currentPage < this.numberOfPages) {
								// eslint-disable-next-line no-plusplus
								this.currentPage++
							} else if (response.data.entry_id) {
								this.submitted = true
								this.handleConfirmation()
							}
						} else {
							this.submitted = false
							this.fillErrorMessages(response.data.validation_messages)
						}
					}
				})
				.catch((error) => {
					console.error('Oops an error occurred: ', error)
				})
				.then(() => {
					this.isSubmitting = false
				})
		}
	}
})
</script>
