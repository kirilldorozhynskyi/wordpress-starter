<template>
	<div :class="field?.cssClass">
		<div class="form-floating" :class="{ 'is-invalid': error }">
			<input
				:id="field?.key"
				:type="field?.type"
				:required="field?.isRequired"
				:placeholder="field?.placeholder"
				class="form-control"
				:autocomplete="field?.autocompleteAttribute"
				:class="{ 'is-invalid': error }"
				@input="$emit('update:modelValue', $event.target.value)"
			/>
			<label class="form-label" :for="field?.key" v-html="`${field.label}${requiredIndicator == 'asterisk' ? '*' : ''}`" />
		</div>
		<span class="invalid-feedback" v-html="error" />
	</div>
</template>

<script setup>
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
</script>
