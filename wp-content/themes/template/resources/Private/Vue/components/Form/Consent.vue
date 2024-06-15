<template>
	<div :class="field?.cssClass">
		<div class="mb-2" v-if="field?.description" v-html="field?.description"></div>
		<div class="form-check">
			<input
				class="form-check-input"
				type="checkbox"
				:id="field?.key"
				v-model="localValue"
				:name="field?.key"
				:required="field?.isRequired"
				:class="{ 'is-invalid': error }"
			/>
			<label :for="field?.key" class="form-check-label" v-html="field?.checkboxLabel"></label>
			<span class="invalid-feedback" v-html="error"></span>
		</div>
	</div>
</template>

<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
	modelValue: {
		required: true
	},
	field: {
		type: Object,
		required: true
	},
	error: {
		type: String
	}
})

const emit = defineEmits(['update:modelValue'])

const localValue = ref(props.modelValue)

watch(
	() => props.modelValue,
	(newValue) => {
		localValue.value = newValue === 1
	}
)

// Watch for changes in localValue and emit update to parent
watch(localValue, (newValue) => {
	emit('update:modelValue', newValue ? 1 : '')
})
</script>
