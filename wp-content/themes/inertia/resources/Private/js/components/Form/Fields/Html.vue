<template>
	<div class="mt-2 text-xs italic!" :class="field?.cssClass" v-html="field?.content" />
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
	field: {
		type: Object,
		required: true
	}
})
</script>
