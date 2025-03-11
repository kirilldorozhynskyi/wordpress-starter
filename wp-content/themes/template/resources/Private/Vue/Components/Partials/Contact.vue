<template>
	<section class="offset-top">
		<div class="container">
			<div class="bg-dark p-8 lg:p-12" data-aos="fade-up">
				<div class="divide-secondary divide-y lg:grid lg:grid-cols-2 lg:divide-x lg:divide-y-0">
					<div class="flex w-full items-center pb-10 lg:py-3 lg:pe-16 xl:pe-24">
						<div class="flex flex-col gap-8">
							<h2 v-if="options.footer_newsletter_text" class="title-h2 uppercase" v-html="options.footer_newsletter_text" />
						</div>
					</div>
					<div class="flex items-center pt-10 lg:py-3 lg:ps-16 xl:ps-24">
						<div class="flex flex-col items-start gap-7">
							<h2 v-if="options.contact_text" class="title-h2 uppercase" v-html="options.contact_text" />

							<Linker :link="options.contact_link" class="btn w-full lg:w-auto">
								{{ options.contact_link.title }}

								<SvgIcon name="arrow" class="text-3xl" />
							</Linker>
						</div>
					</div>
				</div>
			</div>
		</div>
	</section>
</template>

<script setup>
import Linker from '@/Components/Utils/Linker.vue'

defineProps({
	options: Object
})
</script>

<style>
.p-inputtext {
	--p-inputtext-filled-background: transparent;
	--p-inputtext-filled-hover-background: transparent;
	--p-inputtext-filled-focus-background: transparent;
	--p-inputtext-color: white;
	border: 0 !important;
}

.p-floatlabel label {
	--p-floatlabel-focus-color: white;
	--p-floatlabel-color: white;
}
</style>
