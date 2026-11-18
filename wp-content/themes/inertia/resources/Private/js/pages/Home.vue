<template>
	<div>
		<h1 v-if="!hasHero" class="container pt-36 text-balance">{{ pageTitle }}</h1>
		<FlexibleContent v-if="sections.length" :fields="sections" :page-title="pageTitle" />
		<div v-else-if="pageContent" class="container py-6">
			<div class="prose" v-html="pageContent" />
		</div>
	</div>
</template>

<script setup>
import { computed } from 'vue'
import FlexibleContent from '@/components/Acf/FlexibleContent.vue'

const props = defineProps({
	pageTitle: String,
	pageContent: String,
	fields: {
		type: [Object, Boolean],
		required: false,
		default: () => ({})
	}
})

const sections = computed(() => props.fields?.flexible_content || [])
const hasHero = computed(() => sections.value.some((section) => section.acf_fc_layout === 'page_hero'))
</script>
