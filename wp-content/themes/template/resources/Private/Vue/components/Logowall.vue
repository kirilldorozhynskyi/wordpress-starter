<template>
	<swiper v-bind="swiperOptions">
		<slot />
	</swiper>
</template>

<script lang="ts">
/* eslint-disable */
// @ts-nocheck
import { defineComponent } from 'vue'
import { Swiper } from 'swiper/vue'
import SwiperCore, { Autoplay, Navigation } from 'swiper'

SwiperCore.use([Autoplay, Navigation])
export default defineComponent({
	props: {
		swiperOptions: {
			type: Object,
			default: {
				speed: 1000,
				loop: true,
				slidesPerView: 1,
				spaceBetween: 0,
				threshold: 10,
				centerInsufficientSlides: true,
				watchOverflow: true,
				followFinger: true,
				updateOnWindowResize: true,
				navigation: {
					prevEl: '.ce-logowall-btn--prev',
					nextEl: '.ce-logowall-btn--next'
				},
				breakpoints: {
					'576': {
						slidesPerView: 2
					},
					'992': {
						slidesPerView: 4
					},
					'1280': {
						slidesPerView: 6
					}
				}
			}
		}
	},
	components: {
		swiper: Swiper
	}
})
</script>
