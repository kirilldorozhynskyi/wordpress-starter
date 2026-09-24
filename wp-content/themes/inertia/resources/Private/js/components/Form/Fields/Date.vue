<template>
	<div :class="field.cssClass" class="flex min-w-0 flex-col gap-2">
		<label :for="id" class="text-pretty">{{ field.label }}{{ field.isRequired && requiredIndicator === 'asterisk' ? '*' : '' }}</label>
		<input
			v-model="model"
			:id="id"
			:name="field.key"
			type="date"
			:required="field.isRequired"
			class="min-h-11 w-full rounded border border-gray-300 px-3 focus-visible:outline-2 focus-visible:outline-offset-2"
			:aria-invalid="!!error"
			:aria-describedby="error ? `${id}-error` : undefined" />
		<p v-if="error" :id="`${id}-error`" class="text-pretty">{{ error }}</p>
	</div>
</template>
<script setup>
import { useId } from 'vue'
defineProps({ field: { type: Object, required: true }, error: { type: [String, Boolean], default: '' }, requiredIndicator: { type: String, default: '' } })
const id = useId()
const model = defineModel({ required: true })
</script>
