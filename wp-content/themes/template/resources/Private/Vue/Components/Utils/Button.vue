<template>
	<template v-if="checkLink(btn)">
		<Link :href="btn.url" :target="btn.target" :aria-label="btn.title ?? btn.name" v-html="btn.title ?? btn.name" />
	</template>

	<template v-else>
		<a :href="btn.url" :target="btn.target" :aria-label="btn.title ?? btn.name" v-html="btn.title ?? btn.name" />
	</template>
</template>
<script setup>
import { checkLink } from '@/util/JDplugins.ts'

const props = defineProps({
	btn: {
		type: Object,
		required: true
	}
})
</script>
