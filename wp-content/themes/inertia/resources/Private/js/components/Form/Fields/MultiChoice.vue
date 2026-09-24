<template>
	<fieldset :class="['flex w-full flex-col gap-2', field?.cssClass]">
		<legend class="text-pretty" v-html="field.label" />

		<div class="flex flex-col gap-2">
			<label
				v-for="choice in field.choices"
				:key="choice.value"
				class="flex items-center gap-2 rounded border p-3 text-pretty"
				:class="model.includes(choice.value) ? 'border-gray-500 bg-gray-100' : 'border-gray-300 hover:bg-gray-50'"
				:for="`${inputId}-${choice.value}`">
				<Checkbox
					:inputId="`${inputId}-${choice.value}`"
					:value="choice.value"
					v-model="model"
					:aria-invalid="!!error"
					:aria-describedby="error ? inputId + '-error' : undefined" />
				<div class="cursor-pointer pt-0.5 text-sm">
					{{ choice.text }}
				</div>
			</label>
		</div>

		<Message :id="inputId + '-error'" v-if="error" severity="error" class="h-inherit flex" size="small" variant="simple">
			{{ error }}
		</Message>
	</fieldset>
</template>

<script setup>
import { computed, useId, defineAsyncComponent } from 'vue'

const Message = defineAsyncComponent(() => import('primevue/message'))
const Checkbox = defineAsyncComponent(() => import('primevue/checkbox'))

const id = useId()

const props = defineProps({
	modelValue: {
		type: Array,
		default: () => []
	},
	field: {
		type: Object,
		required: true
	},
	form: {
		type: Object,
		required: true
	},
	error: {
		type: [String, Boolean],
		default: false
	},
	requiredIndicator: {
		type: String,
		default: ''
	},
	full: {
		type: Boolean,
		default: false
	}
})

const emit = defineEmits(['update:modelValue'])

const model = computed({
	get: () => (Array.isArray(props.modelValue) ? props.modelValue : []),
	set: (value) => emit('update:modelValue', value)
})
const inputId = computed(() => `${id}-${props.field?.key || 'multichoice'}`)
</script>
