<template>
	<transition-group name="fade" tag="div">
		<div ref="gForm" :key="'gForm'">
			<!-- Loader -->
			<div class="spinner-loader" role="status" v-show="isLoading" :key="'loader'">
				<span class="visually-hidden">{{ $t('form.loading') }}</span>
			</div>

			<!-- Confirmation -->
			<div id="confirmation" v-if="isSubmited" v-html="confirmationData?.confirmation_message" :key="'confirmation'"></div>

			<div></div>
			<form
				v-if="!isLoading && !isSubmited"
				@submit.prevent="submitForm"
				:key="'form'"
				:class="{ disabled: isSubmitting }"
				class="font-inter flex flex-col gap-4"
			>
				<div>
					<div class="flex items-center border-2 border-white ps-3">
						<FieldInput
							v-model="form[formData?.fields[0].key]"
							:field="formData?.fields[0]"
							:requiredIndicator="formData?.requiredIndicator"
							:error="errorData.validation_messages[formData?.fields[0].id]"
						/>

						<div class="" v-if="formData?.button" :key="'button-wrapper'">
							<slot />
							<button
								v-if="!isSubmited"
								:disabled="isSubmitting"
								@click="submitForm"
								type="submit"
								class="btn-secondary group w-full px-6"
								:class="{ 'disabled loading': isSubmitting }"
								:aria-label="formData?.button?.text"
							>
								<SvgIcon name="arrow" class="text-secondary text-4xl transition-all duration-600 group-hover:translate-x-4 group-hover:transform" />
							</button>
						</div>
					</div>

					<Message v-if="errorData.validation_messages[formData?.fields[0].id]" severity="error" size="small" variant="simple">{{
						errorData.validation_messages[formData?.fields[0].id]
					}}</Message>
				</div>
				<FieldConsent
					v-model="form[formData?.fields[1].key]"
					:field="formData?.fields[1]"
					:requiredIndicator="formData?.requiredIndicator"
					:error="errorData.validation_messages[formData?.fields[0].id]"
				/>
			</form>
		</div>
	</transition-group>
</template>

<script setup>
import { ref, onMounted, defineAsyncComponent } from 'vue'
import axios from 'axios'
import VueScrollTo from 'vue-scrollto'
// import Svgicon from './SvgIcon.vue'
import Message from 'primevue/message'

const FieldInput = defineAsyncComponent(() => import('./Form/Input.vue'))
const FieldDate = defineAsyncComponent(() => import('./Form/Date.vue'))
const FieldConsent = defineAsyncComponent(() => import('./Form/Consent.vue'))
const FieldFileupload = defineAsyncComponent(() => import('./Form/File.vue'))
const FieldTextarea = defineAsyncComponent(() => import('./Form/Textarea.vue'))
const FieldRadio = defineAsyncComponent(() => import('./Form/Radio.vue'))
// const Phone = defineAsyncComponent(() => import('./Form/Phone.vue'))
const FieldHtml = defineAsyncComponent(() => import('./Form/Html.vue'))

const props = defineProps({
	id: {
		type: [Number, String],
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
		case 'phone':
			return Phone
		default:
			return FieldInput
	}
}
</script>
