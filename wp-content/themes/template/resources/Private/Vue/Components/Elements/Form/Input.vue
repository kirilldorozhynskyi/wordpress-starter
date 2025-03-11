<template>
	<div :class="field?.cssClass" class="w-full">
		<FloatLabel variant="in">
			<InputText
				class="w-full"
				:id="field?.key"
				:type="field?.type"
				v-model="model"
				variant="filled"
				:placeholder="field?.placeholder"
				:autocomplete="field?.autocompleteAttribute"
				:invalid="error"
			/>
			<label :for="field?.key" v-html="`${field.label}${requiredIndicator == 'asterisk' ? '*' : ''}`" />
		</FloatLabel>
	</div>
</template>

<script setup>
import { computed } from 'vue'
import InputText from 'primevue/inputtext'
import FloatLabel from 'primevue/floatlabel'

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
