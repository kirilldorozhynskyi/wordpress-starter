<template>
	<fieldset :class="field.cssClass" class="flex min-w-0 flex-col gap-2">
		<legend class="text-pretty" v-html="field.label" />
		<label v-for="(option, index) in field.choices" :key="option.value" :for="`${id}-${index}`" class="flex items-center gap-2 text-pretty">
			<input
				v-model="model"
				:id="`${id}-${index}`"
				:name="id"
				type="radio"
				:value="option.value"
				:required="field.isRequired"
				:aria-invalid="!!error"
				:aria-describedby="error ? `${id}-error` : undefined" />
			<span>{{ option.text }}</span>
		</label>
		<p v-if="error" :id="`${id}-error`" class="text-pretty">{{ error }}</p>
	</fieldset>
</template>
<script setup>
import { useId } from 'vue'
defineProps({ field: { type: Object, required: true }, error: { type: [String, Boolean], default: '' } })
const id = useId()
const model = defineModel({ required: true })
</script>
