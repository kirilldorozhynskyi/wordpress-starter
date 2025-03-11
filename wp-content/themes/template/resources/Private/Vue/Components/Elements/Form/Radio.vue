<template>
	<div :class="field?.cssClass">
		<p class="lead mb-1 fw-medium" v-html="field?.label" />
		<div :class="{ 'is-invalid': error }" class="d-flex flex-wrap gap-half">
			<div v-for="(option, index) in field?.choices" :key="index">
				<input
					v-model="localValue"
					:required="field?.isRequired"
					type="radio"
					class="btn-check"
					:name="`radio-${field?.id}`"
					:id="`input-${field?.id}-${index}`"
					:value="option.value"
				/>
				<label class="btn btn-outline-light-pink btn-radio" :for="`input-${field?.id}-${index}`" v-html="option.text" />
			</div>
		</div>

		<span class="invalid-feedback" v-html="error"></span>
	</div>
</template>

<script setup>
import { computed } from 'vue'

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

const localValue = computed({
	get() {
		return props.modelValue
	},
	set(value) {
		emit('update:modelValue', value)
	}
})
</script>
