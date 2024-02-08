<template>
	<div class="mb-1">
		<label v-if="showLabel" :for="id" v-html="label" class="form-label" />
		<textarea :id="id" v-model="value" :required="required" :placeholder="placeholder" :rows="rows" class="form-control" :class="{ 'is-invalid': error }" />
		<span class="invalid-feedback" v-html="error" />
	</div>
</template>

<script>
import Element from './Element.vue'

export default {
	extends: Element,
	props: {
		rows: {
			type: Number,
			default: 5
		},
		showLabel: {
			type: Boolean,
			default: false
		}
	},
	data() {
		return {
			placeholder: `${this.input.data.placeholder}${this.input.data.isRequired ? '*' : ''}`
		}
	}
}
</script>
