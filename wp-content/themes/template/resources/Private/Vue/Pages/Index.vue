<template>
	<div>
		<FlexibleContent :fields="$page.props.fields.flexible_content" />
	</div>
</template>

<script setup>
import FlexibleContent from '../Components/Acf/FlexibleContent.vue'
</script>
