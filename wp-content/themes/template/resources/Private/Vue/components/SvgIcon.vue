<template>
	<svg aria-hidden="true" class="sprite-icon">
		<use :href="symbolId" />
	</svg>
</template>

<script>
import { defineComponent, computed } from 'vue'

export default defineComponent({
	name: 'SvgIcon',
	props: {
		prefix: {
			type: String,
			default: 'icon'
		},
		name: {
			type: String,
			required: true
		}
	},
	setup(props) {
		const symbolId = computed(() => `#${props.prefix}-${props.name}`)
		return { symbolId }
	}
})
</script>

<style>
.sprite-icon {
	width: 1em;
	height: 1em;
	fill: currentColor;
}
</style>
