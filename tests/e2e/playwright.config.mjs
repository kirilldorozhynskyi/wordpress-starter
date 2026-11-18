import { defineConfig } from '@playwright/test'
import { fileURLToPath } from 'node:url'

const siteUrl = process.env.E2E_BASE_URL || 'https://wordpress-starter.ddev.site'
const fixturePort = process.env.FORMS_PREVIEW_PORT || '4174'
const fixtureUrl = `http://127.0.0.1:${fixturePort}`

export default defineConfig({
	testDir: '.',
	outputDir: './.results',
	forbidOnly: Boolean(process.env.CI),
	use: { browserName: 'chromium', trace: 'retain-on-failure' },
	projects: [
		{
			name: 'site',
			testMatch: 'site.spec.mjs',
			use: { baseURL: siteUrl, ignoreHTTPSErrors: new URL(siteUrl).hostname.endsWith('.ddev.site') },
		},
		{ name: 'forms', testMatch: 'forms.spec.mjs', use: { baseURL: fixtureUrl } },
		{ name: 'media', testMatch: 'media.spec.mjs', use: { baseURL: fixtureUrl } },
		{ name: 'motion', testMatch: 'motion.spec.mjs', use: { baseURL: fixtureUrl } },
	],
	webServer: {
		command: 'npm run preview:forms',
		cwd: fileURLToPath(new URL('../..', import.meta.url)),
		env: { FORMS_PREVIEW_PORT: fixturePort },
		url: `${fixtureUrl}/tests/frontend/fixtures/forms.html`,
	},
})
