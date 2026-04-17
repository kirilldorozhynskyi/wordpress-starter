<template>
	<header
		ref="headerEl"
		class="absolute top-0 right-0 left-0 z-99"
		:class="{
			'fixed -translate-y-full transform': isStickyLick,
			transit: isSticky,
			'-translate-y-26!': isSticky,

			'translate-y-0!': showTop,
		}"
	>
		<div :class="{ 'transit bg-primary': isStickyLick }">
			<div class="relative z-20 container">
				<div class="flex items-center justify-between py-4" :class="isStickyLick || menuOpened ? 'text-green-400' : 'text-light lg:py-6'">
						<Link :href="homeUrl" class="relative z-20 inline-block w-fit" prefetch>
							<span class="sr-only">{{ siteName }}</span>
							<SvgObject
								class="h-auto max-md:w-29"
							width="135"
							height="56"
							:src="`${$page.props.theme.uri}/resources/Public/Images/logo.svg`"
						/>
					</Link>

					<HeaderNav :menu="menu" :isStickyLick="isStickyLick" @update:menuOpened="menuOpened = $event" />
				</div>
			</div>
		</div>
	</header>
</template>

<script setup>
import { onMounted, onBeforeUnmount, ref } from 'vue'
import HeaderNav from './Navigation/HeaderNav.vue'

defineProps({
	homeUrl: {
		type: String,
		default: '/'
	},
	siteName: {
		type: String,
		default: ''
	},
	menu: {
		type: Object,
		default: null,
	},
	options: {
		type: Object,
		default: null,
	},
})

// Header sticky behavior (ref-based + reactive class binding)
const headerEl = ref(null)
const lastScrollTop = ref(0)
const isStickyLick = ref(false)
const isSticky = ref(false)
const showTop = ref(false)
const menuOpened = ref(false)

const handleScroll = () => {
	const currentScrollTop = window.scrollY || 0

	if (currentScrollTop > 200) {
		isStickyLick.value = true

		if (currentScrollTop > 280) {
			isSticky.value = true

			if (currentScrollTop > lastScrollTop.value) {
				// Scrolling down — hide top
				showTop.value = false
			} else {
				// Scrolling up — show top
				showTop.value = true
			}
		} else {
			// Between 200–280 — remove show-top
			showTop.value = false
		}
	} else {
		// Below 200px — reset all
		isSticky.value = false
		isStickyLick.value = false
		showTop.value = false
	}

	lastScrollTop.value = currentScrollTop
}

onMounted(() => {
	window.addEventListener('scroll', handleScroll, { passive: true })
	// Initialize state based on current position
	handleScroll()
})

onBeforeUnmount(() => {
	window.removeEventListener('scroll', handleScroll)
})
</script>
