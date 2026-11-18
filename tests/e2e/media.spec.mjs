import { expect, test } from '@playwright/test'

test('uses browser lazy loading without importing the media loader on image-only pages', async ({ page }) => {
	const loaderRequests = []
	page.on('request', (request) => {
		if (request.url().includes('vanilla-lazyload')) loaderRequests.push(request.url())
	})
	await page.route('**/lazy-media-fixture/*.svg', (route) =>
		route.fulfill({ contentType: 'image/svg+xml', body: '<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" />' })
	)

	await page.goto('/tests/frontend/fixtures/lazy-media.html?images-only')
	const image = page.locator('#native-lazy img')
	await expect(image).toHaveAttribute('loading', 'lazy')
	await expect(image).toHaveAttribute('sizes', '270px')
	await image.scrollIntoViewIfNeeded()
	await expect.poll(() => image.evaluate((element) => (element.complete ? element.currentSrc : ''))).toMatch(/native-300\.svg$/)
	expect(loaderRequests).toEqual([])
})

test('loads the Hero image immediately and defers backgrounds, posters and videos until visible', async ({ page }) => {
	const requests = new Set()
	await page.route('**/lazy-media-fixture/*', async (route) => {
		const filename = new URL(route.request().url()).pathname.split('/').pop()
		requests.add(filename)
		await route.fulfill(
			filename.endsWith('.svg')
				? { contentType: 'image/svg+xml', body: '<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" />' }
				: { contentType: 'video/mp4', body: '' }
		)
	})

	await page.goto('/tests/frontend/fixtures/lazy-media.html')
	const hero = page.locator('main picture img')
	await expect(hero).toHaveAttribute('loading', 'eager')
	await expect(hero).toHaveAttribute('fetchpriority', 'high')
	await expect.poll(() => requests.has('hero.svg')).toBe(true)
	await expect(page.locator('#background')).not.toBeInViewport()
	expect([...requests]).toEqual(['hero.svg'])
	await expect(page.locator('#video')).not.toHaveAttribute('src')
	await expect(page.locator('#video')).not.toHaveAttribute('poster')

	await page.locator('#background').scrollIntoViewIfNeeded()
	await page.locator('#video').scrollIntoViewIfNeeded()
	await expect.poll(() => [...requests]).toEqual(expect.arrayContaining(['background.svg', 'poster.svg', 'video.mp4']))
	await expect(page.locator('#background')).toHaveClass(/\blazy-loaded\b/)

	await page.getByRole('button', { name: 'Add video' }).click()
	await expect(page.locator('#next')).not.toBeInViewport()
	expect(requests.has('next.mp4')).toBe(false)
	await page.locator('#next').scrollIntoViewIfNeeded()
	await expect.poll(() => requests.has('next.mp4')).toBe(true)
})
