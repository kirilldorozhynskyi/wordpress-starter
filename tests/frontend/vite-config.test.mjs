import assert from 'node:assert/strict'
import { existsSync, mkdtempSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import path from 'node:path'
import { test } from 'node:test'
import { fileURLToPath } from 'node:url'
import { resolveConfig } from 'vite'

const configFile = fileURLToPath(new URL('../../vite.config.ts', import.meta.url))
const themeRoot = path.join(path.dirname(configFile), 'wp-content/themes/inertia')

test('Vite keeps client and SSR output inside the theme regardless of the working directory', async () => {
	const originalCwd = process.cwd()
	const cwd = mkdtempSync(path.join(tmpdir(), 'starter-vite-'))
	process.chdir(cwd)

	try {
		const client = await resolveConfig({ configFile }, 'build', 'production')
		const ssr = await resolveConfig({ configFile, build: { ssr: true } }, 'build', 'production')

		assert.equal(existsSync(path.join(cwd, 'resources')), false)
		assert.equal(path.resolve(client.root, client.build.outDir), path.join(themeRoot, 'resources/Public/Build'))
		assert.equal(path.resolve(ssr.root, ssr.build.outDir), path.join(themeRoot, 'resources/Private/.vite/ssr'))
	} finally {
		process.chdir(originalCwd)
		rmSync(cwd, { recursive: true })
	}
})

test('Vite processes Tailwind and minifies JavaScript in the SSR build configuration', async () => {
	const ssr = await resolveConfig({ configFile, build: { ssr: true } }, 'build', 'production')

	assert.ok(ssr.plugins.some((plugin) => plugin.name === '@tailwindcss/vite:generate:build'))
	assert.equal(ssr.environments.ssr.build.minify, 'oxc')
})
