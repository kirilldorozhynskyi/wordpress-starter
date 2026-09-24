<template>
	<div :class="field.cssClass" class="flex min-w-0 flex-col gap-2">
		<label :for="id" class="text-pretty" v-html="field.label" />
		<input
			ref="fileInput"
			:id="id"
			:name="field.key"
			type="file"
			:required="field.isRequired"
			:accept="accept"
			:aria-invalid="!!error"
			:aria-describedby="error ? `${id}-error` : undefined"
			@change="handleFileUpload" />
		<p v-if="error" :id="`${id}-error`" class="text-pretty">{{ error }}</p>
		<button v-if="model" type="button" @click="removeFile" class="self-start underline">
			<!-- <svgicon :name="`trash`"></svgicon> -->
			{{ $t('form.remove_file') }}
		</button>
	</div>
</template>
<script setup>
import { computed, useId, useTemplateRef, watch } from 'vue'
// import Svgicon from '../SvgIcon.vue'
const props = defineProps({ field: { type: Object, required: true }, error: { type: [String, Boolean], default: '' } })
const model = defineModel({ required: true })
const id = useId()
const fileInput = useTemplateRef('fileInput')
const accept = computed(() =>
	(props.field.allowedExtensions || '')
		.split(',')
		.map((value) => value.trim())
		.filter(Boolean)
		.map((value) => `.${value.replace(/^\./, '')}`)
		.join(',')
)
const handleFileUpload = (event) => {
	model.value = event.target.files?.[0] ?? null
}
const removeFile = () => {
	model.value = null
	fileInput.value?.focus()
}
watch(model, (value) => {
	if (!value && fileInput.value) fileInput.value.value = ''
})
</script>
