<template>
	<component v-if="fields.length" v-for="(item, index) in fields" :key="item.key" :ce="item" :is="getAcfComponent(item.acf_fc_layout)" />
</template>

<script setup>
import { defineAsyncComponent } from 'vue'

const PageHero = defineAsyncComponent(() => import('../Acf/Flex/PageHero.vue'))
const Content = defineAsyncComponent(() => import('../Acf/Flex/Content.vue'))

defineProps({
	fields: {
		type: Object,
		required: true
	}
})

const getAcfComponent = (type) => {
	switch (type) {
		case 'page_hero':
			return PageHero
		default:
			return Content
	}
}
</script>
