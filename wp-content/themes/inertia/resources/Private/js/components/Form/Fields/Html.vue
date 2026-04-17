<template>
	<div class="mt-2 text-xs italic!" :class="field?.cssClass" v-html="field?.content" />
</template>

<script setup>
defineProps({
	field: {
		type: Object,
		required: true,
	},
})
</script>
