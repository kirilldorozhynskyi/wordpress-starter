/* eslint-disable */
// @ts-nocheck
import Player from './Player'
import DefaultVimeoPlayer from '@vimeo/player'

class VimeoPlayer extends Player {
	private media: HTMLIFrameElement | null = null
	private player: DefaultVimeoPlayer | null = null

	constructor(element: HTMLElement) {
		super(element)
		this.element.addEventListener('videoPlayer.loadScript', () => {
			this.media = this.element.querySelector('iframe')
			if (this.media) {
				this.player = new DefaultVimeoPlayer(this.media)
				this.onPlayerReady()
			}
		})
	}

	play() {
		if (this.player) this.player.play()
	}

	stop() {
		if (this.player) this.player.pause()
	}

	mute() {
		if (this.player) this.player.setMuted(true)
	}

	unmute() {
		if (this.player) this.player.setMuted(false)
	}
}

export default VimeoPlayer
