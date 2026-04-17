<template>
	<div class="flex flex-col">
		<template v-for="(item, index) in fields" :key="item.key">
			<component :is="getItemComponent(item)" :ce="item" :first="index == 0" />
		</template>
	</div>
</template>

<script setup>
import { nextTick, defineAsyncComponent } from 'vue'
import { router } from '@inertiajs/vue3'
import { ensurePrimeVue } from '@/util/primevue'

import PageHero from './Flex/PageHero.vue'

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

const modules = import.meta.glob('./Flex/*.vue')
const primeVueFlexComponents = new Set([])

const eagerComponents = {
	PageHero
}

const asyncComponents = {}

const resolveComponentName = (type) =>
	type
		.split('_')
		.map((word) => word[0].toUpperCase() + word.slice(1))
		.join('')

const getAsyncComponent = (componentName) => {
	if (asyncComponents[componentName]) {
		return asyncComponents[componentName]
	}

	const moduleKey = Object.keys(modules).find((key) => key.endsWith(`/Flex/${componentName}.vue`))

	if (!moduleKey) {
		return eagerComponents.Content
	}

	asyncComponents[componentName] = defineAsyncComponent(async () => {
		if (primeVueFlexComponents.has(componentName)) {
			await ensurePrimeVue()
		}

		const module = await modules[moduleKey]()
		return module.default ?? module
	})

	return asyncComponents[componentName]
}

const getAcfComponent = (type) => {
	const componentName = resolveComponentName(type)

	return eagerComponents[componentName] || getAsyncComponent(componentName)
}

const getItemComponent = (item) => getAcfComponent(item.acf_fc_layout)

// Scroll after Inertia navigation when a hash is present.
router.on('navigate', () => {
	if (window.location.hash) {
		const id = window.location.hash.slice(1)
		nextTick(() => {
			const el = document.getElementById(id)
			if (el) {
				el.scrollIntoView()
			}
		})
	}
})
</script>
