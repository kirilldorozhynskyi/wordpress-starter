<template>
	<div>
		<FlexibleContent v-if="$page.props?.fields" :fields="$page.props?.fields?.flexible_content" />
	</div>
</template>

<script setup>
import FlexibleContent from '../Components/Acf/FlexibleContent.vue'
</script>
