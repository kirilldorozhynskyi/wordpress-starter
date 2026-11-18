<template>
	<div ref="root" :aria-busy="status === 'loading' || status === 'submitting'">
		<div v-if="status === 'idle'" class="min-h-56 md:min-h-72" aria-hidden="true" />
		<p v-if="status === 'loading'" role="status" class="text-pretty">{{ t('form.loading') }}</p>
		<div v-if="status === 'load-error'" role="alert" class="flex flex-col items-start gap-4">
			<p class="text-pretty">{{ t('form.load_error') }}</p>
			<button
				type="button"
				:class="[
					'min-h-11 cursor-pointer rounded bg-gray-950 px-6 py-3 text-white transition-colors',
					'hover:bg-gray-800 focus-visible:outline-2 focus-visible:outline-offset-2',
					'disabled:cursor-wait disabled:opacity-60 motion-reduce:transition-none'
				]"
				@click="load">
				{{ t('form.retry') }}
			</button>
		</div>
		<div v-if="status === 'success'" ref="confirmation" tabindex="-1" role="status" class="success-submit text-pretty">
			{{ t('form.success') }}
		</div>
		<form v-if="status === 'ready' || status === 'submitting'" @submit.prevent="submitForm">
			<fieldset :disabled="status === 'submitting'" class="grid min-w-0 grid-cols-1 gap-4 border-0 p-0 font-normal md:grid-cols-2">
				<legend class="sr-only">{{ t('form.title') }}</legend>
				<component
					v-for="field in visibleFields"
					:key="field.key"
					:is="getFieldComponent(field.type)"
					v-model="values[field.key]"
					:form="values"
					:field="field"
					:error="errors[field.id] || ''"
					:requiredIndicator="definition?.requiredIndicator" />
				<p v-if="submitError" ref="errorSummary" role="alert" tabindex="-1" class="text-pretty md:col-span-2">
					{{ Object.keys(errors).length ? t('form.validation_error') : t('form.submit_error') }}
				</p>
				<div v-if="definition?.button" class="mt-4 flex md:col-span-2">
					<button
						type="submit"
						:class="[
							'min-h-11 cursor-pointer rounded bg-gray-950 px-6 py-3 text-white transition-colors',
							'hover:bg-gray-800 focus-visible:outline-2 focus-visible:outline-offset-2',
							'disabled:cursor-wait disabled:opacity-60 motion-reduce:transition-none'
						]"
						:disabled="status === 'submitting'">
						{{ status === 'submitting' ? t('form.sending') : definition.button.text || t('form.send') }}
					</button>
				</div>
			</fieldset>
		</form>
	</div>
</template>

<script setup lang="ts">
import { defineAsyncComponent, nextTick, onMounted, onBeforeUnmount, useTemplateRef } from 'vue'
import { useI18n } from 'vue-i18n'
import { usePage } from '@inertiajs/vue3'
import { useGravityForm } from '@/features/forms/useGravityForm'
import type { InertiaPageProps } from '@/inertia'
import type { Component } from 'vue'

const props = defineProps<{ id: number | string }>()
const { t, locale } = useI18n()
const page = usePage<InertiaPageProps>()
const root = useTemplateRef<HTMLElement>('root')
const confirmation = useTemplateRef<HTMLElement>('confirmation')
const errorSummary = useTemplateRef<HTMLElement>('errorSummary')
const { definition, values, errors, status, submitError, visibleFields, load, submit } = useGravityForm(
	() => props.id,
	() => page.props?.menu?.languages?.current || locale.value
)

const fieldComponents: Record<string, Component> = {
	consent: defineAsyncComponent(() => import('./Fields/Consent.vue')),
	date: defineAsyncComponent(() => import('./Fields/Date.vue')),
	fileupload: defineAsyncComponent(() => import('./Fields/File.vue')),
	html: defineAsyncComponent(() => import('./Fields/Html.vue')),
	input: defineAsyncComponent(() => import('./Fields/Input.vue')),
	multi_choice: defineAsyncComponent(() => import('./Fields/MultiChoice.vue')),
	phone: defineAsyncComponent(() => import('./Fields/Phone.vue')),
	radio: defineAsyncComponent(() => import('./Fields/Radio.vue')),
	select: defineAsyncComponent(() => import('./Fields/Select.vue')),
	textarea: defineAsyncComponent(() => import('./Fields/Textarea.vue'))
}
const getFieldComponent = (type: string) => fieldComponents[type === 'checkbox' ? 'multi_choice' : type] || fieldComponents.input
let observer: IntersectionObserver | undefined
onMounted(() => {
	if (!root.value || !('IntersectionObserver' in window)) {
		void load()
		return
	}
	observer = new IntersectionObserver(
		(entries) => {
			if (entries.some((entry) => entry.isIntersecting)) {
				observer?.disconnect()
				void load()
			}
		},
		{ rootMargin: '320px 0px' }
	)
	observer.observe(root.value)
})
onBeforeUnmount(() => observer?.disconnect())

async function submitForm() {
	const result = await submit()
	await nextTick()
	if (result) {
		confirmation.value?.focus()
		if (result.confirmation_redirect) {
			const url = new URL(result.confirmation_redirect, window.location.origin)
			if (['https:', 'http:'].includes(url.protocol)) window.location.assign(url.href)
		}
	} else if (submitError.value) {
		const invalid = root.value?.querySelector<HTMLElement>('[aria-invalid="true"]')
		;(invalid || errorSummary.value)?.focus()
	}
}
</script>
