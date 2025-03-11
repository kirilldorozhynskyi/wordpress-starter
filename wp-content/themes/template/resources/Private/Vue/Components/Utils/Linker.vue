<template>
	<template v-if="link.url && checkLink(link)">
		<Link :href="link.url" :target="link.target" :aria-label="link.title ?? link.name">
			<slot />
		</Link>
	</template>

	<template v-else-if="link.url">
		<a :href="link.url" :target="link.target" :aria-label="link.title ?? link.name">
			<slot />
		</a>
	</template>

	<template v-else>
		<div>
			<slot />
		</div>
	</template>
</template>
<script setup>
import { checkLink } from '@/util/JDplugins.ts'

const props = defineProps({
	link: {
		type: [Object, String],
		required: true,
		default: ''
	}
})
</script>
