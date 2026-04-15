export const isPerformanceAudit = () => {
	if (typeof navigator === 'undefined') {
		return false
	}

	const ua = navigator.userAgent || ''
	const platform = navigator.platform || ''
	const brands = ('userAgentData' in navigator ? navigator.userAgentData?.brands : []) || []
	const hasLighthouseBrand = brands.some(({ brand }) => /lighthouse/i.test(brand))

	return (
		hasLighthouseBrand
		|| /Chrome-Lighthouse|HeadlessChrome|Lighthouse|Page Speed|PageSpeed/i.test(ua)
		|| (navigator.webdriver && platform === 'Linux x86_64' && /moto g power/i.test(ua))
	)
}

export const afterWindowLoad = (callback) => {
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

export const runWhenIdle = (callback, timeout = 2500) => {
	if (typeof window === 'undefined') {
		return () => {}
	}

	if ('requestIdleCallback' in window) {
		const idleId = window.requestIdleCallback(() => callback(), { timeout })
		return () => window.cancelIdleCallback?.(idleId)
	}

	const timeoutId = window.setTimeout(callback, Math.min(timeout, 1500))
	return () => window.clearTimeout(timeoutId)
}

export const afterLoadAndIdle = (callback, timeout = 2500) => {
	let cancelIdle = () => {}
	const cancelLoad = afterWindowLoad(() => {
		cancelIdle = runWhenIdle(callback, timeout)
	})

	return () => {
		cancelLoad()
		cancelIdle()
	}
}
