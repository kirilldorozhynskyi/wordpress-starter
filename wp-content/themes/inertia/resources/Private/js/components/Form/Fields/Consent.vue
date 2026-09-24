<template>
	<div :class="field?.cssClass" class="md:col-span-2">
		<div class="mb-2" v-if="field?.description" v-html="field?.description"></div>
		<div class="flex items-start gap-4">
			<Checkbox
				v-model="localValue"
				:inputId="inputId"
				binary
				:required="field?.isRequired"
				:class="{ 'is-invalid': error }"
				:invalid="!!error"
				:aria-invalid="!!error"
				:aria-describedby="error ? inputId + '-error' : undefined"
				class="mt-0.5 rounded-none" />
			<label class="cursor-pointer text-pretty" :for="inputId" v-html="field?.checkboxLabel" />
		</div>
		<Message :id="inputId + '-error'" v-if="error" severity="error" size="small" class="h-inherit flex" variant="simple">{{ error }}</Message>
	</div>
</template>

<script setup>
import { computed, useId, defineAsyncComponent } from 'vue'

const Checkbox = defineAsyncComponent(() => import('primevue/checkbox'))
const Message = defineAsyncComponent(() => import('primevue/message'))

defineProps({
	field: {
		type: Object,
		required: true
	},
	error: {
		type: [String, Boolean],
		default: false
	}
})

const inputId = useId()
const model = defineModel({ required: true })
const localValue = computed({
	get: () => model.value === true || model.value === 1 || model.value === '1',
	set: (value) => {
		model.value = value ? 1 : ''
	}
})
</script>
