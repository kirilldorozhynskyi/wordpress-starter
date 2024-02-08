<template>
	<div class="mb-1">
		<div class="form-floating" :class="{ 'is-invalid': error }">
			<select :id="id" v-model="value" :required="required" class="form-select" :class="{ 'is-invalid': error }">
				<option :value="null" selected />
				<option v-for="option in options" :key="option.id" :value="option.value" v-html="option.text" />
			</select>
			<label v-if="showLabel" :for="id" v-html="label" />
		</div>
		<span class="invalid-feedback" v-html="error" />
	</div>
</template>

<script>
import Element from './Element.vue'

export default {
	extends: Element,
	props: {
		showLabel: {
			type: Boolean,
			default: true
		}
	},
	data() {
		return {
			options: this.input.data.choices,
			placeholder: `${this.input.data.placeholder}${this.input.data.isRequired ? '*' : ''}`
		}
	}
}
</script>
