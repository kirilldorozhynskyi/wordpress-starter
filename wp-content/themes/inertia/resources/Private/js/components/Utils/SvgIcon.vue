<template>
	<svg class="sprite-icon" :class="iconClasses" :aria-hidden="decorative" :aria-label="ariaLabel" :role="decorative ? undefined : 'img'" focusable="false">
		<use :xlink:href="iconHref"></use>
	</svg>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { usePage } from '@inertiajs/vue3'

const props = withDefaults(
	defineProps<{
		name: string
		label?: string | null
		decorative?: boolean
	}>(),
	{
		label: null,
		decorative: true,
	}
)

const page = usePage()

const symbolId = computed(() => `icon-${props.name}`)
const iconHref = computed(() => `${page.props.sprite ?? ''}#${symbolId.value}`)
const iconClasses = computed(() => [symbolId.value, props.name])
const ariaLabel = computed(() => (props.decorative ? undefined : props.label ?? props.name))
</script>
