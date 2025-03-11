<template>
	<picture class="picture" v-if="image && !Array.isArray(image)">
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
	}
})

const imageBaseURL = `${API_PATH}${props.image.filename}/?id=${props.image.id}`

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

const webpSrcset = computed(() => `${imageBaseURL}&${imageParams.value}&webp=true 1x, ${imageBaseURL}&${imageParamsRetina.value}&webp=true 2x`)
const jpegSrcset = computed(() => `${imageBaseURL}&${imageParams.value} 1x, ${imageBaseURL}&${imageParamsRetina.value} 2x`)

onMounted(() => {
	lazyLoad?.update()
})
</script>
