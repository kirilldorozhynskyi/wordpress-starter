<template>
	<picture v-if="source.src" class="picture">
		<source
			v-if="mobileSource.src"
			:media="mobileMedia"
			:srcset="mobileSource.srcset || mobileSource.src"
			:sizes="mobileSource.hasWidths ? sizes : undefined"
			:width="mobileSource.width"
			:height="mobileSource.height" />
		<source
			v-for="variant in mediaSources"
			:key="variant.media"
			:media="variant.media"
			:srcset="variant.srcset"
			:sizes="variant.hasWidths ? sizes : undefined"
			:width="variant.width"
			:height="variant.height" />
		<img
			:src="source.src"
			:srcset="source.srcset || undefined"
			:sizes="source.hasWidths ? sizes : undefined"
			:class="imgClass"
			:loading="imageLoading"
			:fetchpriority="fetchpriority || fetchPriority || 'auto'"
			:decoding="decoding"
			:width="width ?? source.width"
			:height="height ?? source.height"
			:alt="alt ?? baseImage?.alt ?? baseImage?.metadata?.alt ?? ''" />
	</picture>
</template>

<script setup>
import { computed } from 'vue'
import { getMediaEntries, getNativeImageSource, getNativeMediaSource } from '@/util/responsive-image.mjs'

const props = defineProps({
	image: {
		type: [Object, String, Boolean],
		required: true,
		default: false
	},
	imageMobile: { type: [Object, String, Boolean], default: false },
	mobileMedia: { type: String, default: '(width < 48rem)' },
	size: { type: String, default: 'full' },
	sizeRetina: String,
	size_retina: String,
	sizes: { type: String, default: '100vw' },
	media: { type: Object, default: () => ({}) },
	retina: { type: Boolean, default: true },
	alt: String,
	imgClass: String,
	width: Number,
	height: Number,
	lazy: { type: Boolean, default: true },
	loading: String,
	fetchpriority: String,
	fetchPriority: String,
	decoding: { type: String, default: 'async' }
})

const baseImage = computed(() => props.image || props.imageMobile)
const imageLoading = computed(() => props.loading || (props.lazy ? 'lazy' : 'eager'))
const source = computed(() =>
	getNativeImageSource(baseImage.value, {
		size: props.size,
		sizeRetina: props.sizeRetina || props.size_retina,
		retina: props.retina
	})
)
const mobileSource = computed(() => getNativeImageSource(props.image && props.imageMobile, { retina: props.retina }))
const mediaSources = computed(() =>
	getMediaEntries(props.media).flatMap(([breakpoint, config]) => {
		const image = config.image || baseImage.value
		const media = `(max-width: ${Number(breakpoint)}px)`
		if (!config.size && !config.image) return []

		const variant = getNativeMediaSource(image, config, props.retina)
		return variant ? [{ ...variant, media }] : []
	})
)
</script>
