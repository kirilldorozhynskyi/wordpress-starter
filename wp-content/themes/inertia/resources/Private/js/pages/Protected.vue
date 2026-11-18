<template>
	<div class="container py-20" v-html="passwordForm"></div>
</template>

<script setup lang="ts">
defineProps<{
	passwordForm: string
}>()
</script>
