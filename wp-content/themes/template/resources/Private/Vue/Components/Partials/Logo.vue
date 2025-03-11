<template>
	<object
		:aria-label="$page.props.site?.name"
		type="image/svg+xml"
		width="242"
		height="78"
		class="pointer-events-none h-auto w-32 lg:w-[242px]"
		:data="`${$page.props.theme.uri}/resources/Public/Images/Logo.svg`"
	></object>
</template>

<script setup></script>
