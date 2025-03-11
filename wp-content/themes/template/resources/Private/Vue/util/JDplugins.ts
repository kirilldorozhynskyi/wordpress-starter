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
	if (btn.url.includes('http')) {
		return btn.url.includes(window.location.host)
	} else {
		return true
	}
}
