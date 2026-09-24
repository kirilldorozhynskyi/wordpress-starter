import type { FormDefinition, FormField, FormValues, FieldValue } from './types'
import { isFieldActive } from './conditions.ts'

const hasValue = (value: FieldValue) => {
	if (Array.isArray(value)) {
		return value.length > 0
	}

	return value !== undefined && value !== null && value !== ''
}

const getConsentInputKey = (field: FormField) => {
	const consentInput = Array.isArray(field?.inputs) ? field.inputs.find((input) => String(input?.id) === `${field.id}.1`) : null
	return consentInput?.id ? `input_${consentInput.id}` : null
}

const normalizeField = (field: FormField) => {
	if (field?.type !== 'consent') {
		return { ...field, key: field.key || `input_${field.id}` }
	}

	const consentKey = getConsentInputKey(field)
	return consentKey ? { ...field, key: consentKey } : field
}

export const normalizeFormData = (data: FormDefinition) => {
	if (!Array.isArray(data?.fields)) {
		return data
	}

	return {
		...data,
		fields: data.fields.map(normalizeField),
	}
}

const appendConsentField = (fd: FormData, field: FormField, value: FieldValue) => {
	if (![true, 1, '1'].includes(value as string | number | boolean)) {
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

const getInitialFieldValue = (field: FormField) => {
	const defaultValue = field?.defaultValue ?? field?.default_value

	switch (field?.type) {
		case 'checkbox':
		case 'multi_choice':
			if (Array.isArray(defaultValue)) {
				return defaultValue
			}

			return defaultValue ? [String(defaultValue)] : (field.choices ?? []).filter((choice) => choice.isSelected).map((choice) => choice.value)
		case 'fileupload':
			return defaultValue ?? null
		case 'consent':
			return defaultValue === 1 || defaultValue === '1' || defaultValue === true ? 1 : ''
		default:
			return defaultValue ?? ''
	}
}

export const buildInitialFormState = (fields: FormField[] = [], currentState: FormValues = {}) =>
	fields.reduce<FormValues>(
		(state, field) => {
			if (!field?.key || state[field.key] !== undefined) {
				return state
			}

			state[field.key] = getInitialFieldValue(field)
			return state
		},
		{ ...currentState }
	)

const appendMultiChoiceField = (fd: FormData, field: FormField, value: string[]) => {
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

	const normalizeText = (input: unknown) =>
		String(input ?? '')
			.replace(/\s+/g, ' ')
			.trim()

	inputs.forEach((input, index) => {
		let choice: NonNullable<FormField['choices']>[number] | undefined = choices[index]
		if (!choice) {
			choice = choices.find((item) => normalizeText(item.text) === normalizeText(input.label))
		}
		if (choice && selected.has(String(choice.value))) {
			fd.append(`input_${input.id}`, String(choice.value))
		}
	})
}

const appendFieldValue = (fd: FormData, field: FormField, key: string, value: FieldValue) => {
	if (field.type === 'consent') {
		appendConsentField(fd, field, value)
		return
	}

	if (!hasValue(value)) {
		return
	}

	if (['multi_choice', 'checkbox'].includes(field.type) && Array.isArray(value)) {
		appendMultiChoiceField(fd, field, value)
		return
	}

	if (field.type === 'fileupload' && typeof File !== 'undefined' && value instanceof File) {
		fd.append(key, value, value.name)
		return
	}

	fd.append(key, String(value))
}

export function serializeForm(fields: FormField[], values: FormValues): FormData {
	const body = new FormData()
	for (const field of fields) {
		if (field.visibility === 'administrative' || !isFieldActive(field, values)) continue
		let value = values[field.key]
		if (field.type === 'date' && typeof value === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value)) {
			const [year, month, day] = value.split('-')
			const format = field.dateFormat || 'mdy'
			const separator = format.includes('.') || format.includes('dot') ? '.' : format.includes('-') || format.includes('dash') ? '-' : '/'
			value = (format.startsWith('ymd') ? [year, month, day] : format.startsWith('dmy') ? [day, month, year] : [month, day, year]).join(separator)
		}
		appendFieldValue(body, field, field.key, value)
	}
	return body
}
