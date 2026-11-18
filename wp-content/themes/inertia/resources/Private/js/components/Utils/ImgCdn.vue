<template>
	<picture v-if="hasImage" class="picture">
		<source
			v-if="mobileSource.src"
			:media="mobileMedia"
			:srcset="mobileSource.srcset || mobileSource.src"
			:sizes="mobileSource.hasWidths ? sizes : undefined"
			:width="mobileSource.width"
			:height="mobileSource.height" />
		<source
			v-for="source in responsiveSources"
			:key="source.media"
			:media="source.media"
			:srcset="source.srcset"
			:sizes="source.hasWidths ? sizes : undefined"
			:width="source.width"
			:height="source.height"
			:type="source.type" />

		<img
			:src="resolvedSrc || svgPlaceholder"
			:class="imgClass"
			:loading="loadingAttr"
			:fetchpriority="fetchPriority"
			:decoding="decoding"
			:srcset="source.srcset || null"
			:sizes="source.hasWidths ? sizes : undefined"
			:width="resolvedWidth"
			:height="resolvedHeight"
			:alt="resolvedAlt" />
	</picture>
</template>

<script setup>
import { computed } from 'vue'
import { densitySrcset, getMediaEntries, getNativeImageSource, getNativeMediaSource } from '@/util/responsive-image.mjs'

const props = defineProps({
	image: {
		type: [Object, String, Boolean],
		required: true,
		default: false
	},

	imageMobile: {
		type: [Object, String, Boolean],
		default: false
	},

	mobileMedia: {
		type: String,
		default: '(width < 48rem)'
	},

	sizes: {
		type: String,
		default: '100vw'
	},

	sizeRetina: String,
	size_retina: String,

	alt: String,

	width: {
		type: Number,
		default: null
	},

	height: {
		type: Number,
		default: null
	},

	imgClass: {
		type: String,
		default: ''
	},

	lazy: {
		type: Boolean,
		default: true
	},

	loading: {
		type: String,
		default: null
	},

	fetchPriority: {
		type: String,
		default: null
	},

	decoding: {
		type: String,
		default: 'async'
	},

	media: {
		type: Object,
		default: () => ({})
	},

	cdnBase: {
		type: String,
		default: import.meta.env.VITE_CDN_BASE || ''
	},

	size: {
		type: String,
		default: 'full'
	},

	transform: {
		type: String,
		default: null
	},

	resizeType: {
		type: String,
		default: null // fit | fill | auto | force
	},

	transformWidth: {
		type: Number,
		default: null
	},

	transformHeight: {
		type: Number,
		default: null
	},

	format: {
		type: String,
		default: 'webp' // webp | avif | jpg | png
	},

	quality: {
		type: Number,
		default: 80
	},

	gravity: {
		type: String,
		default: null // ce | sm | no | so ...
	},

	dpr: {
		type: Number,
		default: null
	},

	retina: {
		type: Boolean,
		default: true
	},

	retinaDpr: {
		type: Number,
		default: 2
	}
})

const hasImage = computed(() => Boolean(props.image || props.imageMobile))
const loadingAttr = computed(() => props.loading || (props.lazy ? 'lazy' : 'eager'))
const baseImage = computed(() => props.image || props.imageMobile)
const resolvedAlt = computed(() => props.alt ?? baseImage.value?.alt ?? baseImage.value?.metadata?.alt ?? '')
const nativeSource = computed(() =>
	getNativeImageSource(baseImage.value, { size: props.size, sizeRetina: props.sizeRetina || props.size_retina, retina: props.retina })
)
const mobileSource = computed(() => getNativeImageSource(props.image && props.imageMobile, { retina: props.retina }))
const resolvedWidth = computed(() => props.width ?? nativeSource.value.width)
const resolvedHeight = computed(() => props.height ?? nativeSource.value.height)

const normalizeBase = (base) => String(base || '').replace(/\/+$/, '')
const parseUrl = (url) => {
	try {
		return new URL(url)
	} catch {
		return null
	}
}
const cdnBase = computed(() => normalizeBase(props.cdnBase))
const cdnHost = computed(() => parseUrl(cdnBase.value)?.hostname)
const cdnPath = computed(() => {
	const url = parseUrl(nativeSource.value.src)
	return url && url.hostname === cdnHost.value ? url.pathname.replace(/^\/+/, '') : ''
})

const buildTransform = ({
	transform = null,
	resizeType = null,
	width = null,
	height = null,
	format = null,
	quality = null,
	gravity = null,
	dpr = null
} = {}) => {
	if (transform) return transform

	const parts = []

	if (resizeType && (width || height)) {
		parts.push(`${resizeType}:${width || 0}:${height || 0}`)
	}

	if (gravity) parts.push(`g:${gravity}`)
	if (format) parts.push(`f:${format}`)
	if (quality) parts.push(`q:${quality}`)
	if (dpr) parts.push(`dpr:${dpr}`)

	return parts.join('/')
}

const getCdnSource = (options) => {
	const buildUrl = (dpr) => {
		const transform = buildTransform({ ...options, dpr })
		return `${cdnBase.value}/${cdnPath.value}${transform ? `?tr=${transform}` : ''}`
	}
	const src = buildUrl(options.dpr)
	const retinaDpr = options.retinaDpr || props.retinaDpr

	return {
		src,
		srcset: props.retina ? densitySrcset(src, buildUrl(retinaDpr), retinaDpr / (options.dpr || 1)) : ''
	}
}

const source = computed(() =>
	cdnPath.value
		? getCdnSource({
				transform: props.transform,
				resizeType: props.resizeType,
				width: props.transformWidth || props.width,
				height: props.transformHeight || props.height,
				format: props.format,
				quality: props.quality,
				gravity: props.gravity,
				dpr: props.dpr
			})
		: nativeSource.value
)
const resolvedSrc = computed(() => source.value.src)

const responsiveSources = computed(() => {
	return getMediaEntries(props.media).flatMap(([breakpoint, config]) => {
		const media = `(max-width: ${Number(breakpoint)}px)`
		const image = config.image || baseImage.value

		if (config.image || config.size) {
			const variant = getNativeMediaSource(image, config, props.retina)
			return variant ? [{ ...variant, media }] : []
		}

		if (!cdnPath.value) return []

		const format = config.format || props.format
		const variant = getCdnSource({
			transform: config.transform,
			resizeType: config.resizeType || props.resizeType,
			width: config.width,
			height: config.height,
			format,
			quality: config.quality || props.quality,
			gravity: config.gravity || props.gravity,
			dpr: config.dpr || props.dpr,
			retinaDpr: config.retinaDpr
		})
		const type = config.format ? `image/${format === 'jpg' ? 'jpeg' : format}` : undefined
		return [{ media, srcset: variant.srcset || variant.src, type }]
	})
})

const svgPlaceholder = computed(() => {
	const width = resolvedWidth.value || 1
	const height = resolvedHeight.value || 1

	return [
		`data:image/svg+xml,%3Csvg height='${height}' viewBox='0 0 ${width} ${height}'`,
		` width='${width}' xmlns='http://www.w3.org/2000/svg'%3E`,
		`%3Cpath fill='none' d='M0 0h${width}v${height}H0z'/%3E%3C/svg%3E`
	].join('')
})
</script>
