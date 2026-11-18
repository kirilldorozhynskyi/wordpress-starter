<template>
	<object type="image/svg+xml" :data="src" :aria-label="alt"></object>
</template>

<script setup>
defineProps({
	src: {
		type: String,
		required: true
	},
	alt: {
		type: String,
		default: ''
	}
})
</script>
