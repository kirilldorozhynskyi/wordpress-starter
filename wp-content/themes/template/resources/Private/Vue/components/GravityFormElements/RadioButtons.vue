<template>
	<div class="mb-1">
		<fieldset :class="{ 'is-invalid': error }">
			<legend v-if="showLegend" class="form-label" v-html="label" />
			<div v-for="option in options" :key="option.id" class="form-check" :class="{ 'form-check-inline': inline }">
				<input
					:id="option.id"
					v-model="value"
					type="radio"
					:name="id"
					:required="required"
					:value="option.value"
					class="form-check-input"
					:class="{ 'is-invalid': error }"
				/>
				<label :for="option.id" class="form-check-label" v-html="option.label" />
			</div>
		</fieldset>
		<span class="invalid-feedback" v-html="error" />
	</div>
</template>

<script>
import Element from './Element.vue'

export default {
	extends: Element,
	props: {
		inline: {
			type: Boolean,
			default: false
		},
		showLegend: {
			type: Boolean,
			default: true
		}
	},
	computed: {
		options() {
			const options = {}
			this.input.data.choices.forEach((choice, index) => {
				// eslint-disable-next-line no-plusplus,no-param-reassign
				options[++index] = {
					id: `${this.id}-${choice.value}`,
					label: choice.text,
					value: choice.value
				}
			})
			return options
		}
	}
}
</script>
