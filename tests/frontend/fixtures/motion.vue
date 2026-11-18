<template>
	<main>
		<nav>
			<Link href="/tests/frontend/fixtures/motion">With motion</Link>
			<Link href="/tests/frontend/fixtures/motion/static">Without motion</Link>
		</nav>

		<template v-if="animated">
			<h1 v-reveal-heading="{ duration: 0.01 }">Accessible heading</h1>
			<p v-reveal-text="{ duration: 0.01 }">A line of body text</p>
			<pre v-reveal-text>  existing indentation</pre>
			<div id="mask" v-reveal-mask="{ duration: 2, start: 'top bottom' }">Masked frame</div>
			<div style="height: 120px">
				<div id="zoom" v-scroll-zoom-out="{ from: 1.2, start: 'top top' }">Clipped media layer</div>
			</div>
			<div style="height: 1600px"></div>
			<p id="fade" v-jd-animate="{ once: true, duration: 50 }">Below the fold</p>
		</template>
		<h1 v-else>Static page</h1>
	</main>
</template>

<script setup>
defineProps({ animated: Boolean })
</script>
