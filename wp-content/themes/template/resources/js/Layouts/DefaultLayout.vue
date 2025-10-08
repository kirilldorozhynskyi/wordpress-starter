<template>
	<slot />

	<SvgIcon name="facebook" />
</template>

<script setup>
import { usePage, Link } from '@inertiajs/vue3'
import { computed } from 'vue'

const logo = computed(() => usePage().props.wp.logo)
const homeUrl = computed(() => usePage().props.wp.homeUrl)
const siteName = computed(() => usePage().props.wp.name)
const headerMenu = computed(() => usePage().props.wp.menus['header-menu'] ?? null)
</script>
