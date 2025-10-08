<template>
	<div class="flex flex-col">
		<component
			v-for="(item, index) in fields"
			:key="item.key"
			:ce="item"
			:is="getAcfComponent(item.acf_fc_layout)"
			:class="[{ 'mt-24': item.acf_fc_layout != 'page_hero' && index == 0 && offset }, { 'bg-light-green': item.light_bg }]"
			:first="index == 0"
		/>
	</div>
</template>

<script setup>
import { nextTick } from 'vue'
import { router } from '@inertiajs/vue3'

import PageHero from '@/Components/Acf/Flex/PageHero.vue'
import Title from '@/Components/Acf/Flex/Title.vue'
import FlatTable from '@/Components/Acf/Flex/FlatTable.vue'

defineProps({
	fields: {
		type: [Object, Boolean],
		required: true
	},
	offset: {
		type: Boolean,
		default: true
	}
})

// Auto-register всех Flex-компонентов сразу (без lazy load)
const modules = import.meta.glob('@/Components/Acf/Flex/*.vue', { eager: true })

const components = {
	PageHero
}

for (const [path, module] of Object.entries(modules)) {
	const name = path.split('/').pop().replace('.vue', '')
	if (!['PageHero', 'Title', 'FlatTable'].includes(name)) {
		components[name] = module.default
	}
}

const getAcfComponent = (type) => {
	const componentName = type
		.split('_')
		.map((word) => word[0].toUpperCase() + word.slice(1))
		.join('')

	return components[componentName] || components['Content']
}

// Скролл через Inertia после навигации
router.on('navigate', () => {
	if (window.location.hash) {
		const id = window.location.hash.slice(1)
		nextTick(() => {
			const el = document.getElementById(id)
			if (el) {
				el.scrollIntoView() // сразу без плавности
			}
		})
	}
})
</script>
