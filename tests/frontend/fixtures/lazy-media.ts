import { createApp, h, ref } from 'vue'
import ImageWP from '@/components/Utils/ImageWP.vue'
import { startLazyMedia } from '@/util/lazy-media'

const showNext = ref(false)
const imagesOnly = new URLSearchParams(location.search).has('images-only')
const columnImage = {
	url: '/lazy-media-fixture/native.svg',
	width: 1200,
	height: 600,
	sizes: { small: '/lazy-media-fixture/native-300.svg', 'small-width': 300, 'small-height': 150 },
}
const app = createApp({
	render: () =>
		h('main', [
			h(ImageWP, { image: '/lazy-media-fixture/hero.svg', loading: 'eager', fetchpriority: 'high', width: 32, height: 32 }),
			...(imagesOnly
				? [h('div', { style: { height: '3000px' } }), h(ImageWP, { id: 'native-lazy', image: columnImage, sizes: '270px', width: 270, height: 135 })]
				: [
						h('button', { onClick: () => (showNext.value = true) }, 'Add video'),
						h('div', { style: { height: '2000px' } }),
						h('div', { id: 'background', 'data-bg': '/lazy-media-fixture/background.svg', style: { width: '320px', height: '180px' } }),
						h('video', {
							id: 'video',
							'data-src': '/lazy-media-fixture/video.mp4',
							'data-poster': '/lazy-media-fixture/poster.svg',
							preload: 'metadata',
						}),
						showNext.value
							? h('video', { id: 'next', preload: 'metadata' }, [h('source', { 'data-src': '/lazy-media-fixture/next.mp4', type: 'video/mp4' })])
							: null,
					]),
		]),
})
const root = document.getElementById('app')!
app.mount(root)
app.onUnmount(startLazyMedia(root))
