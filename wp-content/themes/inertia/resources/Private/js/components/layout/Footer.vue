<template>
	<footer>
		<SvgIcon name="angle" />
		<div>&copy; {{ year }} {{ siteName }}</div>
	</footer>
</template>

<script setup>
import { computed } from 'vue'

defineProps({
	siteName: {
		type: String,
		default: ''
	}
})

const year = computed(() => new Date().getFullYear())
</script>
