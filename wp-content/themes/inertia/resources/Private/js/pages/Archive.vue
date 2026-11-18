<template>
	<section class="container pt-36 pb-12">
		<h1 class="text-balance">{{ archive.title }}</h1>
		<ul v-if="archive.items.length" class="mt-6 grid gap-4">
			<li v-for="item in archive.items" :key="item.id">
				<Link :href="item.link" class="underline">{{ item.title || t('archive.untitled') }}</Link>
			</li>
		</ul>
		<p v-else class="mt-6 text-pretty">{{ t('archive.empty') }}</p>
		<nav v-if="archive.pagination.prevPageUrl || archive.pagination.nextPageUrl" :aria-label="t('archive.pagination')" class="mt-8 flex gap-6">
			<Link v-if="archive.pagination.prevPageUrl" :href="archive.pagination.prevPageUrl" rel="prev" class="underline">{{ t('archive.previous') }}</Link>
			<Link v-if="archive.pagination.nextPageUrl" :href="archive.pagination.nextPageUrl" rel="next" class="underline">{{ t('archive.next') }}</Link>
		</nav>
	</section>
</template>

<script setup>
import { Link } from '@inertiajs/vue3'
import { useI18n } from 'vue-i18n'

defineProps({ archive: { type: Object, required: true } })
const { t } = useI18n()
</script>
