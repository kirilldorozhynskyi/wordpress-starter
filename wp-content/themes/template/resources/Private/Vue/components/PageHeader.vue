<template>
	<header ref="root" :class="{ 'header--hidden': isHidden }">
		<slot :is-search-open="isSearchOpened" :toggle-mobile-nav="toggleMobileNav" :toggle-sub-nav="toggleSubNav" :showSearch="showSearch" />
	</header>
</template>

<script lang="ts" setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useMediaQuery } from '@vueuse/core'

const mobile = useMediaQuery('(min-width: 992px)')
const mobileDown = useMediaQuery('(max-width: 992px)')

const SCROLL_DELTA = 50

const isHidden = ref(false)
let lastScrollPosition = window.scrollY
const root = ref<HTMLElement | null>(null)
const isSearchOpened = ref(false)

const handleScroll = () => {
	if (window.scrollY >= 0) {
		if (Math.abs(window.scrollY - lastScrollPosition) >= SCROLL_DELTA) {
			isHidden.value = window.scrollY >= lastScrollPosition
			lastScrollPosition = window.scrollY
		}
	}
}

window.addEventListener('scroll', handleScroll)

onUnmounted(() => {
	window.removeEventListener('scroll', handleScroll)
})

const toggleMobileNav = () => {
	const mobileNav = document.querySelector('.main-nav')
	if (mobileNav) {
		document.body.classList.toggle('mobile-nav-opened')
	}
}

const setupChildrenNav = () => {
	const children = root.value ? Array.from(root.value.querySelectorAll('.has-children')) : []
	children.forEach((item: Element) => {
		item.querySelector('.subnav-toggle')?.addEventListener('click', (event: Event) => {
			if (mobileDown.value) {
				event.preventDefault()
				item.querySelector('.subnav-menu')?.classList.toggle('show')
			}
		})

		item.querySelector('.subnav-menu-back')?.addEventListener('click', (event: Event) => {
			if (mobileDown.value) {
				event.preventDefault()
				item.querySelector('.subnav-menu')?.classList.toggle('show')
			}
		})
	})
}

const toggleSubNav = (event: Event) => {
	const eTarget = event.target as HTMLElement
	const navItem = eTarget.parentElement
	if (navItem?.classList.contains('sub')) {
		event.preventDefault()
		navItem.classList.toggle('js-opened')
		window.domSlider.slideToggle({ element: navItem.querySelector('nav') })
	}
}

const showSearch = () => {
	const search = document.querySelector('.header-search')
	if (search) {
		search.classList.add('opened')
		const searchInput = search.querySelector('.header-search-input') as HTMLInputElement
		if (searchInput) {
			searchInput.setAttribute('autofocus', 'autofocus')
			searchInput.focus()
		}
	}
}

onMounted(() => {
	setupChildrenNav()
})
</script>
