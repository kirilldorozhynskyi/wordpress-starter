<template>
	<div>
		<div v-for="(item, index) in $page.props.fields.flexible_content" :key="index">
			<picture class="picture" v-for="(fake, index) in 20" :key="index">
				<source
					:srcset="`/wp-json/jdev/get-image/${item.image.filename}?w=640&h=640&webp=true 1x, /wp-json/jdev/get-image/${item.image.filename}?w=1280&h=1280&webp=true 2x`"
					type="image/webp"
				/>
				<img
					:srcset="`/wp-json/jdev/get-image/${item.image.filename}?w=640&h=640 1x, /wp-json/jdev/get-image/${item.image.filename}?w=1280&h=1280 2x`"
					width="640"
					height="640"
					class="img-fluid"
					:alt="item.image.filename.alt"
				/>
			</picture>
		</div>
	</div>
</template>
