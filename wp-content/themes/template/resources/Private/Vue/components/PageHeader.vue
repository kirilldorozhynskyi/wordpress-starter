<template>
	<header ref="root" :class="{ 'header--hidden': isHidden }">
		<slot :is-search-open="isSearchOpened" :toggle-mobile-nav="toggleMobileNav" :toggle-sub-nav="toggleSubNav" :showSearch="showSearch" />
	</header>
</template>

<script lang="ts">
/* eslint-disable */
import { defineComponent, ref, onMounted } from 'vue'
import Dropdown from 'bootstrap/js/dist/dropdown'

const SCROLL_DELTA = 50

export default defineComponent({
	data() {
		return {
			isSearchOpened: false
		}
	},
	setup() {
		let isHidden = ref(false)
		let lastScrollPosition = window.pageYOffset
		const root = ref<HTMLElement>()

		window.addEventListener('scroll', () => {
			if (window.pageYOffset >= 0) {
				if (Math.abs(window.pageYOffset - lastScrollPosition) >= SCROLL_DELTA) {
					isHidden.value = window.pageYOffset >= lastScrollPosition
					lastScrollPosition = window.pageYOffset
				}
			}
		})

		function toggleMobileNav() {
			console.log(1)
			let mobileNav = document.querySelector('.mobile-nav')
			if (mobileNav) {
				document.body.classList.toggle('mobile-nav-opened')
				if (document.body.classList.contains('mobile-nav-opened')) {
					// opening mobile nav
					const activeNavItems: Array<HTMLElement> = []
					Array.from<HTMLAnchorElement>(mobileNav.querySelectorAll('a.active')).forEach((link) => {
						const activeNavItem = link.parentElement
						if (activeNavItem && activeNavItem.classList.contains('sub')) {
							activeNavItems.push(activeNavItem)
						}
					})
					activeNavItems.forEach((item) => {
						item.classList.add('js-opened')
						window.domSlider.slideDown({ element: item.querySelector('nav') })
					})
				} else {
					// closing mobile nav
					Array.from<HTMLAnchorElement>(mobileNav.querySelectorAll('.js-opened')).forEach((item) => {
						item.classList.remove('js-opened')
						window.domSlider.slideUp({ element: item.querySelector('nav') })
					})
				}
			}
		}

		function toggleSubNav(event: Event) {
			const eTarget = event.target as HTMLElement
			const navItem = eTarget.parentElement
			if (navItem?.classList.contains('sub')) {
				event.preventDefault()
				navItem.classList.toggle('js-opened')
				window.domSlider.slideToggle({ element: navItem.querySelector('nav') })
			}
		}

		function showSearch() {
			let search = document.querySelector('.header-search')
			if (search) {
				search.classList.add('opened')
				let searchInput = document.querySelector('.header-search-input')
				if (searchInput) {
					searchInput.setAttribute('autofocus', 'autofocus')
				}
			}
		}

		onMounted(() => {
			let dropdownElements = root.value ? Array.from(root.value.querySelectorAll('[data-bs-toggle="dropdown"]')) : []
			if (dropdownElements.length) {
				dropdownElements.map((item: any) => {
					return new Dropdown(item)
				})
			}
		})

		return {
			isHidden,
			toggleMobileNav,
			toggleSubNav,
			showSearch,
			root
		}
	}
})
</script>
