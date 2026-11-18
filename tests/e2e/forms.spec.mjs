import { expect, test } from '@playwright/test'
import { formDefinition } from '../frontend/fixtures/form-definition.mjs'

const fixture = '/tests/frontend/fixtures/forms.html?e2e'
const definitionRoute = '**/wp-json/inertia/v1/get-form?*'
const submissionRoute = (url) => url.pathname === '/wp-json/gf/v2/forms/1/submissions' && url.searchParams.get('lang') === 'en'

async function readSubmission(request) {
	return new Request(request.url(), {
		method: request.method(),
		headers: { 'content-type': request.headers()['content-type'] },
		body: request.postDataBuffer(),
	}).formData()
}

async function fillRequired(form, name = 'Test contact') {
	await form.getByRole('textbox', { name: 'Name', exact: true }).fill(name)
	await form.getByRole('textbox', { name: 'Email', exact: true }).fill('test@example.test')
	await form.getByRole('checkbox', { name: 'I agree' }).check()
}

test('retries a failed form load and focuses the invalid field before a successful retry', async ({ page }) => {
	let loadCount = 0
	const attempts = []
	await page.route(definitionRoute, async (route) => {
		const url = new URL(route.request().url())
		expect(url.searchParams.get('id')).toBe('1')
		expect(url.searchParams.get('lang')).toBe('en')
		loadCount++
		await route.fulfill(loadCount === 1 ? { status: 503, json: {} } : { json: formDefinition })
	})
	await page.route(submissionRoute, async (route) => {
		const body = await readSubmission(route.request())
		const name = body.get('input_1')
		attempts.push(name)
		const result = name === 'Invalid' ? { is_valid: false, validation_messages: { 1: 'Use a different test name' } } : { is_valid: true }
		await route.fulfill({ json: result })
	})

	await page.goto(fixture + '&single')
	await expect(page.getByRole('alert')).toContainText('The form could not be loaded.')
	await page.getByRole('button', { name: 'Try again' }).click()
	const form = page.locator('main form')
	await fillRequired(form, 'Invalid')
	await form.getByRole('button', { name: 'Send test' }).click()
	const name = form.getByRole('textbox', { name: 'Name', exact: true })
	await expect(name).toHaveAttribute('aria-invalid', 'true')
	await expect(name).toBeFocused()
	await expect(form.getByText('Use a different test name')).toBeVisible()

	await name.fill('Valid')
	await form.getByRole('button', { name: 'Send test' }).click()
	const confirmation = page.getByRole('status').filter({ hasText: 'Thank you for your interest.' })
	await expect(confirmation).toBeFocused()
	expect(loadCount).toBe(2)
	expect(attempts).toEqual(['Invalid', 'Valid'])
})

test('sends multipart data and omits values from hidden conditional fields', async ({ page }) => {
	const submissions = []
	await page.route(definitionRoute, (route) => route.fulfill({ json: formDefinition }))
	await page.route(submissionRoute, async (route) => {
		submissions.push(await readSubmission(route.request()))
		await route.fulfill({ json: { is_valid: true } })
	})

	await page.goto(fixture + '&single')
	const form = page.locator('main form')
	await fillRequired(form)
	const phone = form.getByRole('textbox', { name: 'Phone', exact: true })
	await expect(phone).toHaveCount(0)
	await form.getByRole('radio', { name: 'Phone' }).check()
	await phone.fill('+421900123456')
	await form.getByRole('radio', { name: 'Email' }).check()
	await expect(phone).toHaveCount(0)
	await form.getByLabel('Attachment').setInputFiles({ name: 'test.txt', mimeType: 'text/plain', buffer: Buffer.from('fixture attachment') })
	await form.getByRole('checkbox', { name: 'News' }).check()
	await form.getByRole('button', { name: 'Send test' }).click()
	await expect(page.getByRole('status').filter({ hasText: 'Thank you' })).toBeVisible()

	expect(submissions).toHaveLength(1)
	const [body] = submissions
	expect(body.get('input_1')).toBe('Test contact')
	expect(body.get('input_2')).toBe('test@example.test')
	expect(body.has('input_5')).toBe(false)
	expect(body.get('input_6.1')).toBe('1')
	expect(body.get('input_10.1')).toBe('news')
	const attachment = body.get('input_8')
	expect(attachment?.name).toBe('test.txt')
	expect(await attachment.text()).toBe('fixture attachment')
})

test('keeps two instances of the same form independent', async ({ page }) => {
	await page.route(definitionRoute, (route) => route.fulfill({ json: formDefinition }))
	await page.route(submissionRoute, (route) => route.fulfill({ json: { is_valid: true } }))
	await page.goto(fixture)

	const [first, second] = [page.locator('main > div').nth(0), page.locator('main > div').nth(1)]
	await fillRequired(first, 'First instance')
	const otherName = second.getByRole('textbox', { name: 'Name', exact: true })
	await expect(otherName).toHaveValue('')
	await otherName.fill('Second instance')
	await first.getByRole('button', { name: 'Send test' }).click()
	await expect(first.getByRole('status')).toContainText('Thank you')
	await expect(otherName).toHaveValue('Second instance')
	await expect(second.getByRole('button', { name: 'Send test' })).toBeEnabled()
})
