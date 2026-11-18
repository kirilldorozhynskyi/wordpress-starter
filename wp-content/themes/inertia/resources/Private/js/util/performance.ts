type CancelCallback = () => void
type DeferredCallback = () => void

export const afterWindowLoad = (callback: DeferredCallback): CancelCallback => {
	if (typeof window === 'undefined') {
		return () => {}
	}

	if (document.readyState === 'complete') {
		callback()
		return () => {}
	}

	const handleLoad = () => callback()
	window.addEventListener('load', handleLoad, { once: true })

	return () => {
		window.removeEventListener('load', handleLoad)
	}
}

export const runWhenIdle = (callback: DeferredCallback, timeout = 2500): CancelCallback => {
	if (typeof window === 'undefined') {
		return () => {}
	}

	const browserWindow = window as Window & {
		requestIdleCallback?: (handler: IdleRequestCallback, options?: IdleRequestOptions) => number
		cancelIdleCallback?: (handle: number) => void
	}

	if (browserWindow.requestIdleCallback) {
		const idleId = browserWindow.requestIdleCallback(() => callback(), { timeout })
		return () => browserWindow.cancelIdleCallback?.(idleId)
	}

	const timeoutId = browserWindow.setTimeout(callback, Math.min(timeout, 1500))
	return () => browserWindow.clearTimeout(timeoutId)
}

export const afterLoadAndIdle = (callback: DeferredCallback, timeout = 2500): CancelCallback => {
	let cancelIdle = () => {}
	const cancelLoad = afterWindowLoad(() => {
		cancelIdle = runWhenIdle(callback, timeout)
	})

	return () => {
		cancelLoad()
		cancelIdle()
	}
}
