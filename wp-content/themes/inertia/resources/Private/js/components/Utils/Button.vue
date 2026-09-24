<script setup lang="ts">
import { computed, resolveComponent } from 'vue'
import { usePage } from '@inertiajs/vue3'
import { checkLink } from '@/util/JDplugins'

const props = defineProps<{
	btn: {
		url: string
		target?: string
		title?: string
		name?: string
	}
	icon?: string | boolean
}>()

const page = usePage<{ wp: { homeUrl?: string } }>()
const internal = computed(() => checkLink(props.btn, page.props.wp?.homeUrl))
const tag = computed(() => (internal.value ? resolveComponent('Link') : 'a'))
</script>

<template>
	<component
		v-if="btn"
		:is="tag"
		:href="btn.url"
		:target="btn.target"
		:aria-label="btn.title ?? btn.name"
		:prefetch="internal ? true : undefined"
		:rel="btn.target === '_blank' ? 'noopener noreferrer' : undefined">
		<slot>
			<span>
				{{ btn.title ?? btn.name }}
			</span>
			<SvgIcon v-if="icon" :name="icon" />
		</slot>
	</component>
</template>
