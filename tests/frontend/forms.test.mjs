import { test } from 'node:test'
import assert from 'node:assert/strict'
import { normalizeFormData, buildInitialFormState, serializeForm } from '../../wp-content/themes/inertia/resources/Private/js/features/forms/serialization.ts'
import { isFieldActive } from '../../wp-content/themes/inertia/resources/Private/js/features/forms/conditions.ts'
import { fetchJson, HttpError } from '../../wp-content/themes/inertia/resources/Private/js/services/http.ts'

const field = (id, type, extra = {}) => ({ id, key: `input_${id}`, type, ...extra })

test('consent uses GF sub-inputs and never submits string zero as consent', () => {
	const consent = field(7, 'consent', { inputs: [{ id: '7.1' }, { id: '7.2' }, { id: '7.3' }], checkboxLabel: 'Agree', consentRevisionId: 12 })
	const { fields } = normalizeFormData({ fields: [consent] })
	assert.equal(fields[0].key, 'input_7.1')
	assert.deepEqual(Object.fromEntries(serializeForm(fields, { 'input_7.1': 1 })), { 'input_7.1': '1', 'input_7.2': 'Agree', 'input_7.3': '12' })
	assert.equal([...serializeForm(fields, { 'input_7.1': '0' })].length, 0)
})

test('checkbox payload follows actual GF sub-input ids, including skipped .10', () => {
	const checkbox = field(2, 'checkbox', {
		inputs: [
			{ id: '2.9', key: 'a' },
			{ id: '2.11', key: 'b' },
		],
		choices: [
			{ key: 'b', text: 'B', value: 'b' },
			{ key: 'a', text: 'A', value: 'a', isSelected: true },
		],
	})
	assert.deepEqual(buildInitialFormState([checkbox]), { input_2: ['a'] })
	assert.deepEqual(Object.fromEntries(serializeForm([checkbox], { input_2: ['b'] })), { 'input_2.11': 'b' })
})

test('conditional fields use consistent string/array comparison and omit stale values', () => {
	const conditional = field(3, 'text', { conditionalLogic: { actionType: 'show', logicType: 'all', rules: [{ fieldId: 1, operator: 'is', value: '2' }] } })
	assert.equal(isFieldActive(conditional, { input_1: 2 }), true)
	assert.equal(isFieldActive(conditional, { input_1: ['2'] }), true)
	assert.equal(isFieldActive(conditional, { input_1: 0 }), false)
	assert.deepEqual(Object.fromEntries(serializeForm([conditional], { input_1: 0, input_3: 'stale' })), {})
})

test('serialization preserves zero, hidden defaults, File content and date format', async () => {
	const fields = [field(1, 'number'), field(2, 'hidden', { defaultValue: 'campaign' }), field(3, 'date', { dateFormat: 'dmy_dot' }), field(4, 'fileupload')]
	const values = { ...buildInitialFormState(fields), input_1: 0, input_3: '2026-09-23', input_4: new File(['proof'], 'proof.txt') }
	const body = serializeForm(fields, values)
	assert.equal(body.get('input_1'), '0')
	assert.equal(body.get('input_2'), 'campaign')
	assert.equal(body.get('input_3'), '23.09.2026')
	assert.equal(await body.get('input_4').text(), 'proof')
	assert.equal(body.has('input_13'), false)
})

test('malformed and failed HTTP responses cannot become successful submissions', async (t) => {
	t.mock.method(globalThis, 'fetch', async () => new Response('<html>Error</html>', { status: 200 }))
	await assert.rejects(fetchJson('/test'), HttpError)
	globalThis.fetch.mock.mockImplementation(async () => Response.json({ validation_messages: { 1: 'Required' } }, { status: 400 }))
	await assert.rejects(fetchJson('/test'), (error) => error.status === 400 && error.data.validation_messages[1] === 'Required')
})

test('navigation classification is deterministic without window and keeps protocols native', async () => {
	const { checkLink } = await import('../../wp-content/themes/inertia/resources/Private/js/util/JDplugins.ts')
	const site = 'https://example.com'
	assert.equal(checkLink({ url: 'https://example.com/about' }, site), true)
	assert.equal(checkLink({ url: '//other.example/about' }, site), false)
	assert.equal(checkLink({ url: 'mailto:test@example.com' }, site), false)
	assert.equal(checkLink({ url: '/about', target: '_blank' }, site), false)
	assert.equal(checkLink({ url: '#contact' }, site), false)
})
