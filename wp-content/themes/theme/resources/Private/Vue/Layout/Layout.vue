<template>
	<div class="flex flex-col min-h-screen overflow-hidden">
		<Head>
			<title>{{ $page.props.seo.title }}</title>
			<meta name="description" :content="$page.props.seo.description" />
		</Head>

		<main>
			<Link href="/cart"> test </Link>
			<Link href="/"> home </Link>
			<slot></slot>
		</main>
	</div>
</template>

<script setup></script>
