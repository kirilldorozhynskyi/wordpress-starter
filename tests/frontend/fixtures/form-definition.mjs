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

export const formDefinition = { fields, button: { text: 'Send test' } }
