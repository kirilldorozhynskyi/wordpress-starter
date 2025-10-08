<template>
	<div :class="field?.cssClass">
		<div class="relative rounded-md shadow-sm">
			<div class="absolute inset-y-0 left-0 flex items-center pl-3">
				<select
					v-model="localCode"
					id="countries"
					class="select text-gray-600 block h-auto w-full appearance-none rounded-none !border-r border-primary/10 p-0 pr-5 text-base focus:outline-none"
				>
					<option v-for="iso in jsonData" :key="iso.dial_code" :value="iso.dial_code" v-html="iso.dial_code" />
				</select>
			</div>

			<input
				:id="field?.key"
				:type="field?.type"
				:required="field?.isRequired"
				:placeholder="field?.placeholder"
				class="w-full rounded-lg border border-primary/10 p-4 pl-24 transit focus:border-primary/50 focus:outline-none"
				:class="{ 'border-red': error }"
				v-model="localInput"
			/>
		</div>

		<span class="invalid-feedback" v-html="error" />

		{{ error }}
	</div>
</template>

<script setup>
import jsonData from '@/util/iso3.json'
import { ref, watch, onMounted } from 'vue'

const props = defineProps({
	modelValue: {
		required: true
	},
	field: {
		type: Object
	},
	error: {
		type: String
	}
})

const emit = defineEmits(['update:modelValue'])

const localCode = ref('')
const localInput = ref('')

// Установить код страны по умолчанию
onMounted(() => {
	const defaultCountry = jsonData.find((iso) => iso.default)
	if (defaultCountry) {
		localCode.value = defaultCountry.dial_code
	}
})

// Следим за изменениями кода страны и инпута, чтобы объединить их
watch([localCode, localInput], ([newCode, newInput]) => {
	emit('update:modelValue', newCode + newInput)
})
</script>

<style lang="scss">
.select {
	background-position: center right 0.5rem;
	background-repeat: no-repeat;
	background-image: url("data:image/svg+xml,%3Csvg width='8' height='6' viewBox='0 0 8 6' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M3.40573 5.0002L0.805725 2.4002C0.489058 2.08353 0.418392 1.7212 0.593725 1.3132C0.768392 0.904529 1.08073 0.700195 1.53073 0.700195H6.68072C7.13072 0.700195 7.44306 0.904529 7.61772 1.3132C7.79306 1.7212 7.72239 2.08353 7.40573 2.4002L4.80572 5.0002C4.70572 5.1002 4.59739 5.17519 4.48073 5.22519C4.36406 5.2752 4.23906 5.3002 4.10573 5.3002C3.97239 5.3002 3.84739 5.2752 3.73073 5.22519C3.61406 5.17519 3.50573 5.1002 3.40573 5.0002Z' fill='black'/%3E%3C/svg%3E%0A");
}
</style>
