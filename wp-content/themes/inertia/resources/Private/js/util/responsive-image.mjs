export function getImageSize(image, size = 'full') {
	if (!image || !size) return null
	if (typeof image === 'string') return size === 'full' ? { url: image } : null

	const variant = image.sizes?.[size]
	if (size === 'full' && image.url) {
		return { url: image.url, width: Number(image.width), height: Number(image.height) }
	}
	if (typeof variant === 'string' && variant) {
		return { url: variant, width: Number(image.sizes[`${size}-width`]), height: Number(image.sizes[`${size}-height`]) }
	}
	if (variant?.url) {
		return { url: variant.url, width: Number(variant.width), height: Number(variant.height) }
	}
	return size === 'full' && image.original ? { url: image.original } : null
}

export function densitySrcset(src, retinaSrc, density = 2) {
	return src && retinaSrc && src !== retinaSrc && density > 1 ? `${src} 1x, ${retinaSrc} ${density}x` : ''
}

function widthSrcset(image, full) {
	if (!(full?.width > 0) || !(full.height > 0)) return ''

	const sources = new Map([[full.width, full.url]])
	const seen = new Set([full.url])
	const ratio = full.width / full.height
	for (const size of Object.keys(image.sizes || {})) {
		const variant = getImageSize(image, size)
		if (!variant || seen.has(variant.url) || !(variant.width > 0) || !(variant.height > 0) || variant.width >= full.width) continue
		if (Math.abs(variant.width / variant.height / ratio - 1) > 0.02 || sources.has(variant.width)) continue

		sources.set(variant.width, variant.url)
		seen.add(variant.url)
	}
	return [...sources]
		.sort(([left], [right]) => left - right)
		.map(([width, url]) => `${url} ${width}w`)
		.join(', ')
}

export function getMediaEntries(media) {
	return Object.entries(media || {})
		.filter(([breakpoint, config]) => Number(breakpoint) > 0 && Number.isFinite(Number(breakpoint)) && config && typeof config === 'object')
		.sort(([left], [right]) => Number(left) - Number(right))
}

export function getNativeMediaSource(image, config, retina) {
	if (config.size && !getImageSize(image, config.size)) return null

	const source = getNativeImageSource(image, { size: config.size, sizeRetina: config.sizeRetina || config.size_retina, retina })
	return source.src ? { ...source, srcset: source.srcset || source.src } : null
}

export function getNativeImageSource(image, { size = 'full', sizeRetina, retina = true } = {}) {
	const full = getImageSize(image)
	const variant = getImageSize(image, size)
	const source = variant?.url === full?.url ? full : variant || full
	const widths = retina && source === full && !sizeRetina ? widthSrcset(image, full) : ''
	const retinaVariant = retina ? getImageSize(image, sizeRetina || `${size}2x`) : null
	const src = source?.url || ''

	return {
		src,
		srcset: widths || densitySrcset(src, retinaVariant?.url),
		hasWidths: Boolean(widths),
		width: source?.width || undefined,
		height: source?.height || undefined,
	}
}
