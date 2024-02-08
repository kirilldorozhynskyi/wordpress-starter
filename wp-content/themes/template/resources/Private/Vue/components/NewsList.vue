<template>
	<div>
		<!-- Slot for filter form -->
		<slot name="filter" v-bind="{ filter: list.filter }" />

		<!-- Loader-->
		<transition name="fade">
			<div class="d-flex justify-content-center">
				<div v-show="list.isLoading.value" class="spinner-border spinner-border-sm text-primary" role="status">
					<span class="visually-hidden">Loading</span>
				</div>
			</div>
		</transition>
		<!-- No items found message-->
		<transition name="fade">
			<div v-if="!list.isLoading.value && !list.visibleItems.value.length">
				<span class="d-block font-weight-bold">Keine Einträge gefunden…</span>
			</div>
		</transition>
		<!-- Items listing -->
		<transition-group tag="div" class="row mb-2" name="arrange">
			<div v-for="item in list.visibleItems.value" :key="item.uid" class="col-md-6 arrange-item" v-html="item.content" />
		</transition-group>
		<!-- Pagination -->
		<div class="text-center">
			<template v-if="list.pagination.type.value === 'load-more-btn'">
				<button
					v-if="!list.pagination.isLastPage.value"
					:class="['btn btn-primary btn-loading', { loading: list.isLoading.value }]"
					@click="list.pagination.nextPage()"
				>
					<transition name="fade">
						<span v-show="list.isLoading.value" class="spinner-border spinner-border-sm" role="status" />
					</transition>
					Mehr laden
				</button>
			</template>
			<template v-if="list.pagination.type.value === 'pagination'">
				<el-pagination
					v-if="list.filteredItems.value.length > list.pagination.itemsPerPage.value"
					v-model:currentPage="list.pagination.currentPage.value"
					:page-size="list.pagination.itemsPerPage.value"
					:total="list.filteredItems.value.length"
					layout="prev, pager, next"
					@current-change="list.handlePaginationClick"
				/>
			</template>
		</div>
	</div>
</template>

<script lang="ts">
/* eslint-disable */
// @ts-nocheck
import { defineComponent } from 'vue'
import { ElPagination } from 'element-plus'
import type { AjaxListProps, AjaxListFilterData } from '../composables/ajaxList'
import { AjaxList, AjaxListItem, makeAjaxListProps } from '../composables/ajaxList'

type NewsListProps = AjaxListProps

interface NewsListCategory {
	uid: number
}

interface NewsListFilterData extends AjaxListFilterData {
	category: number | ''
}

class NewsListItem extends AjaxListItem {
	categories: Array<NewsListCategory> = []
}

class NewsList extends AjaxList<NewsListItem, NewsListFilterData> {
	filterItems() {
		this.filteredItems.value = this.items.value.filter((news) => {
			if (this.filter.data.category) {
				return news.categories.some((category) => category == this.filter.data.category)
			}
			return true
		})
	}
}

export default defineComponent({
	name: 'news-list',
	components: {
		ElPagination
	},
	props: {
		...makeAjaxListProps()
	},
	setup(props) {
		const list = new NewsList(props as NewsListProps, {
			category: ''
		})

		return {
			list
		}
	}
})
</script>
