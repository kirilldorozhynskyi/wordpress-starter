import Player from './Player'

class HTMLPlayer extends Player {
	private media: HTMLMediaElement | null = null

	private player: HTMLMediaElement | null = null

	constructor(element: HTMLElement) {
		super(element)
		this.element.addEventListener('videoPlayer.loadScript', () => {
			this.media = this.element.querySelector('video')
			if (this.media) {
				this.player = this.media
				this.onPlayerReady()
			}
		})
	}

	play() {
		this.player?.play()
	}

	stop() {
		this.player?.pause()
	}

	mute() {
		if (this.player) this.player.muted = true
	}

	unmute() {
		if (this.player) this.player.muted = false
	}
}

export default HTMLPlayer
