<template>
	<section>
		<div class="container">
			<GForm :id="1" />
		</div>
	</section>
</template>

<script setup>
import GForm from '@/components/Form/GForm.vue'

defineProps({
	ce: {
		type: Object,
		required: true
	}
})
</script>
