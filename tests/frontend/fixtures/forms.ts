import { createApp, h } from 'vue'
import { createI18n } from 'vue-i18n'
import GForm from '../../../wp-content/themes/inertia/resources/Private/js/components/Form/GForm.vue'
import { registerPrimeVueApp } from '../../../wp-content/themes/inertia/resources/Private/js/util/primevue'
import en from '../../../wp-content/themes/inertia/resources/Private/js/util/lang/en.json'
import '../../../wp-content/themes/inertia/resources/Private/css/style.css'

const fields = [
	{ id: 1, type: 'text', label: 'Name', isRequired: true },
	{ id: 2, type: 'email', label: 'Email', isRequired: true },
	{ id: 3, type: 'date', label: 'Date', dateFormat: 'dmy' },
	{
		id: 4,
		type: 'radio',
		label: 'Contact method',
		choices: [
			{ text: 'Email', value: 'email' },
			{ text: 'Phone', value: 'phone' },
		],
	},
	{
		id: 5,
		type: 'phone',
		label: 'Phone',
		conditionalLogic: { actionType: 'show', logicType: 'all', rules: [{ fieldId: 4, operator: 'is', value: 'phone' }] },
	},
	{ id: 6, type: 'consent', label: 'Consent', checkboxLabel: 'I agree', isRequired: true, inputs: [{ id: '6.1' }] },
	{ id: 7, type: 'textarea', label: 'Message' },
	{ id: 8, type: 'fileupload', label: 'Attachment', allowedExtensions: 'txt,pdf' },
	{
		id: 9,
		type: 'select',
		label: 'Topic',
		choices: [
			{ text: 'General', value: 'general' },
			{ text: 'Support', value: 'support' },
		],
	},
	{ id: 10, type: 'checkbox', label: 'Interests', choices: [{ text: 'News', value: 'news' }], inputs: [{ id: '10.1' }] },
].map((field) => ({ ...field, key: `input_${field.id}`, visibility: 'visible' }))
// Isolated fixture: never send submissions or notifications to WordPress.
window.fetch = async (input, options) => {
	if (String(input).includes('/get-form')) return Response.json({ fields, button: { text: 'Send test' } })
	if (options?.method === 'POST') {
		const name = (options.body as FormData).get('input_1')
		return Response.json(name === 'Invalid' ? { is_valid: false, validation_messages: { 1: 'Use a different test name' } } : { is_valid: true })
	}
	throw new Error('Unexpected fixture request')
}
const app = createApp({ render: () => h('main', { class: 'mx-auto flex max-w-3xl flex-col gap-12 p-6' }, [h(GForm, { id: 1 }), h(GForm, { id: 1 })]) })
registerPrimeVueApp(app)
app.use(createI18n({ legacy: false, locale: 'en', messages: { en } }))
app.mount('#app')
