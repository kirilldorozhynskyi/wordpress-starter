/* eslint-disable */
// @ts-nocheck
import type { Directive } from 'vue'
import HTMLPlayer from './HTMLPlayer'
import VimeoPlayer from './VimeoPlayer'
import YoutubePlayer from './YoutubePlayer'
import Player from '../../directives/video-player/Player'

enum ALLOWED_MEDIA_TYPES {
	'mp4' = 'mp4',
	'vimeo' = 'vimeo',
	'youtube' = 'youtube',
	'webm' = 'webm',
}

const __getPlayer = function (el: HTMLElement, key: ALLOWED_MEDIA_TYPES) {
	switch (key) {
		case 'youtube':
			return new YoutubePlayer(el)
		case 'vimeo':
			return new VimeoPlayer(el)
		default:
			return new HTMLPlayer(el)
	}
}

const DsVideoPlayerDirective: Directive = {
	beforeMount(el: HTMLElement, binding) {
		const video = el.querySelector('.media-item')
		let player: Player
		let playerKey: string

		if (!video) return
		if (!(binding.value in ALLOWED_MEDIA_TYPES)) return

		playerKey = binding.value ? binding.value.toLowerCase() : ''
		player = __getPlayer(el, playerKey as ALLOWED_MEDIA_TYPES)

		el.addEventListener('videoPlayer.ready', () => {
			const playButton = el.querySelector('button')
			el.addEventListener('videoPlayer.play', () => {
				player.play()
				el.classList.add('is-playing')
				el.classList.remove('is-paused')
			})
			el.addEventListener('videoPlayer.stop', () => {
				player.stop()
				el.classList.add('is-paused')
				el.classList.remove('is-playing')
			})
			if (playButton) {
				playButton.addEventListener('click', () => {
					if (el.classList.contains('is-playing')) {
						el.dispatchEvent(player.events.stop)
					} else {
						el.dispatchEvent(player.events.play)
					}
				})
			}
		})

		if (video.getAttribute('src') || video.querySelector('[src]')) {
			el.dispatchEvent(player.events.loadScript)
		} else {
			new MutationObserver(() => {
				el.dispatchEvent(player.events.loadScript)
			}).observe(video, {
				attributes: true,
				subtree: true,
				attributeFilter: ['src'],
			})
		}
	},
}

export default DsVideoPlayerDirective
