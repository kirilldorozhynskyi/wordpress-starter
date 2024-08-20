<template>
	<div class="container">
		<template v-for="(item, index) in $page.props.fields.flexible_content" :key="index">
			<Image class="lol" :image="item?.image?.filename" :alt="item?.image?.alt" :width="640" img-class="img-fluid" />
		</template>
	</div>
</template>

<script setup></script>
