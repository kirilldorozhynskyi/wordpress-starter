<template>
	<div>
		<Header :home-url="homeUrl" :logo="logo" :site-name="siteName" :menu="headerMenu" :languages="languages" />

		<main>
			<slot />
		</main>
		<Footer :site-name="siteName" />
	</div>
</template>

<script setup>
import { usePage } from '@inertiajs/vue3'
import { computed } from 'vue'
import Footer from '@/components/layout/Footer.vue'
import Header from '@/components/layout/Header.vue'

const page = usePage()

const logo = computed(() => page.props?.wp?.logo ?? null)
const homeUrl = computed(() => page.props?.wp?.homeUrl ?? '/')
const siteName = computed(() => page.props?.wp?.name ?? '')
const headerMenu = computed(() => page.props?.menu?.header ?? null)
const languages = computed(() => page.props?.menu?.languages ?? null)
</script>
