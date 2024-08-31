<template>
	<section>
		{{ $tc('default.company_id') }}

		<h2>{{ ce.text }}</h2>

		<svg class="sprite-icon icon-facebook facebook" aria-hidden="true" focusable="false"><use :xlink:href="`${$page.props.sprite}#icon-facebook`"></use></svg>

		<div class="flex text-center rounded-lg overflow-hidden w-56 sm:w-96 mx-auto">
			<Image class="lol" :image="ce?.image?.filename" :alt="ce?.image?.alt" :width="640" :height="480" img-class="object-cover h-48 w-96" />
		</div>
	</section>
</template>
<script setup>
defineProps({
	ce: {
		type: Object,
		required: true
	}
})
</script>
