<template>
	<section>
		<div class="container-fluid">
			<div class="bg-gray flex flex-col gap-20 rounded-2xl py-6 md:py-14">
				<div class="container flex flex-col gap-14 lg:gap-20">
					<div class="grid gap-14 md:grid-cols-2 md:gap-5 lg:grid-cols-7 lg:gap-2.5">
						<div class="flex items-center lg:col-span-3">
							<Title2 :ce="ce" :textClass="'max-w-[450px]'" />
						</div>
						<div class="lg:col-span-3 lg:col-start-5" v-if="ce.gallery.length">
							<button @click="handlePrev">Prev</button>
							<button @click="handleNext">Next</button>
						</div>
					</div>
				</div>

				<div v-if="ce.gallery.length" class="overflow-hidden">
					<Slider ref="sliderRef" :navigation="false" :controls="false">
						<figure class="embla__slide" v-for="(item, index) in ce.gallery" :key="index">
							<Image
								class="flex"
								:image="item.image ?? item"
								:alt="item.image?.alt ?? item.alt"
								:width="900"
								:height="670"
								img-class=""
								size="full"
								size_retina="full_2x"
							/>
						</figure>
					</Slider>
				</div>
			</div>
		</div>
	</section>
</template>
<script setup>
import Title2 from './Elements/Title2.vue'
import Slider from './Elements/Slider.vue'
import { ref } from 'vue'
defineProps({
	ce: {
		type: Object,
		required: true
	}
})

const sliderRef = ref(null)

const handlePrev = () => {
	sliderRef.value?.scrollPrev()
}
const handleNext = () => {
	sliderRef.value?.scrollNext()
}
</script>
