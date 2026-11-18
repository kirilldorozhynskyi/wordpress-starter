import { expect, test } from '@playwright/test'

const searchPath = '/?s=starter-e2e-no-match'

test('serves the home page as SSR HTML with one canonical and one title', async ({ browser, baseURL }) => {
	const context = await browser.newContext({ baseURL, javaScriptEnabled: false, ignoreHTTPSErrors: new URL(baseURL).hostname.endsWith('.ddev.site') })
	try {
		const page = await context.newPage()
		const response = await page.goto('/')
		expect(response?.status()).toBe(200)
		if (new URL(page.url()).hostname.endsWith('.ddev.site')) {
			expect(response.headers()['x-robots-tag']).toMatch(/\bnoindex\b/)
		}
		await expect(page.locator('#app')).toHaveAttribute('data-server-rendered', 'true')
		await expect(page.locator('#app main')).toBeVisible()
		await expect(page.locator('html')).toHaveAttribute('lang', /\S+/)
		await expect(page.locator('head title')).toHaveCount(1)
		await expect(page).toHaveTitle(/\S+/)
		await expect(page.locator('link[rel=canonical]')).toHaveAttribute('href', page.url())
		expect(await page.locator('meta[name=description]').count()).toBeLessThanOrEqual(1)
		expect(await page.locator('meta[property="og:title"]').count()).toBeLessThanOrEqual(1)
		const schemas = await page.locator('script[type="application/ld+json"]').allTextContents()
		expect(schemas.length).toBeLessThanOrEqual(1)
		for (const schema of schemas) expect(JSON.parse(schema)['@context']).toBeTruthy()
	} finally {
		await context.close()
	}
})

test('hydrates and updates SEO on an Inertia visit and browser back', async ({ page }) => {
	const errors = []
	page.on('pageerror', (error) => errors.push(error.message))
	page.on('console', (message) => {
		if (['warning', 'error'].includes(message.type()) && /hydrat/i.test(message.text())) errors.push(message.text())
	})
	page.on('response', (response) => {
		if (response.status() >= 400 && ['script', 'stylesheet'].includes(response.request().resourceType())) errors.push(response.url())
	})

	const searchResponse = await page.goto(searchPath)
	expect(searchResponse?.status()).toBe(200)
	const searchTitle = await page.title()
	expect(searchTitle).not.toBe('')
	await expect(page.locator('link[rel=canonical]')).toHaveCount(0)
	const logoLink = page.locator('header a[href]').first()
	const homeUrl = new URL(await logoLink.getAttribute('href'), page.url()).href
	const [response] = await Promise.all([
		page.waitForResponse((candidate) => candidate.url() === homeUrl && candidate.request().headers()['x-inertia'] === 'true'),
		logoLink.click(),
	])
	expect(response.ok()).toBe(true)
	expect((await response.json()).props.seoHead).toEqual(expect.arrayContaining([expect.stringContaining('<title')]))
	await expect(page).toHaveURL(homeUrl)
	await expect(page).not.toHaveTitle(searchTitle)
	await expect(page.locator('head title')).toHaveCount(1)
	await expect(page.locator('link[rel=canonical]')).toHaveAttribute('href', homeUrl)

	await page.goBack()
	await expect(page).toHaveTitle(searchTitle)
	await expect(page.locator('link[rel=canonical]')).toHaveCount(0)
	expect(errors).toEqual([])
})

test('renders distinct search and not-found responses and serves the public form API', async ({ request }) => {
	const search = await request.get(searchPath)
	const searchHtml = await search.text()
	expect(search.status()).toBe(200)
	expect(searchHtml).toContain('data-server-rendered="true"')
	const searchData = JSON.parse(searchHtml.match(/<script[^>]+data-page="app"[^>]*>([\s\S]*?)<\/script>/)?.[1] || 'null')
	expect(searchData?.component).toBe('Archive')
	expect(searchData?.props.archive.items).toEqual([])

	const missing = await request.get('/starter-e2e-page-not-found/')
	expect(missing.status()).toBe(404)
	expect(await missing.text()).toContain('Error: 404')

	const rest = await request.get('/wp-json/')
	expect(rest.ok()).toBe(true)
	expect((await rest.json()).namespaces).toEqual(expect.arrayContaining(['inertia/v1', 'gf/v2']))
	const invalidForm = await request.get('/wp-json/inertia/v1/get-form?id=-1')
	expect(invalidForm.status()).toBe(400)
	expect((await invalidForm.json()).code).toBe('gravity_form_invalid_id')
})
