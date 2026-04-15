<template>
	<object lazy type="image/svg+xml" :data-src="src"></object>
</template>

<script setup>
import { onMounted, inject } from 'vue'

defineProps({
	src: {
		type: String,
		required: true
	}
})

const lazyLoad = inject('lazyLoad')

onMounted(() => {
	lazyLoad?.update()
})
</script>
