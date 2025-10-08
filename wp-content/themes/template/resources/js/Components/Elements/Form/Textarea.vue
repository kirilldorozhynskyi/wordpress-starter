<template>
	<div>
		<div class="form-floating relative flex">
			<textarea
				:id="field?.key"
				:type="field?.type"
				:required="field?.isRequired"
				:placeholder="field?.placeholder"
				class="h-32 w-full rounded-lg border border-primary/10 p-4 transit focus:border-primary/50 focus:outline-none"
				:class="{ 'border-red': error }"
				:maxlength="field?.maxLength"
				@input="$emit('update:modelValue', $event.target.value)"
			/>
			<!-- <label class="form-label" :for="field?.key" v-html="`${field.label}${requiredIndicator == 'asterisk' ? '*' : ''}`" /> -->

			<span class="absolute bottom-2 right-2 bg-white opacity-60" v-if="field?.maxLength">{{ modelValue?.length || 0 }} / {{ field?.maxLength }}</span>
		</div>

		<span class="invalid-feedback" v-html="error" />
	</div>
</template>

<script setup>
const props = defineProps({
	modelValue: {
		type: String,
		default: '' // Значение по умолчанию для избежания null/undefined
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
