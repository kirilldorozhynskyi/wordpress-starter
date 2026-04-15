<template>
	<div :class="field?.cssClass" class="mt-8 flex w-full">
		<Textarea
			class="w-full"
			:id="id + field?.key"
			:type="field?.type"
			v-model="model"
			:autocomplete="field?.autocompleteAttribute"
			:invalid="error"
			:required="field?.isRequired"
			:placeholder="field.label"
		/>
		<!-- <label :for="id + field?.key" v-html="`${field.label}${field?.isRequired && requiredIndicator == 'asterisk' ? '*' : ''}`" /> -->
		<Message v-if="error" severity="error" size="small" variant="simple">{{ error }}</Message>
	</div>
</template>

<script setup>
import { computed, useId, defineAsyncComponent } from 'vue'
const Textarea = defineAsyncComponent(() => import('primevue/textarea'))
const FloatLabel = defineAsyncComponent(() => import('primevue/floatlabel'))
const Message = defineAsyncComponent(() => import('primevue/message'))

const id = useId()

const props = defineProps({
	modelValue: {
		required: true
	},
	field: {
		type: Object
	},
	error: {
		type: [String, Boolean],
		default: false
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
