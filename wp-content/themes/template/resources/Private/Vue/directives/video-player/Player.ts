/* eslint-disable */
// @ts-nocheck
interface IPlayerEvents {
	loadScript: CustomEvent
	play: CustomEvent
	ready: CustomEvent
	scriptLoaded: CustomEvent
	stateChange: CustomEvent
	stop: CustomEvent
}

export const PlayerEvents: IPlayerEvents = {
	loadScript: new CustomEvent('videoPlayer.loadScript'),
	play: new CustomEvent('videoPlayer.play'),
	ready: new CustomEvent('videoPlayer.ready'),
	scriptLoaded: new CustomEvent('videoPlayer.scriptLoaded'),
	stateChange: new CustomEvent('videoPlayer.stateChange'),
	stop: new CustomEvent('videoPlayer.stop'),
}

/**
 @abstract
 */
class Player {
	element: HTMLElement
	events: IPlayerEvents

	constructor(element: HTMLElement) {
		if (new.target === Player) {
			throw new TypeError('Cannot construct Abstract instances directly')
		}

		this.element = element
		this.events = PlayerEvents
	}

	onPlayerReady() {
		this.element.dispatchEvent(this.events.ready)
	}

	onPlayerStateChange() {
		this.element.dispatchEvent(this.events.stateChange)
	}

	importScript(url: string, id: string, onload: ((this: GlobalEventHandlers, ev: Event) => any) | null = null) {
		const firstScriptTag = document.getElementsByTagName('body')[0].getElementsByTagName('script')[0]
		const script = document.createElement('script')

		script.async = false
		script.id = id
		script.onload = onload
		script.src = url
		firstScriptTag.parentNode?.insertBefore(script, firstScriptTag)
	}

	/* Abstract methods */
	play() {
		throw new Error('Abstract method!')
	}

	stop() {
		throw new Error('Abstract method!')
	}

	mute() {
		throw new Error('Abstract method!')
	}

	unmute() {
		throw new Error('Abstract method!')
	}
}

export default Player
