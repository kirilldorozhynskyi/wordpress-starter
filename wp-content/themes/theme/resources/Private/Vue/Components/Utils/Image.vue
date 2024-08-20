<template>
	<picture class="picture">
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
		type: String,
		required: true
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

const imageBaseURL = `${API_PATH}${props.image}`

const imageParams = computed(() => {
	const params = []
	if (props.width) params.push(`w=${props.width}`)
	if (props.height) params.push(`h=${props.height}`)
	return params.join('&')
})

const imageParamsRetina = computed(() => {
	const params = []
	if (props.width) params.push(`w=${props.width * 2}`)
	if (props.height) params.push(`h=${props.height * 2}`)
	return params.join('&')
})

const webpSrcset = computed(() => `${imageBaseURL}?${imageParams.value}&webp=true 1x, ${imageBaseURL}?${imageParamsRetina.value}&webp=true 2x`)
const jpegSrcset = computed(() => `${imageBaseURL}?${imageParams.value} 1x, ${imageBaseURL}?${imageParamsRetina.value} 2x`)

onMounted(() => {
	lazyLoad?.update()
})
</script>
