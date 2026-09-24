export type FieldValue = string | number | boolean | string[] | File | null
export type FormValues = Record<string, FieldValue>
export interface FormField {
	id: string | number
	key: string
	type: string
	visibility?: string
	label?: string
	checkboxLabel?: string
	consentRevisionId?: string | number
	defaultValue?: FieldValue
	default_value?: FieldValue
	dateFormat?: string
	inputName?: string
	inputs?: { id: string | number; key?: string; label?: string }[]
	choices?: { key?: string; text: string; value: string; isSelected?: boolean }[]
	conditionalLogic?: {
		enabled?: boolean
		actionType: string
		logicType: string
		rules: { fieldId: string | number; operator: string; value: string }[]
	} | null
}
export interface FormDefinition {
	fields: FormField[]
	requiredIndicator?: string
	button?: { text?: string }
}
export interface SubmissionResult {
	is_valid: boolean
	validation_messages?: Record<string, string>
	confirmation_message?: string
	confirmation_redirect?: string
}
