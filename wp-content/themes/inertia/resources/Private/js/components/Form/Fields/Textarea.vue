<template>
	<div :class="field?.cssClass" class="flex w-full flex-col">
		<FloatLabel variant="on">
			<Textarea
				class="w-full"
				:name="field?.key"
				:id="id + field?.key"
				v-model="model"
				:autocomplete="field?.autocompleteAttribute"
				:invalid="!!error"
				:required="field?.isRequired"
				:aria-invalid="!!error"
				:aria-describedby="error ? id + field?.key + '-error' : undefined" />
			<label :for="id + field?.key" v-html="`${field.label}${field?.isRequired && requiredIndicator == 'asterisk' ? '*' : ''}`" />
		</FloatLabel>
		<Message :id="id + field?.key + '-error'" v-if="error" severity="error" size="small" variant="simple">{{ error }}</Message>
	</div>
</template>

<script setup>
import { useId, defineAsyncComponent } from 'vue'

const Textarea = defineAsyncComponent(() => import('primevue/textarea'))
const FloatLabel = defineAsyncComponent(() => import('primevue/floatlabel'))
const Message = defineAsyncComponent(() => import('primevue/message'))

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
