<template>
	<div>
		<div class="form-floating">
			<textarea
				:id="field?.key"
				:type="field?.type"
				:required="field?.isRequired"
				:placeholder="field?.placeholder"
				class="form-control"
				:class="{ 'is-invalid': error }"
				style="height: 84px"
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
