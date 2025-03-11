<template>
	<svg class="sprite-icon" :class="`icon-${name} ${name}`" aria-hidden="true" focusable="false">
		<use :xlink:href="`${$page.props.sprite}#icon-${name}`"></use>
	</svg>
</template>

<script setup>
defineProps({
	name: {
		type: String,
		required: true
	}
})
</script>
