<template>
	<section v-if="ce.title || ce.text" class="container flex flex-col gap-4 py-8">
		<h2 v-if="ce.title" class="text-2xl font-semibold text-balance">{{ ce.title }}</h2>
		<p v-if="ce.text" class="text-pretty whitespace-pre-line">{{ ce.text }}</p>
	</section>
</template>

<script setup>
defineProps({
	ce: {
		type: Object,
		required: true
	}
})
</script>
