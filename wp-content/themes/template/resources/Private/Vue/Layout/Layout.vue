<template>
	<div>
		<Head :title="seo.title">
			<meta name="description" v-if="seo.description" :content="seo.description" />
		</Head>

		<main>
			<Link href="/cart"> test </Link>
			<Link href="/"> home </Link>
			<slot></slot>
		</main>
	</div>
</template>

<script setup>
import { defineAsyncComponent, hydrateOnVisible, onMounted } from 'vue'
import { Inertia } from '@inertiajs/inertia'

defineProps({
	seo: Object
})

const handlePageChange = () => {
	const appElement = document.getElementById('app')
	if (appElement) {
		appElement.removeAttribute('data-page')
	}
}

const onPageFinish = () => {
	handlePageChange()
}

onMounted(() => {
	handlePageChange()
	Inertia.on('finish', onPageFinish)
})
</script>
