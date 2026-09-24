<template>
	<picture v-if="hasImage" class="picture">
		<template v-if="hasResponsiveSources">
			<template v-for="(size, breakpoint) in parsedMedia" :key="breakpoint">
				<source :media="`(max-width: ${breakpoint}px)`" :srcset="getSrcset(size.size, size.size_retina)" />
			</template>
		</template>

		<img
			:src="placeholderSrc"
			:class="imgClass"
			:loading="loadingAttr"
			:fetchpriority="fetchPriority"
			:decoding="decoding"
			:data-src="shouldLazyLoad ? resolvedSrc : null"
			:data-srcset="shouldLazyLoad ? jpegSrcset : null"
			:srcset="shouldLazyLoad ? null : jpegSrcset || null"
			:width="resolvedWidth"
			:height="resolvedHeight"
			:alt="resolvedAlt"
			:lazy="shouldLazyLoad ? '' : null"
		/>
	</picture>
</template>
<script setup>
import { computed, inject, nextTick, onMounted, watch } from 'vue'

const lazyLoad = inject('lazyLoad')

const props = defineProps({
	image: {
		type: [Object, Boolean],
		required: true,
		default: false
	},
	alt: {
		type: String,
		default: ''
	},
	width: {
		type: Number,
		default: null
	},
	height: {
		type: Number,
		default: null
	},
	size: {
		type: String,
		default: null
	},
	size_retina: {
		type: String,
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
	}
})

const hasImage = computed(() => Boolean(props.image && !Array.isArray(props.image) && typeof props.image === 'object'))
const shouldLazyLoad = computed(() => props.lazy !== false)
const loadingAttr = computed(() => props.loading || (shouldLazyLoad.value ? 'lazy' : 'eager'))
const resolvedAlt = computed(() => props.alt || props.image?.alt || props.image?.metadata?.alt || '')
const resolvedWidth = computed(() => Number(props.width ?? props.image?.width) || undefined)
const resolvedHeight = computed(() => Number(props.height ?? props.image?.height) || undefined)
const resolvedSrc = computed(() => {
	const img = hasImage.value ? props.image : null
	if (!img) return ''

	const sizes = img.sizes || {}
	return (props.size && sizes[props.size]) || img.url || ''
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

const placeholderSrc = computed(() => {
	if (!shouldLazyLoad.value) {
		return resolvedSrc.value || svgPlaceholder.value
	}

	return svgPlaceholder.value
})

const jpegSrcset = computed(() => {
	const img = hasImage.value ? props.image : null
	if (!img) return ''
	const sizes = img.sizes || {}

	const sizeKey = props.size
	const retinaKey = props.size_retina || (sizeKey ? `${sizeKey}2x` : undefined)

	const oneX = sizeKey && sizes[sizeKey] ? sizes[sizeKey] : img.url || ''
	const twoX = retinaKey && sizes[retinaKey] ? sizes[retinaKey] : oneX

	return oneX ? `${oneX} 1x, ${twoX} 2x` : ''
})

const parsedMedia = computed(() => {
	if (!props.media || typeof props.media !== 'object') {
		return null
	}

	const img = hasImage.value ? props.image : null
	const sizes = img?.sizes || {}

	return Object.keys(props.media).reduce((acc, breakpoint) => {
		const size = props.media[breakpoint]

		if (size?.size && sizes[size.size]) {
			const retinaCandidateKey = size.size_retina || `${size.size}2x`
			acc[breakpoint] = {
				size: sizes[size.size],
				size_retina: retinaCandidateKey && sizes[retinaCandidateKey] ? sizes[retinaCandidateKey] : sizes[size.size]
			}
		}
		return acc
	}, {})
})

const hasResponsiveSources = computed(() => Boolean(parsedMedia.value && Object.keys(parsedMedia.value).length))

const getSrcset = (size, retinaSize) => {
	if (!size) return ''
	return `${size} 1x, ${retinaSize ?? size} 2x`
}

const updateLazyLoad = () => {
	if (shouldLazyLoad.value) {
		lazyLoad?.update()
	}
}

onMounted(() => {
	updateLazyLoad()
})

watch([resolvedSrc, jpegSrcset, hasResponsiveSources, () => props.lazy], async () => {
	await nextTick()
	updateLazyLoad()
})
</script>
