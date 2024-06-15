<template>
	<transition-group name="fade" tag="div">
		<div ref="gForm" :key="'gForm'">
			<!-- Loader -->
			<div class="spinner-loader" role="status" v-show="isLoading" :key="'loader'">
				<span class="visually-hidden">Načítava</span>
			</div>

			<!-- Confirmation -->
			<div id="confirmation" v-if="isSubmited" v-html="confirmationData?.confirmation_message" :key="'confirmation'"></div>

			<form v-if="!isLoading && !isSubmited" @submit.prevent="submitForm" :key="'form'" :class="{ disabled: isSubmitting }">
				<div class="row row-gap-2">
					<component
						v-if="formData?.fields.length"
						v-for="(item, index) in formData?.fields"
						:key="item.key"
						v-model="form[item.key]"
						:field="item"
						:error="errorData.validation_messages[item.id]"
						:requiredIndicator="formData?.requiredIndicator"
						:is="getFieldComponent(item.type)"
					/>
				</div>
			</form>
			<transition name="fade">
				<div class="form-button d-flex justify-content-end align-items-center" v-if="formData?.button" :key="'button-wrapper'">
					<slot />
					<button
						v-if="!isSubmited"
						:disabled="isSubmitting"
						@click="submitForm"
						type="submit"
						class="btn btn-submit btn-outline-white text-uppercase btn-icon btn-loading"
						:class="{ 'disabled loading': isSubmitting }"
					>
						<span v-if="formData?.button?.text" v-html="formData?.button?.text"></span>
					</button>
				</div>
			</transition>
		</div>
	</transition-group>
</template>

<script setup>
import { ref, onMounted, defineAsyncComponent } from 'vue'
import axios from 'axios'
import VueScrollTo from 'vue-scrollto'
// import Svgicon from './SvgIcon.vue'

const FieldInput = defineAsyncComponent(() => import('./Form/Input.vue'))
const FieldDate = defineAsyncComponent(() => import('./Form/Date.vue'))
const FieldConsent = defineAsyncComponent(() => import('./Form/Consent.vue'))
const FieldFileupload = defineAsyncComponent(() => import('./Form/File.vue'))
const FieldTextarea = defineAsyncComponent(() => import('./Form/Textarea.vue'))
const FieldRadio = defineAsyncComponent(() => import('./Form/Radio.vue'))
const FieldHtml = defineAsyncComponent(() => import('./Form/Html.vue'))

const props = defineProps({
	id: {
		type: Number,
		required: true
	},
	lang: {
		type: String,
		required: true
	}
})

const isLoading = ref(true)
const isSubmitting = ref(false)
const isSubmited = ref(false)
const errorData = ref({ validation_messages: {} })
const confirmationData = ref({ confirmation_message: {} })
const form = ref({})
const gForm = ref()

const formData = ref(null)

const FORM_GET_URL = '/wp-json/jdev/get-form'
const FORM_SUBMIT_URL = `/wp-json/gf/v2/forms/${props.id}/submissions`

const fetchFormData = async () => {
	try {
		const response = await axios.get(FORM_GET_URL, {
			params: {
				id: props.id,
				lang: props.lang
			}
		})

		formData.value = response.data
		isLoading.value = false
	} catch (error) {
		console.error('Error fetching form data:', error)
		formData.value = null
	}
}

onMounted(() => {
	fetchFormData()
})

const submitForm = async () => {
	const formData = new FormData()
	isSubmitting.value = true
	Object.entries(form.value).forEach(([key, value]) => {
		if (value) {
			formData.append(key, value)
		}
	})

	try {
		const response = await axios.post(FORM_SUBMIT_URL, formData, {
			headers: {
				'Content-Type': 'multipart/form-data',
				Authorization: `Basic ${btoa('YOUR_CONSUMER_KEY:YOUR_CONSUMER_SECRET')}`
			}
		})

		VueScrollTo.scrollTo(gForm.value, {
			offset: -100
		})
		isSubmited.value = true
		confirmationData.value = response.data
	} catch (error) {
		console.error('Form submission failed:', error)
		errorData.value = error.response.data
		isSubmitting.value = false
	}
}

const getFieldComponent = (type) => {
	switch (type) {
		case 'consent':
			return FieldConsent
		case 'date':
			return FieldDate
		case 'textarea':
			return FieldTextarea
		case 'fileupload':
			return FieldFileupload
		case 'radio':
			return FieldRadio
		case 'html':
			return FieldHtml
		default:
			return FieldInput
	}
}
</script>
