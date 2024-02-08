// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import { createApp } from 'vue'
import PhotoSwipeComponent, { PhotoSwipePublicInstance } from './PhotoSwipe.vue'

export default class PhotoSwipe {
	private $vm: PhotoSwipePublicInstance

	constructor() {
		const div = document.createElement('div')
		document.body.appendChild(div)

		this.$vm = createApp(PhotoSwipeComponent).mount(div) as PhotoSwipePublicInstance
	}

	open(event: Event, index: number) {
		this.$vm.open(event, index)
	}

	close() {
		this.$vm.close()
	}
}
