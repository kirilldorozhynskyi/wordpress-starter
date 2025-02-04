<template>
	<div class="section-gap flex flex-col">
		<component v-for="(item, index) in fields" :key="item.key" :ce="item" :is="getAcfComponent(item.acf_fc_layout)" />
	</div>
</template>

<script setup>
import { defineAsyncComponent, hydrateOnVisible } from 'vue'
import { parseAcf } from '@/util/JDplugins'

// import PageHero from '@/Components/Acf/Flex/PageHero.vue'

defineProps({
	fields: {
		type: Object,
		required: true
	}
})

const components = {
	// PageHero,
	PageHero: defineAsyncComponent({
		loader: () => import('@/Components/Acf/Flex/PageHero.vue'),
		hydrate: hydrateOnVisible()
	}),
	Content: defineAsyncComponent({
		loader: () => import('@/Components/Acf/Flex/Content.vue'),
		hydrate: hydrateOnVisible()
	})
}

const getAcfComponent = (type) => {
	const componentName = type
		.split('_')
		.map((word) => word[0].toUpperCase() + word.slice(1))
		.join('')

	return components[componentName] || components['Content'] // Using components['Content'] to ensure it's defined
}
</script>
