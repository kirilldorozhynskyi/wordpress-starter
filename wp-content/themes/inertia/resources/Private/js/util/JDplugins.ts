type AcfItem = {
	name: string
	value: unknown
}

export const parseAcf = (data: AcfItem[]): Record<string, unknown> =>
	data.reduce<Record<string, unknown>>((acc, curr) => {
		acc[curr.name] = curr.value
		return acc
	}, {})

export const safeParse = <T = unknown>(value: string): T | string => {
	try {
		return JSON.parse(value) as T
	} catch {
		return value
	}
}

// Use the server-provided origin so SSR and hydration choose the same component.
export const checkLink = (btn: { url?: string; target?: string } | null, siteUrl?: string): boolean => {
	const url = btn?.url?.trim()
	if (!url || (btn?.target && btn.target !== '_self') || url.startsWith('#')) return false
	if (/^(?:mailto|tel|sms|javascript|data):/i.test(url)) return false
	if (!siteUrl) return !/^(?:[a-z][a-z\d+.-]*:|\/\/)/i.test(url)
	try {
		const site = new URL(siteUrl)
		const link = new URL(url, site)
		return ['https:', 'http:'].includes(link.protocol) && link.origin === site.origin && !link.hash
	} catch {
		return false
	}
}
