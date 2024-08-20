<template>
	<div class="container">
		<template v-for="(item, index) in $page.props.fields.flexible_content" :key="index">
			<h2>{{ item.text }}</h2>

			<Image class="lol" :image="item?.image?.filename" :alt="item?.image?.alt" :width="640" :height="480" img-class="img-fluid" />
		</template>
	</div>
</template>
