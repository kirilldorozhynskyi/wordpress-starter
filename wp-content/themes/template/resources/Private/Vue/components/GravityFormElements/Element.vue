<script>
import snakeCase from 'lodash/snakeCase'

export default {
	abstract: true,
	inject: ['gravityForm'],
	props: {
		input: {
			type: Object,
			required: true
		}
	},
	data() {
		return {
			key: this.input.key,
			value: this.input.value,
			error: this.input.error,
			id: snakeCase(`ce-${this.gravityForm.ceId}${this.gravityForm.name}${this.gravityForm.id}${this.input.key}${this.input.data.adminLabel}`),
			label: `${this.input.data.label}${this.input.data.isRequired ? '*' : ''}`,
			required: this.input.data.isRequired
		}
	},
	created() {
		this.gravityForm.formElements[this.key] = this
	},
	unmounted() {
		delete this.gravityForm.formElements[this.key]
	},
	methods: {
		submitData() {
			/* Default method used for submitting data to parent gravity form, override if needed */
			return {
				[this.key]: this.value
			}
		}
	}
}
</script>
