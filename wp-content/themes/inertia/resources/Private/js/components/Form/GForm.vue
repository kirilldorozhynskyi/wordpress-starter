<template>
	<transition-group name="fade" tag="div">
		<div ref="gForm" :key="'gForm'">
			<div v-if="!hasStartedLoading" class="min-h-56 md:min-h-72" :key="'placeholder'" aria-hidden="true" />

			<div class="spinner-loader" role="status" v-show="hasStartedLoading && isLoading" :key="'loader'">
				<span class="visually-hidden">{{ $t('form.loading') }}</span>
			</div>

			<div
				id="confirmation"
				class="wpcf7-response-output success-submit"
				v-if="hasStartedLoading && isSubmitted"
				v-html="$t('form.success')"
				:key="'confirmation'"
			></div>

			<form
				v-if="hasStartedLoading && !isLoading && !isSubmitted"
				@submit.prevent="submitForm"
				:key="'form'"
				:class="{ disabled: isSubmitting }"
				class="grid grid-cols-1 gap-4 font-normal md:grid-cols-2"
			>
				<template v-for="item in visibleFields" :key="item.key">
					<component
						v-model="form[item.key]"
						:form="form"
						:field="item"
						:error="errorData.validation_messages[item.id]"
						:requiredIndicator="formData?.requiredIndicator"
						:is="getFieldComponent(item.type)"
					/>
				</template>

				<div class="mt-8 flex md:col-span-2" v-if="formData?.button" :key="'button-wrapper'">
					<button
						v-if="!isSubmitted"
						:disabled="isSubmitting"
						type="submit"
						class="btn-primary-dark"
						:class="{ 'disabled loading': isSubmitting }"
						:aria-label="$t('form.send')"
					>
						<span>{{ $t('form.send') }}</span>
					</button>
				</div>
			</form>
		</div>
	</transition-group>
</template>

<script setup>
import { computed, ref, onBeforeUnmount, onMounted, defineAsyncComponent } from 'vue'
import VueScrollTo from 'vue-scrollto'
import { useI18n } from 'vue-i18n'
import { ensurePrimeVue } from '@/util/primevue'

const loadFieldComponent = (name) => defineAsyncComponent(() => import(`./Fields/${name}.vue`))

const fieldComponents = {
	consent: loadFieldComponent('Consent'),
	date: loadFieldComponent('Date'),
	fileupload: loadFieldComponent('File'),
	html: loadFieldComponent('Html'),
	input: loadFieldComponent('Input'),
	multi_choice: loadFieldComponent('MultiChoice'),
	phone: loadFieldComponent('Phone'),
	radio: loadFieldComponent('Radio'),
	select: loadFieldComponent('Select'),
	textarea: loadFieldComponent('Textarea')
}

const props = defineProps({
	id: { type: [Number, String], required: true }
})

const isLoading = ref(true)
const isSubmitting = ref(false)
const isSubmitted = ref(false)
const hasStartedLoading = ref(false)
const errorData = ref({ validation_messages: {} })
const form = ref({})
const gForm = ref()
const { locale } = useI18n()
const formData = ref(null)
let formObserver = null
let detachInteractionPrefetch = null

const FORM_GET_URL = '/wp-json/inertia/v1/get-form'
const FORM_SUBMIT_URL = `/wp-json/gf/v2/forms/${props.id}/submissions`
const VALIDATION_ERRORS = { validation_messages: {} }

const parseJsonResponse = async (response) => {
	const contentType = response.headers.get('content-type') || ''

	if (!contentType.includes('application/json')) {
		return null
	}

	try {
		const text = await response.text()

		if (!text.trim()) {
			return null
		}

		return JSON.parse(text)
	} catch (error) {
		console.error('Failed to parse JSON response.', error)
		return null
	}
}

const fetchJson = async (url, options = {}) => {
	const response = await fetch(url, {
		...options,
		headers: {
			Accept: 'application/json',
			...(options.headers || {})
		}
	})

	const data = await parseJsonResponse(response)

	if (!response.ok) {
		const requestError = new Error(`Request failed with status ${response.status}`)
		requestError.response = {
			status: response.status,
			data
		}
		throw requestError
	}

	return data
}

const getDocumentLang = () => {
	if (typeof document === 'undefined') {
		return null
	}

	return document.documentElement.lang || null
}

const hasValue = (value) => {
	if (Array.isArray(value)) {
		return value.length > 0
	}

	return value !== undefined && value !== null && value !== ''
}

const visibleFields = computed(() => (Array.isArray(formData.value?.fields) ? formData.value.fields.filter((field) => field?.visibility === 'visible') : []))

const getConsentInputKey = (field) => {
	const consentInput = Array.isArray(field?.inputs) ? field.inputs.find((input) => String(input?.id) === `${field.id}.1`) : null
	return consentInput?.id ? `input_${consentInput.id}` : null
}

const normalizeField = (field) => {
	if (field?.type !== 'consent') {
		return field
	}

	const consentKey = getConsentInputKey(field)
	return consentKey ? { ...field, key: consentKey } : field
}

const normalizeFormData = (data) => {
	if (!Array.isArray(data?.fields)) {
		return data
	}

	return {
		...data,
		fields: data.fields.map(normalizeField)
	}
}

const appendConsentField = (fd, field, value) => {
	if (!value) {
		return
	}

	const inputs = Array.isArray(field?.inputs) ? field.inputs : []
	const consentInput = inputs.find((input) => String(input?.id).endsWith('.1'))
	const labelInput = inputs.find((input) => String(input?.id).endsWith('.2'))
	const revisionInput = inputs.find((input) => String(input?.id).endsWith('.3'))

	if (!consentInput?.id) {
		return
	}

	fd.append(`input_${consentInput.id}`, '1')

	if (labelInput?.id && field?.checkboxLabel) {
		fd.append(`input_${labelInput.id}`, field.checkboxLabel)
	}

	if (revisionInput?.id && field?.consentRevisionId) {
		fd.append(`input_${revisionInput.id}`, String(field.consentRevisionId))
	}
}

const getInitialFieldValue = (field) => {
	const defaultValue = field?.defaultValue ?? field?.default_value

	switch (field?.type) {
		case 'multi_choice':
			if (Array.isArray(defaultValue)) {
				return defaultValue
			}

			return defaultValue ? [defaultValue] : []
		case 'fileupload':
			return defaultValue ?? null
		case 'consent':
			return defaultValue === 1 || defaultValue === '1' || defaultValue === true ? 1 : ''
		default:
			return defaultValue ?? ''
	}
}

const buildInitialFormState = (fields = [], currentState = {}) =>
	fields.reduce(
		(state, field) => {
			if (!field?.key || state[field.key] !== undefined) {
				return state
			}

			state[field.key] = getInitialFieldValue(field)
			return state
		},
		{ ...currentState }
	)

const fetchFormData = async () => {
	isLoading.value = true

	try {
		const query = new URLSearchParams({
			id: String(props.id)
		})

		const lang = getDocumentLang()
		if (lang) {
			query.set('lang', lang)
		}

		const [response] = await Promise.all([fetchJson(`${FORM_GET_URL}?${query.toString()}`), ensurePrimeVue()])

		formData.value = normalizeFormData(response)
		form.value = buildInitialFormState(formData.value?.fields, form.value)
		errorData.value = { ...VALIDATION_ERRORS }
	} catch (error) {
		console.error('Error fetching form data:', error)
		formData.value = null
	} finally {
		isLoading.value = false
	}
}

const disconnectFormObserver = () => {
	formObserver?.disconnect()
	formObserver = null
}

const disconnectInteractionPrefetch = () => {
	detachInteractionPrefetch?.()
	detachInteractionPrefetch = null
}

const startFormLoad = () => {
	if (hasStartedLoading.value) {
		return
	}

	hasStartedLoading.value = true
	disconnectFormObserver()
	disconnectInteractionPrefetch()
	fetchFormData()
}

const attachInteractionPrefetch = () => {
	if (typeof window === 'undefined' || detachInteractionPrefetch) {
		return
	}

	const startOnInteraction = () => {
		startFormLoad()
	}

	const events = ['scroll', 'wheel', 'touchmove']

	events.forEach((eventName) => {
		window.addEventListener(eventName, startOnInteraction, { once: true, passive: true })
	})

	detachInteractionPrefetch = () => {
		events.forEach((eventName) => {
			window.removeEventListener(eventName, startOnInteraction)
		})
	}
}

const isNearViewport = () => {
	if (typeof window === 'undefined' || !gForm.value?.getBoundingClientRect) {
		return true
	}

	return gForm.value.getBoundingClientRect().top <= window.innerHeight + 320
}

onMounted(() => {
	if (typeof window === 'undefined' || !gForm.value || isNearViewport()) {
		startFormLoad()
		return
	}

	attachInteractionPrefetch()

	if (!('IntersectionObserver' in window)) {
		return
	}

	formObserver = new IntersectionObserver(
		(entries) => {
			if (entries.some((entry) => entry.isIntersecting)) {
				startFormLoad()
			}
		},
		{ rootMargin: '320px 0px' }
	)

	formObserver.observe(gForm.value)
})

onBeforeUnmount(() => {
	disconnectFormObserver()
	disconnectInteractionPrefetch()
})

const getFieldValueKey = (field) => {
	if (field?.type === 'consent') {
		const consentKey = getConsentInputKey(field)
		if (consentKey) {
			return consentKey
		}
	}

	return field?.key || `input_${field.id}`
}

const getFieldValue = (field, key) => {
	let value = form.value[key]
	if (hasValue(value)) {
		return value
	}

	if (field?.type === 'consent') {
		const consentElement = typeof document !== 'undefined' ? document.getElementById(key) : null

		if (consentElement && 'checked' in consentElement && consentElement.checked) {
			return '1'
		}

		const fallbackKeys = [field?.key, `input_${field?.id}.1`, `input_${field?.id}_1`].filter(Boolean)

		fallbackKeys.some((fallbackKey) => {
			const fallbackElement = typeof document !== 'undefined' ? document.getElementById(fallbackKey) : null

			if (fallbackElement && 'checked' in fallbackElement && fallbackElement.checked) {
				value = '1'
				return true
			}

			if (hasValue(form.value[fallbackKey])) {
				value = form.value[fallbackKey]
				return true
			}

			return false
		})
	}

	return value
}

const appendMultiChoiceField = (fd, field, value) => {
	const selected = new Set(value.map((item) => String(item)))
	const inputs = Array.isArray(field.inputs) ? field.inputs : []
	const choices = Array.isArray(field.choices) ? field.choices : []

	const inputsByKey = new Map(inputs.filter((input) => input?.key).map((input) => [input.key, input]))
	const choicesByKey = new Map(choices.filter((choice) => choice?.key).map((choice) => [choice.key, choice]))

	if (inputsByKey.size && choicesByKey.size) {
		inputsByKey.forEach((input, inputKey) => {
			const choice = choicesByKey.get(inputKey)
			if (choice && selected.has(String(choice.value))) {
				fd.append(`input_${input.id}`, String(choice.value))
			}
		})
		return
	}

	const normalizeText = (input) =>
		String(input ?? '')
			.replace(/\s+/g, ' ')
			.trim()

	inputs.forEach((input, index) => {
		let choice = choices[index]
		if (!choice) {
			choice = choices.find((item) => normalizeText(item.text) === normalizeText(input.label))
		}
		if (choice && selected.has(String(choice.value))) {
			fd.append(`input_${input.id}`, String(choice.value))
		}
	})
}

const appendFieldValue = (fd, field, key, value) => {
	if (field.type === 'consent') {
		appendConsentField(fd, field, value)
		return
	}

	if (!hasValue(value)) {
		return
	}

	if (field.type === 'multi_choice' && Array.isArray(value)) {
		appendMultiChoiceField(fd, field, value)
		return
	}

	if (field.type === 'fileupload' && value instanceof File) {
		fd.append(key, value, value.name)
		return
	}

	fd.append(key, String(value))
}

const submitForm = async () => {
	if (isSubmitting.value || !formData.value) {
		return
	}

	const fd = new FormData()
	isSubmitting.value = true
	errorData.value = { ...VALIDATION_ERRORS }

	// сериализация значений
	formData.value?.fields?.forEach((field) => {
		const key = getFieldValueKey(field)
		const value = getFieldValue(field, key)

		appendFieldValue(fd, field, key, value)
	})

	if (locale.value || getDocumentLang()) fd.append('input_13', locale.value || getDocumentLang())

	try {
		await fetchJson(FORM_SUBMIT_URL, {
			method: 'POST',
			body: fd
		})

		if (gForm.value) {
			VueScrollTo.scrollTo(gForm.value, { offset: -100 })
		}

		isSubmitted.value = true
		errorData.value = { validation_messages: {} }
	} catch (error) {
		console.error('Form submission failed:', error)
		errorData.value = error.response?.data || { validation_messages: {} }
	} finally {
		isSubmitting.value = false
	}
}

const getFieldComponent = (type) => fieldComponents[type] || fieldComponents.input
</script>
