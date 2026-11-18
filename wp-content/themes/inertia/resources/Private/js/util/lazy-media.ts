import type { ILazyLoadInstance } from 'vanilla-lazyload'

const backgroundAttributes = ['data-bg', 'data-bg-hidpi', 'data-bg-multi', 'data-bg-multi-hidpi', 'data-bg-set']
const mediaAttributes = ['data-src', 'data-poster', ...backgroundAttributes]
const mediaSelector = [
	'video[data-src]',
	'video[data-poster]',
	'video:has(source[data-src])',
	...backgroundAttributes.map((attribute) => `[${attribute}]`),
].join(', ')
const mutationSelector = `${mediaSelector}, source[data-src]`

export function startLazyMedia(root: HTMLElement) {
	let loader: ILazyLoadInstance | undefined
	let loading: Promise<void> | undefined
	let stopped = false

	const refresh = () => {
		const elements = root.querySelectorAll<HTMLElement>(mediaSelector)
		if (loader) {
			loader.update(elements)
			return
		}
		if (loading || !elements.length) return

		loading = import('vanilla-lazyload')
			.then(({ default: LazyLoad }) => {
				if (stopped) return

				const current = root.querySelectorAll<HTMLElement>(mediaSelector)
				if (!current.length) return

				loader = new LazyLoad(
					{
						elements_selector: mediaSelector,
						threshold: 0,
						class_loading: 'lazy-loading',
						class_loaded: 'lazy-loaded',
						class_applied: 'lazy-bg-loaded',
						class_error: 'lazy-error',
					},
					current
				)
			})
			.catch((error) => console.error('[Lazy media] Failed to initialize.', error))
			.finally(() => {
				loading = undefined
			})
	}

	const containsMedia = (node: Node) => node instanceof Element && (node.matches(mutationSelector) || Boolean(node.querySelector(mutationSelector)))
	const observer = new MutationObserver((mutations) => {
		const changed = mutations.some(
			(mutation) =>
				(mutation.type === 'attributes' && containsMedia(mutation.target)) ||
				Array.from(mutation.addedNodes).some(containsMedia) ||
				Array.from(mutation.removedNodes).some(containsMedia)
		)
		if (changed) refresh()
	})
	observer.observe(root, { childList: true, subtree: true, attributeFilter: mediaAttributes })
	refresh()

	return () => {
		stopped = true
		observer.disconnect()
		loader?.destroy()
		loader = undefined
	}
}
