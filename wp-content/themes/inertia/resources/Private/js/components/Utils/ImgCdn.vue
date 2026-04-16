<template>
	<picture v-if="hasImage" class="picture">
		<template v-if="hasResponsiveSources">
			<source
				v-for="(source, breakpoint) in parsedMedia"
				:key="breakpoint"
				:media="`(max-width: ${breakpoint}px)`"
				:srcset="source.srcset"
				:type="source.type || null"
			/>
		</template>

		<img
			:src="placeholderSrc"
			:class="imgClass"
			:loading="loadingAttr"
			:fetchpriority="fetchPriority"
			:decoding="decoding"
			:data-src="shouldLazyLoad ? resolvedSrc : null"
			:data-srcset="shouldLazyLoad ? finalSrcset : null"
			:srcset="shouldLazyLoad ? null : finalSrcset || null"
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
		type: [Object, String, Boolean],
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
		default: 'https://cdn.monjoli.eu'
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

const hasImage = computed(() => Boolean(props.image))
const isObjectImage = computed(() => Boolean(props.image && typeof props.image === 'object' && !Array.isArray(props.image)))
const shouldLazyLoad = computed(() => props.lazy !== false)
const loadingAttr = computed(() => props.loading || (shouldLazyLoad.value ? 'lazy' : 'eager'))

const normalizeBase = (base) => String(base || '').replace(/\/+$/, '')

const getHostname = (url) => {
	try {
		return new URL(url).hostname
	} catch {
		return ''
	}
}

const cdnHost = computed(() => getHostname(normalizeBase(props.cdnBase)))

const isCdnUrl = (url) => {
	try {
		return new URL(url).hostname === cdnHost.value
	} catch {
		return false
	}
}

const getPathFromUrl = (url) => {
	try {
		return new URL(url).pathname.replace(/^\/+/, '')
	} catch {
		return ''
	}
}

const resolvedAlt = computed(() => {
	if (props.alt) return props.alt
	if (isObjectImage.value) return props.image?.alt || props.image?.metadata?.alt || ''
	return ''
})

const resolvedWidth = computed(() => Number(props.width ?? (isObjectImage.value ? props.image?.width : null)) || undefined)
const resolvedHeight = computed(() => Number(props.height ?? (isObjectImage.value ? props.image?.height : null)) || undefined)

const rawSourceUrl = computed(() => {
	if (!hasImage.value) return ''

	if (typeof props.image === 'string') {
		return props.image
	}

	if (!isObjectImage.value) {
		return ''
	}

	const sizes = props.image?.sizes || {}

	if (props.size && sizes[props.size]) {
		return sizes[props.size]
	}

	return props.image?.url || ''
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

const mainTransform = computed(() =>
	buildTransform({
		transform: props.transform,
		resizeType: props.resizeType,
		width: props.transformWidth || props.width,
		height: props.transformHeight || props.height,
		format: props.format,
		quality: props.quality,
		gravity: props.gravity,
		dpr: props.dpr
	})
)

const retinaTransform = computed(() => {
	if (!props.retina) return ''

	return buildTransform({
		transform: props.transform,
		resizeType: props.resizeType,
		width: props.transformWidth || props.width,
		height: props.transformHeight || props.height,
		format: props.format,
		quality: props.quality,
		gravity: props.gravity,
		dpr: props.retinaDpr
	})
})

const buildCdnUrl = (path, tr = '') => {
	const base = normalizeBase(props.cdnBase)
	const cleanPath = String(path || '').replace(/^\/+/, '')

	if (!base || !cleanPath) return ''

	if (!tr) {
		return `${base}/${cleanPath}`
	}

	return `${base}/${cleanPath}?tr=${tr}`
}

const resolvedSrc = computed(() => {
	const url = rawSourceUrl.value

	if (!url) return ''

	if (!isCdnUrl(url)) {
		return url
	}

	const path = getPathFromUrl(url)

	if (!path) {
		return url
	}

	if (!mainTransform.value) {
		return url
	}

	return buildCdnUrl(path, mainTransform.value)
})

const finalSrcset = computed(() => {
	const url = rawSourceUrl.value

	if (!url) return ''

	if (!isCdnUrl(url)) {
		return ''
	}

	const path = getPathFromUrl(url)

	if (!path) return ''

	const oneX = mainTransform.value ? buildCdnUrl(path, mainTransform.value) : buildCdnUrl(path)

	if (!props.retina || !retinaTransform.value) {
		return oneX ? `${oneX} 1x` : ''
	}

	const twoX = buildCdnUrl(path, retinaTransform.value)

	return `${oneX} 1x, ${twoX} 2x`
})

const parsedMedia = computed(() => {
	const url = rawSourceUrl.value

	if (!url || !isCdnUrl(url)) return null
	if (!props.media || typeof props.media !== 'object') return null

	const path = getPathFromUrl(url)

	if (!path) return null

	return Object.entries(props.media).reduce((acc, [breakpoint, config]) => {
		const tr1x = buildTransform({
			transform: config.transform || null,
			resizeType: config.resizeType || props.resizeType,
			width: config.width || null,
			height: config.height || null,
			format: config.format || props.format,
			quality: config.quality || props.quality,
			gravity: config.gravity || props.gravity,
			dpr: config.dpr || props.dpr
		})

		const src1x = buildCdnUrl(path, tr1x)

		if (props.retina) {
			const tr2x = buildTransform({
				transform: config.transform || null,
				resizeType: config.resizeType || props.resizeType,
				width: config.width || null,
				height: config.height || null,
				format: config.format || props.format,
				quality: config.quality || props.quality,
				gravity: config.gravity || props.gravity,
				dpr: config.retinaDpr || props.retinaDpr
			})

			acc[breakpoint] = {
				srcset: `${src1x} 1x, ${buildCdnUrl(path, tr2x)} 2x`,
				type: config.format ? `image/${config.format}` : null
			}
		} else {
			acc[breakpoint] = {
				srcset: `${src1x} 1x`,
				type: config.format ? `image/${config.format}` : null
			}
		}

		return acc
	}, {})
})

const hasResponsiveSources = computed(() => Boolean(parsedMedia.value && Object.keys(parsedMedia.value).length))

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

const updateLazyLoad = () => {
	if (shouldLazyLoad.value) {
		lazyLoad?.update()
	}
}

onMounted(() => {
	updateLazyLoad()
})

watch([resolvedSrc, finalSrcset, hasResponsiveSources, () => props.lazy], async () => {
	await nextTick()
	updateLazyLoad()
})
</script>
