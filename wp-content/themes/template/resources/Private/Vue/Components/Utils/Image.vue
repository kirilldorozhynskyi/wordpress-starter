<template>
	<picture class="picture" v-if="image && !Array.isArray(image)">
		<!-- Dynamic sources based on media -->
		<template v-if="parsedMedia">
			<template v-for="(size, breakpoint) in parsedMedia" :key="breakpoint">
				<source :media="`(max-width: ${breakpoint}px)`" :srcset="getSrcset(size.width, size.height, true)" type="image/webp" />
				<source :media="`(max-width: ${breakpoint}px)`" :srcset="getSrcset(size.width, size.height, false)" type="image/jpeg" />
			</template>
		</template>

		<!-- Default sources -->
		<source :srcset="webpSrcset" type="image/webp" />
		<source :srcset="jpegSrcset" type="image/jpeg" />

		<img :class="imgClass" lazy :data-srcset="jpegSrcset" :width="width" :height="height" :alt="alt" />
	</picture>
</template>

<script setup>
import { computed, inject, onMounted } from 'vue'

const lazyLoad = inject('lazyLoad')
const API_PATH = '/wp-json/jdev/get-image/'

const props = defineProps({
	image: {
		type: [Object, Boolean],
		required: true,
		default: false
	},
	alt: {
		type: String
	},
	width: {
		type: Number
	},
	height: {
		type: Number
	},
	imgClass: {
		type: String
	},
	media: {
		type: Object,
		default: () => ({})
	}
})

const imageBaseURL = computed(() => {
	return `${API_PATH}${props.image.filename}/?id=${props.image.id}`
})

const imageParams = computed(() => {
	const params = []
	if (props.width) params.push(`w=${props.width}`)
	if (props.height) params.push(`h=${props.height}`)
	return params.join('&')
})

const imageParamsRetina = computed(() => {
	const params = []
	let width = props.width ? props.width * 2 : null
	let height = props.height ? props.height * 2 : null

	if (width && width > 2560) {
		height = props.height ? Math.round((2560 / props.width) * props.height) : null
		width = 2560
	}

	if (width) params.push(`w=${width}`)
	if (height) params.push(`h=${height}`)

	return params.join('&')
})

const webpSrcset = computed(() => `${imageBaseURL.value}&${imageParams.value}&webp=true 1x, ${imageBaseURL.value}&${imageParamsRetina.value}&webp=true 2x`)
const jpegSrcset = computed(() => `${imageBaseURL.value}&${imageParams.value} 1x, ${imageBaseURL.value}&${imageParamsRetina.value} 2x`)

// 🆕 Разбор объекта media в формате {650: {width: 100, height: 200}}
const parsedMedia = computed(() => {
	if (!props.media || typeof props.media !== 'object') {
		return null
	}
	return Object.keys(props.media).reduce((acc, breakpoint) => {
		const size = props.media[breakpoint]
		if (size?.width && size?.height) {
			acc[breakpoint] = size
		}
		return acc
	}, {})
})

// 🆕 Генерация srcset для динамического media
const getSrcset = (width, height, isWebp) => {
	const params = [`w=${width}`, `h=${height}`]
	if (isWebp) params.push('webp=true')
	return `${imageBaseURL.value}&${params.join('&')} 1x, ${imageBaseURL.value}&w=${width * 2}&h=${height * 2}&${isWebp ? 'webp=true' : ''} 2x`
}

onMounted(() => {
	lazyLoad?.update()
})
</script>
