<template>
	<footer class="mt-auto py-20">
		<div class="container">
			<div class="offset flex flex-col gap-4 text-sm lg:flex-row lg:items-center lg:gap-22 lg:text-base">
				<span class="font-inter"> Copyright © {{ new Date().getFullYear() }}</span>

				<FooterNav :menu="menu" />
			</div>
		</div>
	</footer>
</template>

<script setup>
import HeaderLogo from './Logo.vue'
import FooterNav from './Navigation/FooterNav.vue'
import Contact from './Contact.vue'

defineProps({
	menu: Object
})
</script>
