<template>
	<div :class="field?.cssClass" class="w-full">
		<FloatLabel variant="on">
			<InputText
				class="w-full"
				:id="id + field?.key"
				:type="['email', 'number', 'url', 'password', 'date'].includes(field?.type) ? field.type : 'text'"
				v-model="model"
				:autocomplete="field?.autocompleteAttribute"
				:name="field?.key"
				:invalid="!!error"
				:required="field?.isRequired"
				:aria-invalid="!!error"
				:aria-describedby="error ? id + field?.key + '-error' : undefined" />
			<label :for="id + field?.key" v-html="`${field.label}${field?.isRequired && requiredIndicator == 'asterisk' ? '*' : ''}`" />
		</FloatLabel>

		<Message :id="id + field?.key + '-error'" v-if="error" severity="error" size="small" class="h-inherit flex" variant="simple">{{ error }}</Message>
	</div>
</template>

<script setup>
import { useId, defineAsyncComponent } from 'vue'

const Message = defineAsyncComponent(() => import('primevue/message'))
const FloatLabel = defineAsyncComponent(() => import('primevue/floatlabel'))
const InputText = defineAsyncComponent(() => import('primevue/inputtext'))

const id = useId()

defineProps({
	field: {
		type: Object,
		default: null
	},
	error: {
		type: [String, Boolean],
		default: false
	},
	requiredIndicator: {
		type: String,
		default: ''
	}
})

const model = defineModel({ required: true })
</script>
