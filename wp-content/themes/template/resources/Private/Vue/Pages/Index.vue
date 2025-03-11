<template>
	<div>
		<FlexibleContent v-if="fields.flexible_content" :fields="fields.flexible_content" />
	</div>
</template>

<script setup>
import FlexibleContent from '@/Components/Acf/FlexibleContent.vue'

defineProps({
	fields: {
		type: [Object, Boolean],
		required: false,
		default: () => ({})
	}
})
</script>
