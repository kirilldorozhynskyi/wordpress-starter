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

export const checkLink = (btn: { url?: string } | null) => {
	const url = btn?.url?.trim?.()

	if (!url) {
		return false
	}

	if (!/^https?:\/\//i.test(url)) {
		return true
	}

	if (typeof window === 'undefined') {
		return false
	}

	try {
		return new URL(url).host === window.location.host
	} catch {
		return false
	}
}
