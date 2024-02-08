<template>
	<swiper v-bind="swiperOptions">
		<slot />
		<slot name="navigation" />
		<div v-if="pagination" class="ce-quote-pagination" />
	</swiper>
</template>

<script lang="ts">
/* eslint-disable */
// @ts-nocheck
import { defineComponent } from 'vue'
import { Swiper } from 'swiper/vue'
import SwiperCore, { Navigation, Pagination } from 'swiper'

SwiperCore.use([Navigation, Pagination])
export default defineComponent({
	props: {
		pagination: {
			type: Boolean,
			default: false
		},
		swiperOptions: {
			type: Object,
			default: {
				speed: 1000,
				loop: true,
				spaceBetween: 2,
				threshold: 10,
				centerInsufficientSlides: true,
				watchOverflow: true,
				followFinger: true,
				updateOnWindowResize: true,
				navigation: {
					prevEl: '.ce-quote-btn--prev',
					nextEl: '.ce-quote-btn--next'
				},
				pagination: {
					el: '.ce-quote-pagination',
					clickable: true
				}
			}
		}
	},
	components: {
		swiper: Swiper
	}
})
</script>
