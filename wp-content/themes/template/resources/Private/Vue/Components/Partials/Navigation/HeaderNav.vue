<template>
	<div
		class="bg-primary fixed top-0 right-0 z-1 h-dvh pt-30 transition-transform duration-200 ease-in-out lg:relative lg:h-auto lg:translate-x-0 lg:bg-transparent lg:pt-0 lg:transition-none"
		:class="menuOpened ? 'w-full max-w-100 translate-x-0' : 'translate-x-full'"
	>
		<ul class="flex flex-col items-center justify-center gap-8 lg:flex-row xl:gap-20" v-if="menu?.items">
			<li
				v-for="item in menu.items"
				:key="item.id"
				class="after:bg-secondary after:transition-width relative after:absolute after:bottom-0 after:left-1/2 after:block after:h-0.5 after:-translate-x-1/2 after:content-['']"
				:class="isCurrent(item.url) ? 'after:w-full' : 'after:w-0 after:duration-200 after:ease-in-out hover:after:w-full'"
			>
				<Button :btn="item" class="ext-[1.5625rem] !leading-8 uppercase" @click="closeMenu()" />
			</li>
		</ul>
	</div>
	<div class="relative z-3 lg:hidden">
		<button
			type="button"
			class="flex h-10 w-10 flex-col items-center justify-center gap-1 hover:bg-transparent"
			:aria-label="$t('open_menu')"
			@click="toggleMenu()"
		>
			<span class="h-0.5 w-6 origin-center bg-white transition" :class="{ 'translate-y-[2.5px] rotate-45': menuOpened }"></span>
			<span class="h-0.5 w-6 origin-center bg-white transition" :class="{ '-translate-y-[2.5px] -rotate-45': menuOpened }"></span>
		</button>
	</div>
</template>

<script setup>
import { ref } from 'vue'
import { usePage } from '@inertiajs/vue3'

const page = usePage()

defineProps({
	menu: Object
})

const menuOpened = ref(false)

const toggleMenu = () => {
	menuOpened.value = !menuOpened.value

	document.querySelector('body').classList.toggle('overflow-hidden')
}

const closeMenu = () => {
	menuOpened.value = false

	document.querySelector('body').classList.remove('overflow-hidden')
}

const isCurrent = (url) => {
	const cleanPageUrl = page.props.site.url.replace(/\/$/, '')
	const curentPage = page.url.replace(/\/$/, '')
	const cleanItemUrl = url.replace(/\/$/, '')
	if (cleanItemUrl.includes(cleanPageUrl)) {
		const checker = cleanItemUrl.replace(cleanPageUrl, '')

		if (checker == curentPage) {
			return true
		}
	} else {
		return cleanPageUrl == cleanItemUrl
	}
}
</script>
