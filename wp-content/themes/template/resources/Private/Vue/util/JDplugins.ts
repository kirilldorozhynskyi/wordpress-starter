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

export const checkLink = (link?: string): string => {
	if (!link) return '/'

	const domain = window.location.host

	if (!link.startsWith('/') && !link.startsWith(domain)) {
		link = `/${link}`
	}

	return link
}
