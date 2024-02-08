<template>
	<!-- eslint-disable-next-line max-len -->
	<swiper @swiper="setSwiper" v-bind="swiperOptions" @init="onSwiperInit" @slideChange="onSlideChange">
		<slot />
		<slot name="navigation" />
		<div v-if="pagination" class="ce-gallery-pagination" />
	</swiper>
</template>

<script lang="ts">
/* eslint-disable */
// @ts-nocheck
// eslint-disable-next-line import/extensions
import { Swiper } from 'swiper/vue'
import SwiperCore, { Navigation, Pagination } from 'swiper'
import {
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	defineComponent,
	watch,
	onMounted,
	inject,
	nextTick,
	ref
} from 'vue'
import DsCookies from '../plugins/cookies/DsCookies'

SwiperCore.use([Navigation, Pagination])
export default defineComponent({
	components: {
		Swiper
	},
	props: {
		pagination: {
			type: Boolean,
			default: false
		},
		swiperOptions: {
			type: Object,
			// eslint-disable-next-line vue/require-valid-default-prop
			default: {
				speed: 500,
				threshold: 10,
				watchOverflow: true,
				followFinger: true,
				updateOnWindowResize: true,
				navigation: {
					prevEl: '.ce-gallery-btn--prev',
					nextEl: '.ce-gallery-btn--next'
				},
				pagination: {
					el: '.ce-gallery-pagination',
					clickable: true
				}
			}
		}
	},

	setup() {
		const mainSwiper = ref<SwiperCore | null>(null)
		const lazyLoad = inject<never>('lazyLoad')
		const cookies: DsCookies | undefined = inject('cookies')

		const setSwiper = (swiper: SwiperCore) => {
			mainSwiper.value = swiper
		}

		const onSlideChange = () => {
			const video: HTMLVideoElement = mainSwiper.value?.slides[mainSwiper.value?.previousIndex].querySelector('.ce-gallery-item')
			switch (video?.tagName) {
				case 'VIDEO':
					video?.pause()
					break
				case 'IFRAME':
					// TODO: stop youtube and vimeo (possibly also mp4 by one player event)
					break
				default:
					break
			}
		}

		const onSwiperInit = (swiper: SwiperCore) => {
			if (cookies) {
				cookies.run(swiper.el)
			}
		}

		onMounted(() => {
			lazyLoad.update()

			if (cookies) {
				watch(
					cookies.accepted,
					() => {
						if (lazyLoad) {
							lazyLoad.update()
						}
					},
					{
						immediate: true
					}
				)
			}
		})

		return {
			setSwiper,
			onSwiperInit,
			onSlideChange
		}
	}
})
</script>
