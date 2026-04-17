<template>
	<div :class="field?.cssClass">
		<div class="custom-file form-floating" :class="{ 'is-invalid': error }">
			<input :id="field?.key" type="file" @change="handleFileUpload" class="form-control" :class="{ 'is-invalid': error }" ref="fileInput" />

			<label class="form-label" :for="field?.key" v-html="field.label" />

			<span class="invalid-feedback" v-html="error"></span>

			<button v-if="file" type="button" @click="removeFile" class="btn-remove btn p-1 text-danger mt-2">
				<!-- <svgicon :name="`trash`"></svgicon> -->
			</button>
		</div>
	</div>
</template>

<script setup>
import { ref } from 'vue'
// import Svgicon from '../SvgIcon.vue'

defineProps({
	modelValue: {
		required: true
	},
	field: {
		type: Object,
		default: null,
	},
	error: {
		type: String,
		default: '',
	},
})

const file = ref(null)
const fileInput = ref(null)

const emit = defineEmits(['update:modelValue'])

const handleFileUpload = (event) => {
	const [uploadedFile] = event.target.files || []
	file.value = uploadedFile
	emit('update:modelValue', file.value)
}

const removeFile = () => {
	file.value = null
	fileInput.value.value = null // Clear the file input
	emit('update:modelValue', null)
}
</script>
