<template>
	<section class="relative h-[calc(100svh-108px)] overflow-hidden max-lg:mt-[123px] max-md:mt-[108px] md:h-[calc(100svh-123px)] lg:h-svh lg:min-h-[650px]">
		<IdPage :ce="ce" />

		<Image
			v-if="ce?.image || ce?.image_mobile"
			class="absolute inset-0 block h-full w-full"
			:image="ce.image"
			:image-mobile="ce.image_mobile"
			:alt="ce?.image?.alt"
			:img-class="'object-cover object-center w-full h-full'"
			size="full"
			sizes="100vw"
			loading="eager"
			fetchpriority="high" />

		<video
			v-if="shouldLoadVideo"
			:key="ce.video"
			class="absolute inset-0 h-full w-full object-cover"
			:class="{ 'opacity-0': !videoPlaying }"
			muted
			autoplay
			loop
			playsinline
			preload="none"
			:data-src="ce.video"
			aria-hidden="true"
			@playing="videoPlaying = true" />

		<div class="absolute inset-0 bg-linear-to-b from-black/40 to-transparent">
			<div class="container h-full items-center justify-center gap-6 text-white max-xl:max-w-full max-xl:px-4">
				<h1 v-if="primaryHeading && ce.text?.trim()" v-html="ce.text" class="title-1 text-center font-thin uppercase" />
				<h2 v-else-if="ce.text?.trim()" v-html="ce.text" class="title-1 text-center font-thin uppercase" />
				<h1 v-else-if="fallbackTitle" class="title-1 text-center font-thin uppercase">{{ fallbackTitle }}</h1>

				<slot />

				<div v-if="heroButton">
					<Button :btn="heroButton" class="btn-primary-dark" />
				</div>
			</div>
		</div>
	</section>
</template>

<script setup>
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { afterLoadAndIdle } from '@/util/performance'

const props = defineProps({
	ce: {
		type: Object,
		required: true
	},
	primaryHeading: {
		type: Boolean,
		default: true
	},
	fallbackTitle: String,
	first: {
		type: Boolean,
		default: false
	},
	divider: {
		type: Boolean,
		default: true
	}
})

const shouldLoadVideo = ref(false)
const videoPlaying = ref(false)
let cancelVideoSchedule = () => {}

const heroButton = computed(() => {
	const button = props.ce?.button

	if (!button || typeof button !== 'object' || Array.isArray(button)) {
		return null
	}

	return button
})

onMounted(() => {
	watch(
		() => props.ce?.video,
		(video) => {
			cancelVideoSchedule()
			shouldLoadVideo.value = false
			videoPlaying.value = false
			if (!video || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

			cancelVideoSchedule = afterLoadAndIdle(() => {
				shouldLoadVideo.value = true
			}, 3000)
		},
		{ immediate: true }
	)
})

onBeforeUnmount(() => {
	cancelVideoSchedule()
})
</script>
