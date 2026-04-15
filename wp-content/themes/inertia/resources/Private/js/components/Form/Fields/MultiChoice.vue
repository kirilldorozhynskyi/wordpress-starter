<template>
	<div :class="['mt-8 flex w-full flex-col gap-2', field?.cssClass]" v-if="shouldShow">
		<label class="text-mob text-dark-gold leading-[1.4] tracking-[0.4px]" v-html="field.label" />

		<div class="flex flex-col gap-2">
			<label
				v-for="choice in field.choices"
				:key="choice.value"
				class="transit hover:bg flex items-center gap-2 rounded-sm border p-4"
				:class="model.includes(choice.value) ? 'border-grays-200 bg-grays-100' : 'bg-lighter hover:bg-grays-100 border-grays-100'"
				:for="`${inputId}-${choice.value}`"
			>
				<Checkbox :inputId="`${inputId}-${choice.value}`" :value="choice.value" v-model="model" />
				<div class="cursor-pointer pt-0.5 text-sm">
					{{ choice.text }}
				</div>
			</label>
		</div>

		<Message v-if="error" severity="error" class="h-inherit flex" size="small" variant="simple">
			{{ error }}
		</Message>
	</div>
</template>

<script setup>
import { computed, useId, defineAsyncComponent } from 'vue'

const Message = defineAsyncComponent(() => import('primevue/message'))
const Checkbox = defineAsyncComponent(() => import('primevue/checkbox'))

const id = useId()

const props = defineProps({
	modelValue: {
		type: Array,
		default: () => []
	},
	field: {
		type: Object,
		required: true
	},
	form: {
		type: Object,
		required: true
	},
	error: {
		type: [String, Boolean],
		default: false
	},
	requiredIndicator: {
		type: String,
		default: ''
	},
	full: {
		type: Boolean,
		default: false
	}
})

const emit = defineEmits(['update:modelValue'])

const model = computed({
	get: () => (Array.isArray(props.modelValue) ? props.modelValue : []),
	set: (value) => emit('update:modelValue', value)
})
const inputId = computed(() => `${id}-${props.field?.key || 'multichoice'}`)

/**
 * Проверка условий GravityForms conditionalLogic
 */
const shouldShow = computed(() => {
	const logic = props.field?.conditionalLogic
	if (!logic || !logic.enabled) return true

	const results = logic.rules.map((rule) => {
		const fieldKey = `input_${rule.fieldId}`
		const currentValue = props.form[fieldKey]

		switch (rule.operator) {
			case 'is':
				return currentValue === rule.value
			case 'isnot':
				return currentValue !== rule.value
			case 'contains':
				return String(currentValue || '').includes(rule.value)
			case 'greater_than':
				return Number(currentValue) > Number(rule.value)
			case 'less_than':
				return Number(currentValue) < Number(rule.value)
			default:
				return false
		}
	})

	let passed = false
	if (logic.logicType === 'all') {
		passed = results.every(Boolean)
	} else {
		passed = results.some(Boolean)
	}

	return logic.actionType === 'show' ? passed : !passed
})
</script>
