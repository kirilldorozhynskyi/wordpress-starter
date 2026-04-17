<template>
	<div class="">
		<Transition name="fade">
			<button
				v-if="menuOpened"
				type="button"
				class="fixed top-0 left-0 h-screen w-screen"
				:aria-label="$t('menu.close')"
				@click="closeMenu()"
			/>
		</Transition>
		<div
			:class="[
				'transition-all duration-700 ease-in-out',
				'max-lg:fixed max-lg:top-0 max-lg:right-0 max-lg:h-screen max-lg:w-full max-lg:overflow-y-auto',
				'max-lg:bg-white max-lg:pt-24',
				menuOpened ? 'max-lg:translate-x-0' : 'max-lg:translate-x-full',
			]"
		>
			<div class="max-lg:container max-lg:py-16" :class="menuOpened ? 'text-primary' : 'text-light'">
				<div class="flex items-start gap-10 max-lg:flex-wrap xl:gap-24">
					<ul class="flex items-start gap-8 max-lg:flex-col" v-if="menu?.items">
						<li v-for="item in menu.items" :key="item.id" class="flex">
							<Button
								:btn="item"
								class="text-sm"
								:class="item.current ? 'link-underlined' : 'link-hover-underlined'"
								@click="closeMenu()"
							/>
						</li>
					</ul>
				</div>
			</div>
		</div>
		<button
			type="button"
			class="relative flex size-6 cursor-pointer flex-col items-center justify-center gap-1 lg:hidden"
			:class="menuOpened ? 'text-dark-gold hover:text-dark-gold-100' : 'dark:text-dark-gold-100 text-light hover:text-white/80'"
			:aria-label="menuOpened ? $t('menu.close') : $t('menu.toggle')"
			@click="toggleMenu()"
		>
			<span class="h-0.5 w-4.5 origin-center rounded-full bg-current transition" :class="menuOpened ? 'translate-y-0.75 rotate-45' : ' '"></span>
			<span class="h-0.5 w-4.5 origin-center rounded-full bg-current transition" :class="menuOpened ? '-translate-y-0.75 -rotate-45' : ' '"></span>
		</button>
	</div>
</template>

<script setup>
import { ref } from 'vue'

defineProps({
	menu: {
		type: Object,
		default: null,
	},
	header: {
		type: Object,
		default: null,
	},
	isStickyLick: {
		type: Boolean,
		default: false,
	},
})

const emit = defineEmits(['update:menuOpened'])

const menuOpened = ref(false)

const setScrollLock = (locked) => {
	const lenis = typeof window !== 'undefined' ? window.lenis : null
	if (lenis && typeof lenis.stop === 'function' && typeof lenis.start === 'function') {
		if (locked) {
			lenis.stop()
		} else {
			lenis.start()
		}
	}
	// if (typeof document !== 'undefined') {
	// 	document.body.classList.toggle('overflow-hidden', locked)
	// }
}

const toggleMenu = () => {
	menuOpened.value = !menuOpened.value
	emit('update:menuOpened', menuOpened.value)
	setScrollLock(menuOpened.value)
}

const closeMenu = () => {
	menuOpened.value = false
	emit('update:menuOpened', menuOpened.value)
	setScrollLock(false)
}
</script>
