import { expect, test } from '@playwright/test'

const animatedPath = '/tests/frontend/fixtures/motion'
const staticPath = animatedPath + '/static'
const scrollTriggerCount = (page) => page.evaluate(() => window.countScrollTriggers())

async function visit(page, name, path) {
	const [response] = await Promise.all([
		page.waitForResponse((candidate) => new URL(candidate.url()).pathname === path && candidate.request().headers()['x-inertia'] === 'true'),
		page.getByRole('link', { name }).click(),
	])
	expect(response.ok()).toBe(true)
	await expect(page).toHaveURL(new RegExp(path + '$'))
}

test('loads GSAP on first use and cleans up ScrollTrigger on Inertia navigation', async ({ page }) => {
	const gsapRequests = []
	page.on('request', (request) => {
		if (/\bgsap(?:[._/]|$)/i.test(new URL(request.url()).pathname)) gsapRequests.push(request.url())
	})

	await page.goto(staticPath)
	await expect(page.getByRole('heading', { name: 'Static page' })).toBeVisible()
	expect(gsapRequests).toEqual([])

	await visit(page, 'With motion', animatedPath)
	await expect(page.getByRole('heading')).toHaveAttribute('aria-label', 'Accessible heading')
	expect(gsapRequests.length).toBeGreaterThan(0)
	await expect.poll(() => scrollTriggerCount(page)).toBeGreaterThan(0)
	await expect(page.locator('#fade')).toHaveClass(/jd-init/)
	await page.locator('#fade').scrollIntoViewIfNeeded()
	await expect(page.locator('#fade')).not.toHaveClass(/jd-init/)

	await visit(page, 'Without motion', staticPath)
	await expect.poll(() => scrollTriggerCount(page)).toBe(0)

	await visit(page, 'With motion', animatedPath)
	await expect.poll(() => scrollTriggerCount(page)).toBeGreaterThan(0)
})

test('hydrates server-rendered text and preserves preformatted content', async ({ page, request }) => {
	const response = await request.get(animatedPath)
	expect(response.ok()).toBe(true)
	expect(await response.text()).toMatch(/<h1[^>]+data-reveal-initial[^>]*>Accessible heading<\/h1>/)
	const errors = []
	page.on('pageerror', (error) => errors.push(error.message))
	page.on('console', (message) => {
		if (['warning', 'error'].includes(message.type()) && /hydrat/i.test(message.text())) errors.push(message.text())
	})

	await page.goto(animatedPath)
	await expect(page.getByRole('heading')).toHaveAttribute('aria-label', 'Accessible heading')
	await expect(page.getByRole('heading')).not.toHaveAttribute('data-reveal-initial')
	await expect(page.locator('pre')).not.toHaveAttribute('data-reveal-initial')
	expect(await page.locator('pre').textContent()).toBe('  existing indentation')
	await expect(page.locator('pre span')).toHaveCount(0)
	expect(errors).toEqual([])
})

test('a pending directive import cannot create a ScrollTrigger after navigation', async ({ page }) => {
	const maskModule = '**/directives/maskReveal.js*'
	let releaseImport
	const gate = new Promise((resolve) => {
		releaseImport = resolve
	})
	await page.route(maskModule, async (route) => {
		await gate
		await route.continue()
	})

	try {
		await page.goto(staticPath)
		const importRequest = page.waitForRequest(maskModule)
		await visit(page, 'With motion', animatedPath)
		const url = (await importRequest).url()
		await visit(page, 'Without motion', staticPath)

		releaseImport()
		await page.evaluate(async (moduleUrl) => {
			await import(moduleUrl)
		}, url)
		expect(await scrollTriggerCount(page)).toBe(0)
	} finally {
		releaseImport()
	}
})

test('keeps content visible with reduced motion or JavaScript disabled', async ({ browser, page, baseURL }) => {
	await page.emulateMedia({ reducedMotion: 'reduce' })
	await page.goto(animatedPath)
	await expect(page.getByRole('heading', { name: 'Accessible heading' })).toBeVisible()
	await expect(page.locator('[data-reveal-initial]')).toHaveCount(0)
	await expect(page.locator('h1 span, .jd-init')).toHaveCount(0)
	expect(await scrollTriggerCount(page)).toBe(0)

	const noJs = await browser.newContext({ baseURL, javaScriptEnabled: false })
	try {
		const serverPage = await noJs.newPage()
		await serverPage.goto(animatedPath)
		await expect(serverPage.getByRole('heading', { name: 'Accessible heading' })).toBeVisible()
	} finally {
		await noJs.close()
	}
})
