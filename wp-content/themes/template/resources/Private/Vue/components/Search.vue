<template>
	<div>
		<!-- Form with slot for search input -->
		<form class="search-form" @submit="list.submitSearchForm">
			<slot name="search" :searchQuery="list.searchQuery.value" />
		</form>
		<!-- Loader -->
		<div class="d-flex justify-content-center">
			<transition name="fade">
				<div v-show="list.isLoading.value" class="spinner-border text-primary position-absolute" role="status">
					<span class="visually-hidden">Loading</span>
				</div>
			</transition>
		</div>
		<!-- Search status -->
		<transition name="fade">
			<div v-if="!list.isLoading.value && list.searchQuery.value" class="search-info-panel">
				<span class="d-block font-weight-bold"> Searching for „{{ list.searchQuery.value }}“… </span>
				<span class="d-block">
					{{ list.items.value.length }}
					{{ list.items.value.length > 1 ? 'results were found.' : 'result was found.' }}
				</span>
				<span v-if="list.items.value.length" class="d-block">
					Showing results {{ list.pagination.start.value + 1 }} to {{ list.pagination.end.value }} from {{ list.items.value.length }}.
				</span>
			</div>
		</transition>
		<!-- Items listing -->
		<transition-group ref="listEl" tag="div" class="my-2 search-results" name="arrange">
			<div v-for="item in list.visibleItems.value" :key="item.uid" class="arrange-item search-results-item" v-html="item.content" />
		</transition-group>
		<!-- Indexing -->
		<div class="text-center search-pagination">
			<el-pagination
				v-if="list.filteredItems.value.length > list.pagination.itemsPerPage.value"
				:total="list.filteredItems.value.length"
				v-model:page-size="list.pagination.itemsPerPage.value"
				v-model:currentPage="list.pagination.currentPage.value"
				layout="prev, pager, next"
			/>
		</div>
	</div>
</template>

<script lang="ts">
/* eslint-disable */
// @ts-nocheck
import type { Ref } from 'vue'
import { defineComponent, reactive, ref } from 'vue'
import { ElPagination } from 'element-plus'
import axios from 'axios'
import type { AjaxListFilterData, AjaxListProps } from '../composables/ajaxList'
import { AjaxList, AjaxListItem, makeAjaxListProps } from '../composables/ajaxList'
import type { IHistoryStateProps } from '../composables/historyState'

interface SearchProps extends AjaxListProps {
	initialSearchQuery: string
}

class Search extends AjaxList<AjaxListItem, AjaxListFilterData> {
	// not part of filter.data.searchQuery - parent watching this.filter.data caused problems
	searchQuery: Ref<string>

	constructor(props: SearchProps & IHistoryStateProps, filterData: AjaxListFilterData) {
		super(props, filterData)

		this.searchQuery = ref(props.initialSearchQuery ?? '')
		if (this.searchQuery.value.length) {
			this.fetchItems()
		}
	}

	fetchItems(): Promise<void> {
		if (!this.searchQuery) {
			return Promise.resolve()
		}

		this.isLoading.value = true
		this.items.value = []
		return axios({
			url: this.props.getItemsUrl,
			method: this.props.type === 'search' ? 'post' : 'get',
			data: this.props.type === 'search' && this.searchQuery ? { query: this.searchQuery.value } : null
		})
			.then((response) => {
				this.addItems(response.data)
				this.setFilterOptions()
				this.filterItems()
				// this.initPage();
			})
			.catch((error) => {
				console.error('Oops an error occurred: ', error)
			})
	}

	submitSearchForm(event: Event) {
		event.preventDefault()

		const searchInput = (event.target as HTMLElement).querySelector('input[type="search"]')
		if (searchInput) {
			this.searchQuery.value = (searchInput as HTMLInputElement).value
			this.fetchItems()
		}
	}
}

export default defineComponent({
	name: 'search',
	components: {
		'el-pagination': ElPagination
	},
	props: {
		...makeAjaxListProps()
	},
	setup(props) {
		const list = new Search(props as SearchProps, {})

		return {
			list
		}
	}
})
</script>
