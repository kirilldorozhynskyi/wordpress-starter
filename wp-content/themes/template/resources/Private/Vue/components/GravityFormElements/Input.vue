<template>
	<div>
		<input
			v-if="type === 'hidden'"
			:id="id"
			v-model="value"
			:type="type"
			:required="required"
			:placeholder="placeholder"
			class="form-control"
			:class="{ 'is-invalid': error }"
		/>
		<div v-else class="mb-1">
			<div class="form-floating" :class="{ 'is-invalid': error }">
				<input :id="id" v-model="value" :type="type" :required="required" :placeholder="placeholder" class="form-control" :class="{ 'is-invalid': error }" />
				<label v-if="showLabel" :for="id" v-html="label" />
			</div>
			<span class="invalid-feedback" v-html="error" />
		</div>
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
		},
		showRequired: {
			type: Boolean,
			default: true
		}
	},
	data() {
		return {
			placeholder: `${this.input.data.placeholder}${this.input.data.isRequired && this.showRequired ? ' *' : ''}`
		}
	},
	computed: {
		type() {
			switch (this.input.data.type) {
				case 'phone':
					return 'tel'
				default:
					return this.input.data.type
			}
		}
	}
}
</script>
