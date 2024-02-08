/* eslint-disable */
// @ts-nocheck
import { get, has, setWith } from 'lodash'
import { propsFactory } from '../util'

export const decodeQueryString = (queryString: string) => {
	const queryStringPieces = queryString.split('&')
	const decodedQueryObject = {}
	for (const piece of queryStringPieces) {
		let [key, val] = piece.split('=').map(decodeURIComponent)
		if (val && val.length) {
			if (val.startsWith('[') && val.endsWith(']')) val = JSON.parse(val)
			if (has(decodedQueryObject, key)) {
				const currentValueForKey = get(decodedQueryObject, key)
				if (!Array.isArray(currentValueForKey)) {
					setWith(decodedQueryObject, key, [currentValueForKey, val], Object)
				} else {
					currentValueForKey.push(val)
				}
			} else {
				setWith(decodedQueryObject, key, val, Object)
			}
		}
	}
	return decodedQueryObject
}

export const encodeQueryString = (queryObj: any, nesting = ''): string => {
	let encodedQueryString: string = Object.entries(queryObj)
		.filter(([key, value]) => key && value)
		.map(([key, val]) => {
			if (Array.isArray(val)) {
				const values: any = []
				Object.entries(val).forEach(([subKey, subVal]) => {
					if (typeof subVal === 'object') {
						return encodeQueryString(subVal, `${nesting}${key}.`)
					}
					values.push(subVal)
				})
				if (values.length) {
					return [nesting + key, `[${values.join(',')}]`].map(encodeURIComponent).join('=')
				}
			} else if (typeof val === 'object') {
				return encodeQueryString(val, `${nesting}${key}.`)
			} else {
				return [nesting + key, val as string].map(encodeURIComponent).join('=')
			}
		})
		.join('&')
	while (encodedQueryString.indexOf('&&') !== -1) encodedQueryString = encodedQueryString.replace(/&&/g, '&')
	if (encodedQueryString.charAt(0) === '&') encodedQueryString = encodedQueryString.slice(1)
	return encodedQueryString
}

export const makeHistoryStateProps = propsFactory({
	id: {
		type: String,
		default: null,
	},
	urlEncoding: {
		type: Boolean,
		default: false,
	},
})

export interface IHistoryStateProps {
	id?: string
	urlEncoding?: boolean
}

export function setHistoryState(id: string, state: object, urlEncoding = false): void {
	if (!id || !window.history) return

	const windowState = window.history.state || {}
	const location = urlEncoding ? `${window.location.origin + window.location.pathname}?${encodeQueryString(state)}` : window.location.href

	windowState[id] = JSON.parse(JSON.stringify(state))

	history.replaceState(windowState, document.title, location)
}

export function getHistoryState(id: string): any {
	if (history.state) {
		return history.state[id]
	}

	return null
}

export function getHistoryStateFromUrl() {
	if (!window.location.search.length) return

	const searchQuery = window.location.search.charAt(0) === '?' ? window.location.search.slice(1) : window.location.search

	return decodeQueryString(searchQuery)
}
