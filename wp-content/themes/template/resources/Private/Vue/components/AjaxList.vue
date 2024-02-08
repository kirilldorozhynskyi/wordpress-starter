<template>
	<div>
		<!-- Slot for filter form -->
		<slot name="filter" :filter="list.filter" />

		<!-- Loader-->
		<transition name="fade">
			<div class="d-flex justify-content-center">
				<!-- eslint-disable-next-line max-len -->
				<div v-show="list.isLoading.value" class="spinner-border spinner-border-sm text-primary" role="status">
					<span class="visually-hidden">Loading</span>
				</div>
			</div>
		</transition>
		<!-- Search status / no items found message -->
		<transition name="fade">
			<div v-if="!list.isLoading.value && !list.visibleItems.value.length">
				<span class="d-block font-weight-bold">Keine Einträge gefunden…</span>
			</div>
		</transition>
		<!-- Items listing -->
		<transition-group tag="div" class="row mb-2" name="arrange">
			<div v-for="item in list.visibleItems.value" :key="item.uid" class="col-sm-6 col-lg-4 arrange-item" v-html="item.content" />
		</transition-group>
		<!-- Indexing -->
		<div class="text-center">
			<!-- eslint-disable-next-line max-len -->
			<button
				v-if="!list.pagination.isLastPage.value && list.pagination.type.value === 'load-more-btn'"
				:class="['btn btn-primary btn-loading', { loading: list.isLoading.value }]"
				@click="list.pagination.nextPage()"
			>
				<transition name="fade">
					<span v-show="list.isLoading.value" class="spinner-loader" role="status" />
				</transition>
				Load more
			</button>
			<!-- Pagination -->
			<el-pagination
				v-if="list.pagination.type.value === 'pagination'"
				:current-page="list.pagination.currentPage.value"
				@update:current-page="handlePaginationClick"
				hide-on-single-page
				layout="prev, pager, next"
				:pager-count="5"
				:page-size="list.pagination.itemsPerPage.value"
				:total="list.pagination.totalItems.value"
			/>
		</div>
	</div>
</template>

<script lang="ts">
/* eslint-disable */
// @ts-nocheck
import { defineComponent } from 'vue'
import { ElPagination } from 'element-plus'
import type { AjaxListProps } from '../composables/ajaxList'
import { AjaxList, makeAjaxListProps } from '../composables/ajaxList'

export default defineComponent({
	name: 'ajax-list',
	props: {
		...makeAjaxListProps()
	},
	components: {
		ElPagination
	},
	setup(props) {
		const list = new AjaxList(props as AjaxListProps)

		const handlePaginationClick = (page: number) => {
			list.pagination.handlePaginationClick(page)
		}

		return {
			list,
			handlePaginationClick
		}
	}
})
</script>
