<template>
	<div ref="rootEl" :id="parent">
		<slot />
	</div>
</template>

<script lang="ts">
/* eslint-disable */
import { inject, onMounted, ref } from 'vue'
import Collapse from 'bootstrap/js/dist/collapse'
import VueScrollTo from 'vue-scrollto'
import type { IHistoryStateProps } from '../composables/historyState'
import { makeHistoryStateProps, getHistoryState, setHistoryState } from '../composables/historyState'

export default {
	props: {
		parent: {
			type: String,
			default: null
		},
		toggle: {
			type: Boolean,
			default: false
		},
		scroll: {
			type: Boolean,
			default: false
		},
		...makeHistoryStateProps()
	},
	setup(props: IHistoryStateProps & any) {
		const rootEl = ref<HTMLElement>()
		const lazyLoad = inject<any>('lazyLoad')
		const scrollOffset = inject('scrollOffset')

		const openedItems: string[] = [] // IDs of opened items

		onMounted(() => {
			const collapseElements = rootEl.value ? Array.from(rootEl.value.querySelectorAll('.collapse')) : []
			if (collapseElements.length) {
				// init Collapse elements
				collapseElements.map(
					(item: any) =>
						new Collapse(item, {
							parent: typeof props.parent === 'string' ? `#${props.parent}` : props.parent,
							toggle: props.toggle
						})
				)
				// bind event listeners
				collapseElements.forEach((item: any) => {
					item.addEventListener('show.bs.collapse', () => {
						lazyLoad.update()
						updateOpenedItems(item)
						setTimeout(() => {
							// need to wait to end of collapse transition
							scrollToOpenedItem(item)
						}, 350)
					})
					item.addEventListener('hidden.bs.collapse', () => {
						updateOpenedItems(item)
					})
				})
				// restore opened items from history state
				openItemsFromHistoryState()
				// update lazyLoad - in case that there are some images used in Collapse buttons
				lazyLoad.update()
			}

			// Remove aria attributes
			removeAria()
		})

		function scrollToOpenedItem(item: HTMLElement) {
			if (props.scroll) {
				const previousItem = item.previousElementSibling
				if (previousItem) {
					VueScrollTo.scrollTo(previousItem, {
						offset: scrollOffset,
						easing: [0, 0, 1, 1],
						duration: 350
					})
				}
			}
		}

		function updateOpenedItems(item: HTMLElement) {
			if (!openedItems.includes(item.id)) {
				openedItems.push(item.id)
			} else {
				openedItems.splice(openedItems.indexOf(item.id), 1)
			}
			setHistoryState(props.id, openedItems)
		}

		function openItemsFromHistoryState() {
			const state = getHistoryState(props.id)

			if (state && Array.isArray(state) && state.length) {
				for (const item of state) {
					openedItems.push(item)
					rootEl.value?.querySelector(`[data-bs-target="#${item}"]`)?.classList.remove('collapsed')
					rootEl.value?.querySelector(`#${item}`)?.classList.add('show')
				}
			}
		}

		function removeAria() {
			const buttons = document.querySelectorAll('.accordion-button')
			if (buttons) {
				buttons.forEach((btn: any) => {
					btn.removeAttribute('aria-expanded')
				})
			}
		}

		return {
			rootEl
		}
	}
}
</script>
