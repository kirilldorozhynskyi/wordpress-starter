import { existsSync, mkdirSync, readdirSync } from 'node:fs'
import path from 'node:path'
import type { PluginOption, UserConfig } from 'vite'
import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import { wordpress } from 'wordpress-vite-plugin'
import mkcert from 'vite-plugin-mkcert'
import VitePluginSvgSpritemap from '@spiriit/vite-plugin-svg-spritemap'
import favicons from '@peterek/vite-plugin-favicons'
import tailwindcss from '@tailwindcss/vite'
import config from './config.ts'

config.directoriesToEnsure.forEach((dir) => {
	if (!existsSync(dir)) {
		mkdirSync(dir, { recursive: true })
	}
})

const hasSvgIcons = existsSync(config.paths.themeIconsRoot) && readdirSync(config.paths.themeIconsRoot).some((file) => file.endsWith('.svg'))
const hasFaviconsSource = existsSync(config.paths.themeFaviconSource)

const color = {
	blue: (value: string) => `\x1b[36m${value}\x1b[0m`,
	green: (value: string) => `\x1b[32m${value}\x1b[0m`,
}

const wordpressAppUrlPlugin = (appUrl: string): PluginOption => ({
	name: 'wordpress-app-url',
	apply: 'serve',
	configureServer(server) {
		server.httpServer?.once('listening', () => {
			setTimeout(() => {
				server.config.logger.info(`  ${color.green('➜')}  APP_URL: ${color.blue(appUrl || 'not set')}\n`)
			}, 1000)
		})
	},
})

export default defineConfig(({ isSsrBuild, mode }) => {
	const env = loadEnv(mode, config.paths.projectRoot, '')
	const appUrl = env.APP_URL || env.WP_HOME || env.ENV_DEVELOPMENT || ''
	const plugins: PluginOption[] = [
		tailwindcss(),
		!isSsrBuild ? mkcert() : null,
		vue({
			template: {
				transformAssetUrls: {
					base: null,
					includeAbsolute: false,
				},
			},
		}),
		!isSsrBuild && hasSvgIcons
			? VitePluginSvgSpritemap(config.paths.themeIconsGlob, config.svgSpritemap as unknown as Parameters<typeof VitePluginSvgSpritemap>[1])
			: null,
		!isSsrBuild && hasFaviconsSource ? favicons(config.paths.themeFaviconSource, config.favicons) : null,
		wordpress({
			input: config.paths.themeEntry,
			ssr: config.paths.themeSsrEntry,
			ssrExternal: !isSsrBuild,
			namespace: config.wordpress.namespace,
			// The plugin creates this directory relative to the process, before Vite resolves its root.
			publicDirectory: path.relative(process.cwd(), config.paths.themePublicRoot) || '.',
			hotFile: config.paths.hotFile,
			splitVendor: false,
			refresh: { paths: ['**/*.php', '**/*.twig', 'acf-json/*.json'], config: { root: config.paths.themeRoot } },
		}),
		!isSsrBuild ? wordpressAppUrlPlugin(appUrl) : null,
	]

	return {
		root: config.paths.themeRoot,
		base: !isSsrBuild && mode === 'production' ? config.base.production : '',
		envDir: config.paths.projectRoot,
		build: {
			target: config.buildTarget,
			outDir: isSsrBuild ? config.paths.themeSsrRoot : config.paths.themeBuildRoot,
			minify: 'oxc',
		},
		server: {
			cors: {
				origin: [/^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/, ...(appUrl ? [new URL(appUrl).origin] : [])],
			},
			host: 'localhost',
			port: 5173,
			fs: {
				allow: [config.paths.themeRoot],
			},
		},
		resolve: {
			alias: [
				...(isSsrBuild ? [{ find: '@/util/primevue', replacement: path.join(config.paths.themeJsRoot, 'util/primevue-ssr.ts') }] : []),
				{ find: '~fonts', replacement: config.paths.themeFontsRoot },
				{ find: '@', replacement: config.paths.themeJsRoot },
			],
			dedupe: ['@inertiajs/vue3', '@vueuse/core', 'vue'],
		},
		plugins: plugins.filter(Boolean),
	} satisfies UserConfig
})
