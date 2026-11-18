import { createApp, h } from 'vue'
import { createI18n } from 'vue-i18n'
import GForm from '../../../wp-content/themes/inertia/resources/Private/js/components/Form/GForm.vue'
import { registerPrimeVueApp } from '../../../wp-content/themes/inertia/resources/Private/js/util/primevue'
import en from '../../../wp-content/themes/inertia/resources/Private/js/util/lang/en.json'
import '../../../wp-content/themes/inertia/resources/Private/css/style.css'
import { formDefinition } from './form-definition.mjs'

const options = new URLSearchParams(location.search)
// The browser suite stubs the HTTP routes itself to inspect the requests.
if (!options.has('e2e')) {
	window.fetch = async (input, options) => {
		if (String(input).includes('/get-form')) return Response.json(formDefinition)
		if (options?.method === 'POST') {
			const name = (options.body as FormData).get('input_1')
			return Response.json(name === 'Invalid' ? { is_valid: false, validation_messages: { 1: 'Use a different test name' } } : { is_valid: true })
		}
		throw new Error('Unexpected fixture request')
	}
}

const forms = options.has('single') ? [1] : [1, 2]
const app = createApp({
	render: () =>
		h(
			'main',
			{ class: 'mx-auto flex max-w-3xl flex-col gap-12 p-6' },
			forms.map((key) => h(GForm, { id: 1, key }))
		),
})
registerPrimeVueApp(app)
app.use(createI18n({ legacy: false, locale: 'en', messages: { en } }))
app.mount('#app')
