<template>
	<div class="">
		<Head :title="seo.title">
			<meta name="description" v-if="seo.description" :content="seo.description" />
		</Head>

		<main class="flex min-h-screen flex-col">
			<Header :menu="menu.main" />
			<slot></slot>

			<Footer :menu="menu.footer" />
		</main>
	</div>
</template>

<script setup>
import { defineAsyncComponent, hydrateOnVisible, onMounted } from 'vue'
import { Inertia } from '@inertiajs/inertia'
import Header from '@/Components/Partials/Header.vue'

const Footer = defineAsyncComponent({
	loader: () => import('@/Components/Partials/Footer.vue'),
	hydrate: hydrateOnVisible()
})

defineProps({
	seo: Object,
	menu: Object,
	options: [Object, Boolean]
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
