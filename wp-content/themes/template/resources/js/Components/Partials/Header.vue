<template>
	<header class="relative z-[999] lg:pt-14">
		<div class="container">
			<div class="offset flex items-center justify-between gap-20">
				<Link :href="$page.props.site.url" :aria-label="$page.props.site?.name" class="inline-block w-fit">
					Logo
					<!-- <HeaderLogo /> -->
				</Link>

				<HeaderNav :menu="menu" />
			</div>
		</div>
	</header>
</template>

<script setup>
import HeaderLogo from './Logo.vue'
import HeaderNav from './Navigation/HeaderNav.vue'

defineProps({
	menu: Object
})
</script>
