<template>
	<object lazy type="image/svg+xml" :data-src="src" :aria-label="alt"></object>
</template>

<script setup>
import { onMounted, inject } from 'vue'

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

const lazyLoad = inject('lazyLoad')

onMounted(() => {
	lazyLoad?.update()
})
</script>
