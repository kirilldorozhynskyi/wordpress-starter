<template>
	<div class="flex flex-col">
		<template v-for="(item, index) in fields" :key="item.key ?? `${item.acf_fc_layout}-${index}`">
			<PageHero
				v-if="item.acf_fc_layout === 'page_hero'"
				:ce="item"
				:first="index === 0"
				:primary-heading="index === primaryHero"
				:fallback-title="index === primaryHero ? pageTitle : ''" />
			<component v-else :is="getItemComponent(item)" :ce="item" :first="index === 0" />
		</template>
	</div>
</template>

<script setup>
import { computed, nextTick, defineAsyncComponent, onMounted, onUnmounted } from 'vue'
import { router } from '@inertiajs/vue3'
import { ensurePrimeVue } from '@/util/primevue'

import PageHero from './Flex/PageHero.vue'

const props = defineProps({
	fields: {
		type: Array,
		required: true
	},
	pageTitle: String,
	offset: {
		type: Boolean,
		default: true
	}
})

const primaryHero = computed(() => {
	const isHero = (item) => item.acf_fc_layout === 'page_hero'
	const titled = props.fields.findIndex((item) => isHero(item) && item.text?.trim())

	return titled >= 0 ? titled : props.fields.findIndex(isHero)
})

const modules = import.meta.glob(['./Flex/*.vue', '!./Flex/PageHero.vue'])
const primeVueFlexComponents = new Set([])

const asyncComponents = {}

const resolveComponentName = (type) =>
	String(type || '')
		.split('_')
		.filter(Boolean)
		.map((word) => word[0].toUpperCase() + word.slice(1))
		.join('')

const getAsyncComponent = (componentName) => {
	if (asyncComponents[componentName]) {
		return asyncComponents[componentName]
	}

	const moduleKey = Object.keys(modules).find((key) => key.endsWith(`/Flex/${componentName}.vue`))

	if (!moduleKey) {
		return undefined
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

	return getAsyncComponent(componentName)
}

const getItemComponent = (item) => getAcfComponent(item.acf_fc_layout)

// Scroll after Inertia navigation when a hash is present.
let stopNavigation
onMounted(() => {
	stopNavigation = router.on('navigate', () => {
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
})
onUnmounted(() => stopNavigation?.())
</script>
