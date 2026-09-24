<template>
	<Head v-if="pageTitle" :title="pageTitle" />

	<div>
		<Header :home-url="homeUrl" :logo="logo" :site-name="siteName" :menu="headerMenu" />

		<main>
			<slot />
		</main>
		<Footer :site-name="siteName" />
	</div>
</template>

<script setup>
import { Head, router, usePage } from '@inertiajs/vue3'
import { computed, onBeforeUnmount, onMounted } from 'vue'
import Footer from '@/components/layout/Footer.vue'
import Header from '@/components/layout/Header.vue'

const page = usePage()

const pageTitle = computed(() => page.props?.seo?.title ?? page.props?.title ?? null)
const logo = computed(() => page.props?.wp?.logo ?? null)
const homeUrl = computed(() => page.props?.wp?.homeUrl ?? '/')
const siteName = computed(() => page.props?.wp?.name ?? '')
const headerMenu = computed(() => page.props?.menu?.header ?? null)

const syncPageDataAttribute = () => {
	if (typeof document === 'undefined') {
		return
	}

	const appElement = document.getElementById('app')
	if (!appElement) {
		return
	}

	try {
		appElement.setAttribute(
			'data-page',
			JSON.stringify({
				component: page.component,
				props: page.props,
				url: page.url,
				version: page.version,
				clearHistory: page.clearHistory,
				deferredProps: page.deferredProps,
				mergeProps: page.mergeProps,
				prependProps: page.prependProps,
				deepMergeProps: page.deepMergeProps,
				matchPropsOn: page.matchPropsOn,
				rememberedState: page.rememberedState,
				encryptHistory: page.encryptHistory,
				scrollProps: page.scrollProps,
				flash: page.props?.flash ?? {}
			})
		)
	} catch (error) {
		console.error('[Inertia] Failed to sync legacy data-page payload.', error)
	}
}

let removeFinishListener = null

onMounted(() => {
	syncPageDataAttribute()
	removeFinishListener = router.on('finish', () => {
		syncPageDataAttribute()
	})
})

onBeforeUnmount(() => {
	removeFinishListener?.()
})
</script>
