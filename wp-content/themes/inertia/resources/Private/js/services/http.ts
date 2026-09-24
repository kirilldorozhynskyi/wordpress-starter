export class HttpError extends Error {
	status: number
	data: unknown
	constructor(status: number, data: unknown) {
		super(`Request failed with status ${status}`)
		this.status = status
		this.data = data
	}
}

export async function fetchJson<T>(url: string, options: RequestInit = {}): Promise<T> {
	const headers = new Headers(options.headers)
	headers.set('Accept', 'application/json')
	const response = await fetch(url, { ...options, headers })
	let data: unknown
	try {
		data = await response.json()
	} catch {
		throw new HttpError(response.status, null)
	}
	if (!response.ok) throw new HttpError(response.status, data)
	if (!data || typeof data !== 'object') throw new HttpError(response.status, null)
	return data as T
}
