<template>
	<article class="flex-centre">
		<h1>{{ post.title }}</h1>
		<img v-if="post.featuredImage" id="featured-image" :src="post.featuredImage.sizes.full.url" :alt="post.featuredImage.metadata?.alt || post.title" />

		<div v-html="post.content"></div>
		<div>Written by {{ post.author.name }} on {{ publishedDate }}</div>
	</article>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
	post: {
		type: Object,
		default: () => ({})
	}
})

const publishedDate = computed(() => {
	const d = new Date(props.post.createdAt)
	return d.toLocaleString('en-US', {
		dateStyle: 'long',
		timeStyle: 'medium'
	})
})
</script>
