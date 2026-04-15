export const parseAcf = (data: { name: string; value: any }[]): Record<string, any> => {
	return data.reduce(
		(acc, curr) => {
			acc[curr.name] = curr.value
			return acc
		},
		{} as Record<string, any>
	)
}

export const safeParse = <T = unknown>(value: string): T | string => {
	try {
		return JSON.parse(value) as T
	} catch {
		return value
	}
}

export const checkLink = (btn: { url: string }) => {
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
