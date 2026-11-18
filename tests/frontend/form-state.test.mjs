import { test } from 'node:test'
import assert from 'node:assert/strict'
import { resolve } from 'node:path'
import { createServer } from 'vite'
import { effectScope, nextTick, ref } from 'vue'

const source = resolve('wp-content/themes/inertia/resources/Private/js')
const definition = { fields: [{ id: 1, key: 'input_1', type: 'text', visibility: 'visible' }], button: { text: 'Send' } }

test('form request lifecycle', async (t) => {
	const server = await createServer({
		configFile: false,
		cacheDir: '/tmp/wordpress-starter-form-tests-vite',
		optimizeDeps: { noDiscovery: true, include: [] },
		server: { middlewareMode: true },
		resolve: {
			alias: [
				{ find: '@/util/primevue', replacement: `${source}/util/primevue-ssr.ts` },
				{ find: '@', replacement: source },
			],
		},
	})
	t.after(() => server.close())
	const { useGravityForm } = await server.ssrLoadModule(`${source}/features/forms/useGravityForm.ts`)

	await t.test('retries load errors and rejects HTTP 200 validation failures', async (t) => {
		const scope = effectScope()
		t.after(() => scope.stop())
		const form = scope.run(() =>
			useGravityForm(
				() => 1,
				() => 'en'
			)
		)
		t.mock.method(globalThis, 'fetch', async () => {
			throw new Error('offline')
		})
		await form.load()
		assert.equal(form.status.value, 'load-error')
		globalThis.fetch.mock.mockImplementation(async () => Response.json(definition))
		await form.load()
		assert.equal(form.status.value, 'ready')
		globalThis.fetch.mock.mockImplementation(async () => Response.json({ is_valid: false, validation_messages: { 1: 'Required' } }))
		assert.equal(await form.submit(), null)
		assert.equal(form.status.value, 'ready')
		assert.equal(form.errors.value[1], 'Required')
	})

	await t.test('duplicate submission shares one request; successful result transitions once', async (t) => {
		const scope = effectScope()
		t.after(() => scope.stop())
		const form = scope.run(() =>
			useGravityForm(
				() => 1,
				() => 'sk-sk'
			)
		)
		t.mock.method(globalThis, 'fetch', async () => Response.json(definition))
		await form.load()
		let finish
		globalThis.fetch.mock.mockImplementation(
			() =>
				new Promise((resolve) => {
					finish = resolve
				})
		)
		const first = form.submit()
		assert.equal(form.status.value, 'submitting')
		assert.equal(await form.submit(), null)
		assert.equal(globalThis.fetch.mock.callCount(), 2)
		for (const {
			arguments: [url],
		} of globalThis.fetch.mock.calls) {
			assert.equal(new URL(url, 'https://starter.test').searchParams.get('lang'), 'sk-sk')
		}
		finish(Response.json({ is_valid: true }))
		await first
		assert.equal(form.status.value, 'success')
	})

	await t.test('changing id ignores an old response, and disposal aborts the active request', async (t) => {
		const scope = effectScope()
		t.after(() => scope.stop())
		const id = ref(1)
		const form = scope.run(() =>
			useGravityForm(
				() => id.value,
				() => 'en'
			)
		)
		const requests = []
		t.mock.method(
			globalThis,
			'fetch',
			(url, options) =>
				new Promise((resolve) => {
					requests.push({ url, options, resolve })
				})
		)
		const old = form.load()
		id.value = 2
		await nextTick()
		assert.equal(requests[0].options.signal.aborted, true)
		assert.match(requests[1].url, /id=2/)
		requests[1].resolve(Response.json(definition))
		await new Promise((resolve) => setImmediate(resolve))
		requests[0].resolve(Response.json({ fields: [] }))
		await old
		assert.equal(form.definition.value.fields.length, 1)
		const pending = form.load()
		scope.stop()
		assert.equal(requests[2].options.signal.aborted, true)
		requests[2].resolve(Response.json(definition))
		await pending
		assert.equal(form.definition.value, null)
	})
})
