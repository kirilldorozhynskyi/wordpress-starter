import { computed, onScopeDispose, ref, watch } from 'vue'
import { fetchJson, HttpError } from '@/services/http'
import { ensurePrimeVue } from '@/util/primevue'
import { isFieldActive } from './conditions'
import { buildInitialFormState, normalizeFormData, serializeForm } from './serialization'
import type { FormDefinition, FormValues, SubmissionResult } from './types'

export function useGravityForm(id: () => number | string, language: () => string) {
	const definition = ref<FormDefinition | null>(null)
	const values = ref<FormValues>({})
	const errors = ref<Record<string, string>>({})
	const status = ref<'idle' | 'loading' | 'ready' | 'submitting' | 'success' | 'load-error'>('idle')
	const submitError = ref(false)
	let request: AbortController | undefined
	let revision = 0
	const visibleFields = computed(() =>
		(definition.value?.fields ?? []).filter(
			(field) => field.type !== 'hidden' && field.visibility !== 'hidden' && field.visibility !== 'administrative' && isFieldActive(field, values.value)
		)
	)

	async function load() {
		request?.abort()
		const current = ++revision
		const controller = (request = new AbortController())
		status.value = 'loading'
		definition.value = null
		values.value = {}
		errors.value = {}
		submitError.value = false
		try {
			const query = new URLSearchParams({ id: String(id()), lang: language() })
			const [data] = await Promise.all([
				fetchJson<FormDefinition>(`/wp-json/inertia/v1/get-form?${query}`, { signal: controller.signal }),
				ensurePrimeVue(),
			])
			if (current !== revision) return
			if (!Array.isArray(data.fields)) throw new Error('Invalid form definition')
			definition.value = normalizeFormData(data)
			values.value = buildInitialFormState(definition.value.fields)
			status.value = 'ready'
		} catch {
			if (current === revision && !controller.signal.aborted) status.value = 'load-error'
		}
	}

	async function submit(): Promise<SubmissionResult | null> {
		if (status.value !== 'ready' || !definition.value) return null
		const current = revision
		const controller = (request = new AbortController())
		status.value = 'submitting'
		errors.value = {}
		submitError.value = false
		try {
			const query = new URLSearchParams({ lang: language() })
			const data = await fetchJson<SubmissionResult>(`/wp-json/gf/v2/forms/${encodeURIComponent(id())}/submissions?${query}`, {
				method: 'POST',
				body: serializeForm(definition.value.fields, values.value),
				signal: controller.signal,
			})
			if (current !== revision) return null
			if (data.is_valid !== true) throw new HttpError(400, data)
			status.value = 'success'
			return data
		} catch (error) {
			if (current !== revision || controller.signal.aborted) return null
			const data = error instanceof HttpError ? (error.data as Partial<SubmissionResult> | null) : null
			errors.value = data?.validation_messages && typeof data.validation_messages === 'object' ? data.validation_messages : {}
			submitError.value = true
			status.value = 'ready'
			return null
		}
	}

	watch([id, language], () => {
		if (status.value !== 'idle') void load()
	})
	onScopeDispose(() => {
		revision++
		request?.abort()
	})
	return { definition, values, errors, status, submitError, visibleFields, load, submit }
}
