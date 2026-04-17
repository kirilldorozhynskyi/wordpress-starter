<template>
	<Head>
		<link v-if="heroPosterSrc" rel="preload" :href="heroPosterSrc" as="image" />
	</Head>

	<section class="relative h-[calc(100svh-108px)] overflow-hidden max-lg:mt-[123px] max-md:mt-[108px] md:h-[calc(100svh-123px)] lg:h-svh lg:min-h-[650px]">
		<IdPage :ce="ce" />

		<Image
			v-if="ce?.image"
			class="absolute inset-0 block h-full w-full"
			:image="ce.image"
			:alt="ce?.image?.alt"
			:width="heroImageWidth"
			:height="heroImageHeight"
			:img-class="'object-cover object-center w-full h-full'"
			:lazy="false"
			loading="eager"
			fetch-priority="high"
			decoding="async"
			resize-type="fill"
			:transform-width="1600"
			:transform-height="920"
		/>

		<!-- <Image
			v-if="ce?.image"
			class="absolute inset-0 block h-full w-full"
			:image="ce.image"
			:alt="ce?.image?.alt"
			:width="heroImageWidth"
			:height="heroImageHeight"
			:img-class="'object-cover object-center w-full h-full'"
			size="full"
			:lazy="false"
			loading="eager"
			fetch-priority="high"
			decoding="async"
		/>

		<video
			v-if="shouldLoadVideo"
			ref="heroVideo"
			class="absolute inset-0 h-full w-full object-cover"
			muted
			:autoplay="shouldLoadVideo"
			loop
			playsinline
			preload="none"
			:poster="heroPosterSrc"
			aria-hidden="true"
		>
			<source v-if="shouldLoadVideo" type="video/mp4" :src="ce.video" />
		</video> -->

		<div class="absolute inset-0 bg-linear-to-b from-black/40 to-transparent">
			<div class="container h-full items-center justify-center gap-6 text-white max-xl:max-w-full max-xl:px-4">
				<h1 v-if="ce.text" v-html="ce.text" class="title-1 text-center font-thin uppercase" />

				<slot />

				<div v-if="heroButton">
					<Button :btn="heroButton" class="btn-primary-dark" />
				</div>
			</div>
		</div>
	</section>

	<Image
		v-if="ce?.image"
		:image="ce.image"
		:alt="ce?.image?.alt"
		:width="heroImageWidth"
		:height="heroImageHeight"
		resize-type="fill"
		:transform-width="heroImageWidth"
		:transform-height="heroImageHeight"
	/>
</template>

<script setup>
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { afterLoadAndIdle, isPerformanceAudit } from '@/util/performance'

const props = defineProps({
	ce: {
		type: Object,
		required: true
	},
	first: {
		type: Boolean,
		default: false
	},
	divider: {
		type: Boolean,
		default: true
	}
})

const heroVideo = ref(null)
const shouldLoadVideo = ref(false)
let cancelVideoSchedule = () => {}

const heroPosterSrc = computed(() => props.ce?.image?.sizes?.full || props.ce?.image?.url || '')
const heroImageWidth = computed(() => Number(props.ce?.image?.width) || 1920)
const heroImageHeight = computed(() => Number(props.ce?.image?.height) || 1080)
const heroButton = computed(() => {
	const button = props.ce?.button

	if (!button || typeof button !== 'object' || Array.isArray(button)) {
		return null
	}

	return button
})

const canAutoloadHeroVideo = () => {
	if (typeof window === 'undefined' || !props.ce?.video || isPerformanceAudit()) {
		return false
	}

	const prefersReducedMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false

	return !prefersReducedMotion
}

onMounted(() => {
	if (!canAutoloadHeroVideo()) {
		return
	}

	cancelVideoSchedule = afterLoadAndIdle(() => {
		shouldLoadVideo.value = true
	}, 3000)
})

watch(shouldLoadVideo, async (enabled) => {
	if (!enabled) {
		return
	}

	await nextTick()
	heroVideo.value?.load()
})

onBeforeUnmount(() => {
	cancelVideoSchedule()
})
</script>
