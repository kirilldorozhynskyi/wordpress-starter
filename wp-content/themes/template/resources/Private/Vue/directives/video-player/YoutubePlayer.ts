/* eslint-disable */
// @ts-nocheck
import Player from './Player'

class YoutubePlayer extends Player {
	media: HTMLIFrameElement | null = null
	private player: Window.YT.Player | null = null

	constructor(element: HTMLElement) {
		super(element)
		this.element.addEventListener('videoPlayer.loadScript', () => {
			this.events.scriptLoaded = new CustomEvent('videoPlayer.youtubeScriptLoaded')
			this.media = this.element.querySelector('iframe')
			if (this.media) {
				document.addEventListener('videoPlayer.youtubeScriptLoaded', () => {
					this.onload()
				})

				this.importScript('https://www.youtube.com/iframe_api', 'script-youtube-player')
			}
		})
	}

	onload() {
		this.player = new window.YT.Player(this.media, {
			events: {
				onReady: () => {
					this.onPlayerReady()
				},
				onStateChange: () => {
					this.onPlayerStateChange()
				},
			},
		})
	}

	importScript(url: string, id: string, onload: ((this: GlobalEventHandlers, ev: Event) => any) | null = null) {
		if (!document.scripts.namedItem(id)) {
			window.onYouTubeIframeAPIReady = () => {
				document.scripts.namedItem(id)?.setAttribute('data-loaded', '1')
				document.dispatchEvent(this.events.scriptLoaded)
			}
			super.importScript(url, id)
		} else if (document.scripts.namedItem(id) && document.scripts.namedItem(id)?.dataset.loaded) {
			this.onload()
		}
	}

	play() {
		this.player.playVideo()
	}

	stop() {
		this.player.pauseVideo()
	}

	mute() {
		this.player.mute()
	}

	unmute() {
		this.player.unMute()
	}
}

export default YoutubePlayer
