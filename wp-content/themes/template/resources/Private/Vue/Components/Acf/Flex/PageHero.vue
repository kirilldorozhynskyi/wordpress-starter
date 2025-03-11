<template>
	<section>
		<div class="container">
			<h2>{{ ce.text }}</h2>

			<SvgIcon name="facebook" />

			<div class="" v-if="ce.image">
				<Image
					class=""
					:image="ce?.image"
					:alt="ce?.image?.alt"
					:width="1280"
					:height="367"
					:img-class="'object-cover w-full'"
					:media="{
						650: { width: 367, height: 400 },
						768: { width: 150, height: 300 },
						1024: { width: 300, height: 600 }
					}"
				/>
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
