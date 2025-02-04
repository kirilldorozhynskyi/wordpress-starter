<template>
	<section>
		<div class="container">
			<h2>{{ ce.text }}</h2>

			<svg class="sprite-icon icon-facebook facebook" aria-hidden="true" focusable="false"><use :xlink:href="`${$page.props.sprite}#icon-facebook`"></use></svg>

			<div class="mx-auto flex w-56 overflow-hidden rounded-lg text-center sm:w-96">
				<Image class="lol" :image="ce?.image?.filename" :alt="ce?.image?.alt" :width="640" :height="880" img-class="object-cover w-full" />
			</div>
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
