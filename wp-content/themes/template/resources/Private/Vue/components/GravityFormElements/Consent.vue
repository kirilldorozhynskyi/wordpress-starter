<template>
	<div class="mb-1">
		<fieldset>
			<legend v-if="showLegend" v-html="label" class="form-label" />
			<div class="form-check">
				<input :id="id" v-model="value" type="checkbox" :name="id" :required="required" class="form-check-input" :class="{ 'is-invalid': error }" />
				<label :for="id" class="form-check-label" v-html="checkboxLabel" />
				<span class="invalid-feedback" v-html="error" />
			</div>
		</fieldset>
	</div>
</template>

<script>
import Element from './Element.vue'

export default {
	extends: Element,
	props: {
		showLegend: {
			type: Boolean,
			default: false
		}
	},
	computed: {
		checkboxLabel() {
			return this.input.data.checkboxLabel
		}
	},
	methods: {
		submitData() {
			return {
				[`${this.key}_1`]: this.value
			}
		}
	}
}
</script>
