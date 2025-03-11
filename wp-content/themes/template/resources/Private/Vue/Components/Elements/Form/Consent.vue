<template>
	<div :class="field?.cssClass" class="order-2">
		<div class="mb-2" v-if="field?.description" v-html="field?.description"></div>
		<div class="flex items-center gap-2">
			<Checkbox
				v-model="localValue"
				:inputId="field?.key"
				binary
				:required="field?.isRequired"
				:class="{ 'is-invalid': error }"
				:invalid="error"
				class="rounded-none"
			/>
			<label :for="field?.key" v-html="field?.checkboxLabel" />
		</div>
		<Message v-if="error" severity="error" size="small" variant="simple">{{ error }}</Message>
	</div>
</template>

<script setup>
import { ref, watch } from 'vue'
import Checkbox from 'primevue/checkbox'
import Message from 'primevue/message'

const props = defineProps({
	modelValue: {
		required: true
	},
	field: {
		type: Object,
		required: true
	},
	error: {
		type: String
	}
})

const emit = defineEmits(['update:modelValue'])

const localValue = ref(props.modelValue)

watch(
	() => props.modelValue,
	(newValue) => {
		localValue.value = newValue === 1
	}
)

// Watch for changes in localValue and emit update to parent
watch(localValue, (newValue) => {
	emit('update:modelValue', newValue ? 1 : '')
})
</script>

<style>
.p-checkbox-box {
	--p-checkbox-background: transparent;
	--p-checkbox-border-radius: 0;
	--p-checkbox-border-color: white;
}
</style>
