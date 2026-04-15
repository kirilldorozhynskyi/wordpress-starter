<template>
	<div :class="['mt-10 flex w-full flex-col gap-2', field?.cssClass]">
		<label
			class="text-xs leading-[1.4] tracking-[0.25px]"
			:for="inputId"
			v-html="`${field.label}${field?.isRequired && requiredIndicator === 'asterisk' ? '*' : ''}`"
		/>
		<Select
			v-model="model"
			:options="field.choices"
			optionValue="value"
			optionLabel="text"
			class="w-full"
			:required="field?.isRequired"
			:placeholder="field?.placeholder"
			:id="inputId"
			:invalid="error"
			:inputId="inputId"
		/>

		<Message v-if="error" severity="error" class="h-inherit flex" size="small" variant="simple">
			{{ error }}
		</Message>
	</div>
</template>

<script setup>
import { computed, useId, defineAsyncComponent } from 'vue'

const Message = defineAsyncComponent(() => import('primevue/message'))
const Select = defineAsyncComponent(() => import('primevue/select'))

const id = useId()

const props = defineProps({
	modelValue: {
		required: true
	},
	field: {
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
	get: () => props.modelValue,
	set: (value) => emit('update:modelValue', value)
})

// уникальный inputId
const inputId = computed(() => `${id}-${props.field?.key || 'select'}`)
</script>
