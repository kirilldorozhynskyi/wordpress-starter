import type { FormField, FormValues } from './types'

export function isFieldActive(field: FormField, values: FormValues): boolean {
	const logic = field.conditionalLogic
	if (!logic || logic.enabled === false || !logic.rules?.length) return true
	const results = logic.rules.map((rule) => {
		const value = values[`input_${rule.fieldId}`] ?? values[`input_${rule.fieldId}.1`] ?? ''
		const items = Array.isArray(value) ? value.map(String) : [String(value)]
		switch (rule.operator) {
			case 'is':
				return items.includes(String(rule.value))
			case 'isnot':
				return !items.includes(String(rule.value))
			case 'contains':
				return items.some((item) => item.includes(rule.value))
			case 'starts_with':
				return items.some((item) => item.startsWith(rule.value))
			case 'ends_with':
				return items.some((item) => item.endsWith(rule.value))
			case 'greater_than':
				return Number(value) > Number(rule.value)
			case 'less_than':
				return Number(value) < Number(rule.value)
			default:
				return false
		}
	})
	const passed = logic.logicType === 'all' ? results.every(Boolean) : results.some(Boolean)
	return logic.actionType === 'hide' ? !passed : passed
}
