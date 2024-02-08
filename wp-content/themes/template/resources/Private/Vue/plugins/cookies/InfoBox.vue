<template>
	<transition name="fade">
		<div
			v-if="!cookies.closed.value || props.isCookiePage"
			:class="{
				'cookies-info-box': true,
				'info-panel': !props.isCookiePage,
				'cookies-info-box--page': props.isCookiePage
			}"
		>
			<slot :accept="(event) => cookies.accept(event)" :acceptAll="() => cookies.acceptAll()" :close="() => cookies.close()" :categories="cookies.categories" />
			<slot
				name="actions"
				:accept="(event) => cookies.accept(event)"
				:acceptAll="() => cookies.acceptAll()"
				:close="() => cookies.close()"
				:categories="cookies.categories"
			>
				<div class="d-grid d-sm-block text-end">
					<button type="button" class="btn btn-outline-white mb-half" @click="cookies.accept" v-html="`${acceptLabel}`" />
					<button type="button" class="btn btn-white ms-sm-1 mb-half" @click="cookies.acceptAll" v-html="`${acceptAllLabel}`" />
				</div>
			</slot>
			<div class="collapse info-panel-details" id="cookie-info-box-collapse" ref="details">
				<slot name="details" />
			</div>
		</div>
	</transition>
</template>

<script lang="ts">
import { defineComponent, inject, onBeforeUnmount, onMounted, ref } from 'vue'
import type DsCookies from './DsCookies'
import VueScrollTo from 'vue-scrollto'
import Collapse from 'bootstrap/js/dist/collapse'

export default defineComponent({
	props: {
		acceptLabel: {
			type: String,
			default: 'Confirm selection'
		},
		acceptAllLabel: {
			type: String,
			default: 'Accept all'
		},
		isCookiePage: {
			type: Boolean,
			default: false
		}
	},
	setup(props) {
		const cookies: DsCookies | undefined = inject('cookies')
		const details = ref<HTMLElement>()

		if (!cookies) {
			return
		}

		const scrollToDetails = () => {
			VueScrollTo.scrollTo(details.value, 700, {
				container: details.value?.parentElement
			})
		}

		onMounted(() => {
			if (details.value) {
				new Collapse(details.value, {
					toggle: false
				})

				details.value?.addEventListener('shown.bs.collapse', scrollToDetails)
			}
		})

		onBeforeUnmount(() => {
			if (details.value) {
				details.value?.removeEventListener('shown.bs.collapse', scrollToDetails)
			}
		})

		return {
			cookies,
			details,
			props
		}
	}
})
</script>
