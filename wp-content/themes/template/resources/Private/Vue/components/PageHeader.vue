<template>
	<header ref="root" :class="{ 'header--hidden': isHidden }">
		<slot :is-search-open="isSearchOpened" :toggle-mobile-nav="toggleMobileNav" :toggle-sub-nav="toggleSubNav" :showSearch="showSearch" />
	</header>
</template>

<script lang="ts" setup>
import { ref, onMounted, onUnmounted } from 'vue'
import Dropdown from 'bootstrap/js/dist/dropdown'

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
	const mobileNav = document.querySelector('.mobile-nav')
	if (mobileNav) {
		document.body.classList.toggle('mobile-nav-opened')
		if (document.body.classList.contains('mobile-nav-opened')) {
			const activeNavItems: HTMLElement[] = Array.from(mobileNav.querySelectorAll('a.active'))
				.map((link) => link.parentElement)
				.filter((item) => item && item.classList.contains('sub')) as HTMLElement[]

			activeNavItems.forEach((item) => {
				item.classList.add('js-opened')
				window.domSlider.slideDown({ element: item.querySelector('nav') })
			})
		} else {
			Array.from(mobileNav.querySelectorAll('.js-opened')).forEach((item) => {
				item.classList.remove('js-opened')
				window.domSlider.slideUp({ element: item.querySelector('nav') })
			})
		}
	}
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
	if (root.value) {
		const dropdownElements = root.value.querySelectorAll('[data-bs-toggle="dropdown"]')
		dropdownElements.forEach((item) => new Dropdown(item))
	}
})
</script>
