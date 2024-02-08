<template>
	<!-- Root element of PhotoSwipe. Must have class pswp. -->
	<div class="pswp" tabindex="-1" role="dialog" aria-hidden="true" ref="photoSwipeElRef">
		<!-- eslint-disable-next-line max-len -->
		<!-- Background of PhotoSwipe. It's a separate element as animating opacity is faster than rgba(). -->
		<div class="pswp__bg" />
		<!-- Slides wrapper with overflow:hidden. -->
		<div class="pswp__scroll-wrap">
			<!-- Container that holds slides. PhotoSwipe keeps only 3 of them in the DOM to save memory.
      Don't modify these 3 pswp__item elements, data is added later on. -->
			<div class="pswp__container">
				<div class="pswp__item" />
				<div class="pswp__item" />
				<div class="pswp__item" />
			</div>
			<!-- Default (PhotoSwipeUI_Default) interface on top of sliding area. Can be changed. -->
			<div class="pswp__ui pswp__ui--hidden">
				<div class="pswp__top-bar">
					<!--  Controls are self-explanatory. Order can be changed. -->
					<div class="pswp__counter" />
					<button class="pswp__button pswp__button--close" title="Close (Esc)" />
					<button class="pswp__button pswp__button--share" title="Share" />
					<button class="pswp__button pswp__button--fs" title="Toggle fullscreen" />
					<button class="pswp__button pswp__button--zoom" title="Zoom in/out" />
					<!-- Preloader demo http://codepen.io/dimsemenov/pen/yyBWoR -->
					<!-- element will get class pswp__preloader--active when preloader is running -->
					<div class="pswp__preloader">
						<div class="pswp__preloader__icn">
							<div class="pswp__preloader__cut">
								<div class="pswp__preloader__donut" />
							</div>
						</div>
					</div>
				</div>
				<div class="pswp__share-modal pswp__share-modal--hidden pswp__single-tap">
					<div class="pswp__share-tooltip" />
				</div>
				<button class="pswp__button pswp__button--arrow--left" title="Previous (arrow left)" />
				<button class="pswp__button pswp__button--arrow--right" title="Next (arrow right)" />
				<div class="pswp__caption">
					<div class="pswp__caption__center" />
				</div>
			</div>
		</div>
	</div>
</template>

<script>
/* eslint-disable */
// @ts-nocheck
import { defineComponent, ref } from 'vue'
import PhotoSwipe from 'photoswipe/dist/photoswipe'
import PhotoSwipeDefaultUI from 'photoswipe/dist/photoswipe-ui-default'

export default defineComponent({
	data() {
		return {
			photoswipe: null
		}
	},
	setup() {
		const photoSwipeElRef = ref(null)

		return {
			photoSwipeElRef
		}
	},
	methods: {
		close() {
			this.photoswipe.close()
		},

		onBeforeChange() {
			const videoElements = this.photoswipe.items.filter((item) => item.container && item.container.querySelector('video'))
			videoElements.forEach((element) => {
				const video = element.container.querySelector('.pswp__video')
				const videoSource = video.querySelector('source')
				const srcAttr = videoSource.getAttribute('data-src') ? videoSource.getAttribute('data-src') : videoSource.getAttribute('src')
				videoSource.setAttribute('data-src', srcAttr)
				videoSource.setAttribute('src', '')
				video.classList.remove('active')
				video.pause()
			})

			const iframeElements = this.photoswipe.items.filter((item) => item.container && item.container.querySelector('iframe'))
			iframeElements.forEach((element) => {
				const iframe = element.container.querySelector('.pswp__video')
				const srcAttr = iframe.getAttribute('data-src') ? iframe.getAttribute('data-src') : iframe.getAttribute('src')
				iframe.setAttribute('data-src', srcAttr)
				iframe.setAttribute('src', '')
				iframe.classList.remove('active')
			})

			const currentItem = this.photoswipe.currItem.container
			if (currentItem.querySelector('video')) {
				const video = currentItem.querySelector('.pswp__video')
				const videoSource = video.querySelector('source')
				const srcAttr = videoSource.getAttribute('data-src') ? videoSource.getAttribute('data-src') : videoSource.getAttribute('src')
				videoSource.setAttribute('data-src', '')
				videoSource.setAttribute('src', srcAttr)
				video.classList.add('active')
				video.play()
			}
			if (currentItem.querySelector('iframe')) {
				const iframe = currentItem.querySelector('.pswp__video')
				iframe.setAttribute('src', `${iframe.getAttribute('data-src')}&autoplay=1`)
				iframe.classList.add('active')
			}
		},

		onClose() {
			const videoElements = this.photoswipe.items.filter((item) => item.container && item.container.querySelector('video'))
			videoElements.forEach((element) => {
				const video = element.container.querySelector('.pswp__video')
				const videoSource = video.querySelector('source')
				const srcAttr = videoSource.getAttribute('data-src') ? videoSource.getAttribute('data-src') : videoSource.getAttribute('src')
				videoSource.setAttribute('data-src', srcAttr)
				videoSource.setAttribute('src', '')
				video.classList.remove('active')
				video.pause()
			})

			const iframeElements = this.photoswipe.items.filter((item) => item.container && item.container.querySelector('iframe'))
			iframeElements.forEach((element) => {
				const iframe = element.container.querySelector('.pswp__video')
				const srcAttr = iframe.getAttribute('data-src') ? iframe.getAttribute('data-src') : iframe.getAttribute('src')
				iframe.setAttribute('data-src', srcAttr)
				iframe.setAttribute('src', '')
				iframe.classList.remove('active')
			})
		},

		open(event, index) {
			const items = []
			const itemsLinks = document.querySelectorAll(`[data-photoswipe="${event.currentTarget.dataset.photoswipe}"]`)
			itemsLinks.forEach((link) => {
				const item = {}
				if (link.getAttribute('data-description')) item.title = link.getAttribute('data-description')
				if (link.getAttribute('data-size')) {
					item.w = link.getAttribute('data-size').split('x')[0]
					item.h = link.getAttribute('data-size').split('x')[1]
				}
				if (link.getAttribute('data-video')) {
					// Video (MP4 or iframe)
					const wrapperTag = document.createElement('div')
					wrapperTag.classList.add('pswp__item__wrapper')
					const innerWrapperTag = document.createElement('div')
					innerWrapperTag.classList.add('pswp__item__wrapper__video')
					innerWrapperTag.innerHTML = link.getAttribute('data-video')
					innerWrapperTag.firstElementChild.classList.add('pswp__video')
					if (innerWrapperTag.firstElementChild.tagName === 'VIDEO') {
						innerWrapperTag.firstElementChild.setAttribute('src', link.getAttribute('href'))
						innerWrapperTag.firstElementChild.play()
					}
					wrapperTag.appendChild(innerWrapperTag)
					item.html = wrapperTag
				} else if (link.getAttribute('href')) {
					// Image
					item.src = link.getAttribute('href')
				}
				items.push(item)
			})

			this.photoswipe = new PhotoSwipe(this.photoSwipeElRef, PhotoSwipeDefaultUI, items, {
				bgOpacity: 0.9,
				clickToCloseNonZoomable: true,
				closeOnScroll: false,
				fullscreenEl: false,
				zoomEl: false,
				history: false,
				index,
				preloaderEl: true,
				shareEl: false,
				tapToClose: true,
				showHideOpacity: true,
				timeToIdle: 10000
			})
			this.photoswipe.init()
			this.photoswipe.listen('beforeChange', this.onBeforeChange)
			this.photoswipe.listen('close', this.onClose)
		}
	}
})
</script>
