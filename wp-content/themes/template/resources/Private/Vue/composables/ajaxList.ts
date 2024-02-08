/* eslint-disable */
// @ts-nocheck
import axios from 'axios'
import debounce from 'debounce'
import { decode } from 'html-entities'
import type { ILazyLoadInstance } from 'vanilla-lazyload'
import type { ComputedRef, Ref } from 'vue'
import { computed, inject, nextTick, reactive, ref, watch } from 'vue'
import type { UnwrapNestedRefs } from '@vue/reactivity'
import { propsFactory } from '../util'
import type { IHistoryStateProps } from './historyState'
import { setHistoryState, getHistoryStateFromUrl } from './historyState'
import { default as getObjectByPath } from 'lodash-es/get'
import { default as setObjectByPath } from 'lodash-es/set'
import { default as mergeObjects } from 'lodash-es/merge'

// Composables
export const makeAjaxListProps = propsFactory({
	getItemsUrl: {
		type: String,
		required: true,
	},
	getItemsContentUrl: {
		type: String,
		default: '',
	},
	getSolrResultsUrl: {
		type: String,
		default: '',
	},
	paginationType: {
		type: String,
		default: 'load-more-btn',
		validator: (value: string) => ['load-more-btn', 'pagination'].includes(value),
	},
	initialSearchQuery: {
		type: String,
		default: '',
	},
	itemsPerPage: {
		type: Number,
		default: 1,
	},
	type: {
		type: String,
		default: 'fetch',
		validator: (value: string) => ['fetch', 'search'].includes(value),
	},
})

export interface AjaxListFilterData {
	[key: string]: any
}

class AjaxListFilter<FilterData extends AjaxListFilterData> {
	data: UnwrapNestedRefs<FilterData>
	initialData: FilterData

	constructor(data: FilterData, props: IHistoryStateProps = {}) {
		this.initialData = JSON.parse(JSON.stringify(data))
		this.data = reactive(data)
	}

	resetFilter(property?: string) {
		if (property) {
			setObjectByPath(this.data, property, JSON.parse(JSON.stringify(getObjectByPath(this.initialData, property))))
		} else {
			Object.assign(this.data, JSON.parse(JSON.stringify(this.initialData)))
		}
	}
}

type AjaxListPaginationOptions = {
	itemsPerPage?: number
	onSetIndexRange?: () => void
	type?: AjaxListPaginationType
}

type AjaxListPaginationType = 'load-more-btn' | 'pagination'

class AjaxListPagination {
	currentPage: Ref<number>
	end: Ref<number>
	itemsPerPage: Ref<number>
	onSetIndexRange: () => void
	start: Ref<number>
	totalItems: Ref<number>
	type: Ref<AjaxListPaginationType>
	maxPages: ComputedRef<number>

	constructor(options?: AjaxListPaginationOptions) {
		this.currentPage = ref(1)
		this.end = ref(0)
		this.itemsPerPage = ref(options?.itemsPerPage ?? 1)
		this.onSetIndexRange = options?.onSetIndexRange ?? (() => {})
		this.start = ref(0)
		this.totalItems = ref(0)
		this.type = ref(options?.type ?? 'load-more-btn')
		this.maxPages = computed(() => Math.max(Math.ceil(this.totalItems.value / this.itemsPerPage.value), 1))

		watch(this.currentPage, () => {
			this.setIndexRange()
		})
	}

	get isLastPage(): ComputedRef<boolean> {
		return computed(() => this.end.value >= this.totalItems.value)
	}

	isOnCurrentPage(index: number): boolean {
		return index >= this.start.value && index < this.end.value
	}

	nextPage(): number {
		return ++this.currentPage.value
	}

	reset(): void {
		this.currentPage.value === 1
	}

	setIndexRange() {
		switch (this.type.value) {
			case 'load-more-btn':
				this.end.value = Math.min(this.currentPage.value * this.itemsPerPage.value, this.totalItems.value)
				break
			case 'pagination':
				this.start.value = Math.min((this.currentPage.value - 1) * this.itemsPerPage.value, this.totalItems.value)
				this.end.value = Math.min(this.start.value + this.itemsPerPage.value, this.totalItems.value)
				break
		}

		// Hook onSetIndexRange
		this.onSetIndexRange()
	}

	handlePaginationClick(page: number): void {
		this.currentPage.value = Math.min(page, this.maxPages.value)
	}
}

interface AjaxListSearchResultData {
	uid: number
}

class AjaxListSearch<Item extends AjaxListItem, SearchData extends AjaxListSearchResultData> {
	readonly QUERY_LENGTH_THRESHOLD = 3

	fetchResultsDebounced: (form: HTMLFormElement) => void
	isLoading: Ref<boolean>
	lastQuery = ''
	query: Ref<string>
	results: Ref<Array<SearchData>>

	constructor() {
		this.isLoading = ref(false)
		this.query = ref('')
		this.results = ref([])

		this.fetchResultsDebounced = debounce(this.fetchResults, 300)
	}

	fetchResults(form: HTMLFormElement): void {
		if (!form || !form.action) return

		if (this.lastQuery === this.query.value) return

		if (this.query.value.length >= this.QUERY_LENGTH_THRESHOLD) {
			this.isLoading.value = true

			let formData = new FormData(form)
			let solrQuery = this.query.value

			let searchOriginal = axios.post(form.action, formData)

			solrQuery = solrQuery
				.split(' ')
				.map((item) => '*' + item + '*')
				.join(' ')
			formData.set('tx_solr[q]', solrQuery)
			let searchWildcards = axios.post(form.action, formData)

			Promise.all([searchOriginal, searchWildcards])
				.then((responses: Array<{ data: { searchResults: Array<SearchData> } }>) => {
					const results: Array<SearchData> = []

					responses.forEach((response) => results.push(...response.data.searchResults))
					this.results.value = results
				})
				.catch((error) => {
					console.error('Oops an error occurred: ', error)
				})
				.then(() => {
					this.isLoading.value = false
				})
		} else {
			if (this.lastQuery.length >= this.QUERY_LENGTH_THRESHOLD) {
				this.results.value = []
			}
		}

		this.lastQuery = this.query.value
	}

	filterItems(items: Array<Item>): Array<Item> {
		if (this.query.value.length < this.QUERY_LENGTH_THRESHOLD) {
			return items
		}

		return items.filter((item) => this.results.value.find((resultItem) => item.uid === resultItem.uid))
	}
}

export interface AjaxListProps {
	getItemsUrl: string
	getItemsContentUrl: string
	itemsPerPage: number
	paginationType: AjaxListPaginationType
	type: string
}

export class AjaxListItem {
	content = ''
	uid = 0
}

export class AjaxList<Item extends AjaxListItem, FilterData extends object = {}, SearchData extends AjaxListSearchResultData = { uid: number }> {
	filter: AjaxListFilter<FilterData>
	filteredItems: Ref<Array<Item>>
	isLoading: Ref<boolean>
	items: Ref<Array<Item>>
	lazyLoad: ILazyLoadInstance | undefined
	pagination: AjaxListPagination
	props: AjaxListProps & IHistoryStateProps
	search: AjaxListSearch<Item, SearchData>

	constructor(props: AjaxListProps & IHistoryStateProps, filterData: FilterData) {
		this.filter = new AjaxListFilter(filterData, props)
		this.filteredItems = ref([])
		this.items = ref([])
		this.isLoading = ref(false)
		this.lazyLoad = inject('lazyLoad')
		this.pagination = new AjaxListPagination({
			itemsPerPage: props.itemsPerPage,
			onSetIndexRange: () => this.fetchItemsContent(),
			type: props.paginationType,
		})
		this.props = props
		this.search = new AjaxListSearch()

		if (props.urlEncoding) {
			mergeObjects(this.filter.data, getHistoryStateFromUrl())
		}

		watch(this.filteredItems, (newItems) => {
			this.pagination.totalItems.value = newItems.length
			this.pagination.setIndexRange()
		})

		watch(
			[this.filter.data, this.search.results],
			() => {
				this.filterItems()
				this.pagination.reset()
				if (props.id) {
					setHistoryState(props.id, this.filter.data, props.urlEncoding)
				}
			},
			{ deep: true }
		)

		watch(this.search.isLoading, () => {
			this.isLoading.value = this.search.isLoading.value
		})

		this.fetchItems()
	}

	get visibleItems(): ComputedRef<Array<Item>> {
		return computed(() => {
			return this.filteredItems.value.filter((item: Item, index: number) => {
				return item.content && this.pagination.isOnCurrentPage(index)
			})
		})
	}

	addItems(items: Array<Item>) {
		if (items.length) {
			items.reverse().forEach((item: Item) => {
				this.items.value.unshift(item)
			})
		}
	}

	fetchItems(): Promise<void> {
		this.isLoading.value = true
		this.items.value = []
		return axios({
			url: this.props.getItemsUrl,
			method: this.props.type === 'search' ? 'post' : 'get',
		})
			.then((response) => {
				this.addItems(response.data)
				this.setFilterOptions()
				this.filterItems()
			})
			.catch((error) => {
				console.error('Oops an error occurred: ', error)
			})
	}

	fetchItemsContent(): void {
		if (this.props.getItemsContentUrl) {
			let params = this.fetchItemsContentPrepareParams()

			if (params.uids.length) {
				this.isLoading.value = true
				axios
					.get(this.props.getItemsContentUrl, {
						params,
					})
					.then((response) => {
						response.data.forEach((itemWithContent: Item) => {
							const index = this.items.value.findIndex((item: Item) => itemWithContent.uid === item.uid)
							this.items.value[index].content = decode(itemWithContent.content)
						})
					})
					.catch((error) => {
						console.error('Oops an error occurred: ', error)
					})
					.then(() => {
						this.handleItemsLoaded()
					})
			} else {
				this.handleItemsLoaded()
			}
		} else {
			this.handleItemsLoaded()
		}
	}

	fetchItemsContentPrepareParams(): any {
		const uids: Array<Number> = []
		for (let i = this.pagination.start.value; i < this.pagination.end.value; i++) {
			if (!this.filteredItems.value[i].content) {
				uids.push(this.filteredItems.value[i].uid)
			}
		}

		return {
			uids: uids.join(','),
		}
	}

	/**
	 * This method is meant to be extended in specific component
	 * to set up a filter logic for items
	 */
	filterItems() {
		this.filteredItems.value = this.search.filterItems(this.items.value)
	}

	handleItemsLoaded() {
		this.isLoading.value = false
		// this.updateState();
		nextTick(() => {
			if (this.lazyLoad) {
				this.lazyLoad.update()
			}
		})
	}

	/**
	 * This method is meant to be extended in specific component
	 * to set up filter options before "filterItems" method is triggered
	 */
	setFilterOptions() {}
}
