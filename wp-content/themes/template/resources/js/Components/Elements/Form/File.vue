<template>
	<div :class="field?.cssClass">
		<div class="custom-file form-floating" :class="{ 'is-invalid': error }">
			<input :id="field?.key" type="file" @change="handleFileUpload" class="form-control" :class="{ 'is-invalid': error }" ref="fileInput" />

			<label class="form-label" :for="field?.key" v-html="field.label" />

			<span class="invalid-feedback" v-html="error"></span>

			<button v-if="file" @click="removeFile" class="btn-remove btn p-1 text-danger mt-2">
				<!-- <svgicon :name="`trash`"></svgicon> -->
			</button>
		</div>
	</div>
</template>

<script setup>
import { ref } from 'vue'
// import Svgicon from '../SvgIcon.vue'

const props = defineProps({
	modelValue: {
		required: true
	},
	field: {
		type: Object
	},
	error: {
		type: String
	}
})

const file = ref(null)
const fileInput = ref(null)

const emit = defineEmits(['update:modelValue'])

const handleFileUpload = (event) => {
	file.value = event.target.files[0]
	emit('update:modelValue', file.value)
}

const removeFile = () => {
	file.value = null
	fileInput.value.value = null // Clear the file input
	emit('update:modelValue', null)
}
</script>
