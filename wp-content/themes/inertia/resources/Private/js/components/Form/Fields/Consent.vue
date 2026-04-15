<template>
	<div :class="field?.cssClass" class="mt-8">
		<div class="mb-2" v-if="field?.description" v-html="field?.description"></div>
		<div class="flex items-start gap-4">
			<Checkbox
				v-model="localValue"
				:inputId="field?.key"
				binary
				:required="field?.isRequired"
				:class="{ 'is-invalid': error }"
				:invalid="error"
				class="mt-0.5 rounded-none"
			/>
			<label class="text-mob cursor-pointer leading-[1.4] tracking-[0.5px]" :for="field?.key" v-html="field?.checkboxLabel" />
		</div>
		<Message v-if="error" severity="error" size="small" class="h-inherit flex" variant="simple">{{ error }}</Message>
	</div>
</template>

<script setup>
import { ref, watch, defineAsyncComponent } from 'vue'
const Checkbox = defineAsyncComponent(() => import('primevue/checkbox'))
const Message = defineAsyncComponent(() => import('primevue/message'))

const props = defineProps({
	modelValue: {
		required: true
	},
	field: {
		type: Object,
		required: true
	},
	error: {
		type: [String, Boolean],
		default: false
	}
})

const emit = defineEmits(['update:modelValue'])

const normalizeConsentValue = (value) => value === true || value === 1 || value === '1'

const localValue = ref(normalizeConsentValue(props.modelValue))

watch(
	() => props.modelValue,
	(newValue) => {
		localValue.value = normalizeConsentValue(newValue)
	}
)

watch(localValue, (newValue) => {
	emit('update:modelValue', newValue ? 1 : '')
})
</script>
