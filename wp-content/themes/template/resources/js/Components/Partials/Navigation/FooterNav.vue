<template>
	<ul class="flex flex-col items-start gap-4 divide-y leading-none md:flex-row md:gap-6 md:divide-x md:divide-y-0 lg:items-center" v-if="menu?.items">
		<li v-for="item in menu.items" :key="item.id" class="not-last:pb-4 md:!pb-0 md:not-last:pe-6">
			<Button
				:btn="item"
				class="font-inter after:bg-secondary after:transition-width relative leading-none after:absolute after:-bottom-1 after:left-1/2 after:block after:h-0.5 after:w-0 after:-translate-x-1/2 after:duration-200 after:ease-in-out after:content-[''] hover:after:w-full"
			/>
		</li>
	</ul>
</template>

<script setup>
defineProps({
	menu: Object
})
</script>
