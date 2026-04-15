<template>
	<div :class="field?.cssClass" class="w-full">
		<FloatLabel variant="on">
			<InputText
				class="w-full"
				:id="id + field?.key"
				type="tel"
				v-model="model"
				:autocomplete="field?.autocompleteAttribute"
				:name="field?.autocompleteAttribute"
				:invalid="!!error"
				:required="field?.isRequired"
				inputmode="tel"
			/>
			<label :for="id + field?.key" v-html="`${field.label}${field?.isRequired && requiredIndicator == 'asterisk' ? '*' : ''}`" />
		</FloatLabel>
		<Message v-if="error" severity="error" size="small" variant="simple">{{ error }}</Message>
	</div>
</template>

<script setup>
import { computed, useId, defineAsyncComponent } from 'vue'

const Message = defineAsyncComponent(() => import('primevue/message'))
const FloatLabel = defineAsyncComponent(() => import('primevue/floatlabel'))
const InputText = defineAsyncComponent(() => import('primevue/inputtext'))

const id = useId()

const props = defineProps({
	modelValue: {
		required: true
	},
	field: {
		type: Object
	},
	error: {
		type: String
	},
	requiredIndicator: {
		type: String
	}
})

const emit = defineEmits(['update:modelValue'])

const model = computed({
	get: () => props.modelValue,
	set: (value) => emit('update:modelValue', value)
})
</script>
