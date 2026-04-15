<script setup lang="ts">
import { checkLink } from '@/util/JDplugins'
import { computed, resolveComponent } from 'vue'

const props = defineProps<{
	btn: {
		url: string
		target?: string
		title?: string
		name?: string
	}
	icon?: string | boolean
}>()

const tag = computed(() => (checkLink(props.btn) ? resolveComponent('Link') : 'a'))
</script>

<template>
	<component v-if="btn" :is="tag" :href="btn.url" :target="btn.target" :aria-label="btn.title ?? btn.name" prefetch>
		<slot>
			<span>
				{{ btn.title ?? btn.name }}
			</span>
			<SvgIcon v-if="icon" :name="icon" />
		</slot>
	</component>
</template>
