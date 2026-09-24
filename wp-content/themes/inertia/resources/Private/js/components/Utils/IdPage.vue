<template>
	<span
		class="absolute top-0 left-0"
		v-if="ce?.add_to_submenu && ce?.title_nav"
		:id="
			ce.title_nav
				.toLowerCase()
				.trim()
				.replace(/\s+/g, '-')
				.replace(/[^\w\-]+/g, '')
		"
	/>
</template>

<script setup>
defineProps({
	ce: {
		type: Object,
		required: true,
	},
})
</script>
