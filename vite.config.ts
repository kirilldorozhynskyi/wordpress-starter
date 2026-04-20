import { existsSync, mkdirSync, readdirSync } from 'node:fs'
import type { PluginOption, UserConfig } from 'vite'
import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import { wordpress } from 'wordpress-vite-plugin'
import mkcert from 'vite-plugin-mkcert'
import VitePluginSvgSpritemap from '@spiriit/vite-plugin-svg-spritemap'
import favicons from '@peterek/vite-plugin-favicons'
import tailwindcss from '@tailwindcss/vite'
import config from './config'

config.directoriesToEnsure.forEach((dir) => {
	if (!existsSync(dir)) {
		mkdirSync(dir, { recursive: true })
	}
})

const hasSvgIcons = existsSync(config.paths.themeIconsRoot) && readdirSync(config.paths.themeIconsRoot).some((file) => file.endsWith('.svg'))
const hasFaviconsSource = existsSync(config.paths.themeFaviconSource)

const sanitizeChunkName = (value: string) => value.replace(/^@/, '').replace(/[\\/]/g, '-')

const getNodeModulePackageName = (id: string) => {
	const normalizedId = id.replace(/\\/g, '/')
	const nodeModulesSegment = '/node_modules/'
	const nodeModulesIndex = normalizedId.lastIndexOf(nodeModulesSegment)

	if (nodeModulesIndex === -1) {
		return null
	}

	const packagePath = normalizedId.slice(nodeModulesIndex + nodeModulesSegment.length)
	const segments = packagePath.split('/')

	if (segments[0]?.startsWith('@') && segments[1]) {
		return `${segments[0]}/${segments[1]}`
	}

	return segments[0] ?? null
}

const getVendorChunkName = (id: string) => {
	const packageName = getNodeModulePackageName(id)

	if (!packageName) {
		return undefined
	}

	if (packageName === 'vue' || packageName.startsWith('@vue/')) {
		return 'vendor-vue'
	}

	if (packageName.startsWith('@inertiajs/')) {
		return 'vendor-inertia'
	}

	if (packageName === 'vue-i18n' || packageName === '@intlify/shared') {
		return 'vendor-i18n'
	}

	if (packageName === 'primevue' || packageName.startsWith('primevue/') || packageName.startsWith('@primevue/') || packageName.startsWith('@primeuix/')) {
		return 'vendor-primevue'
	}

	if (packageName === 'vanilla-lazyload' || packageName === 'vue-scrollto') {
		return 'vendor-utils'
	}

	return `vendor-${sanitizeChunkName(packageName)}`
}

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
	const build: UserConfig['build'] = {
		target: config.esbuild.target,
		...(!isSsrBuild
			? {
					rollupOptions: {
						output: {
							manualChunks: getVendorChunkName,
						},
					},
				}
			: {}),
	}
	const esbuild = {
		drop: mode === 'production' ? [...config.esbuild.drop] : [],
	} as unknown as UserConfig['esbuild']

	const plugins: PluginOption[] = [
		!isSsrBuild
			? {
					name: 'theme-inertia',
					handleHotUpdate({ file, server }) {
						if (/\.(php|json|twig)$/.test(file)) {
							server.ws.send({
								type: 'full-reload',
								path: '*',
							})
						}
					},
				}
			: null,
		!isSsrBuild ? tailwindcss() : null,
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
			namespace: config.wordpress.namespace,
			publicDirectory: config.wordpress.publicDirectory,
			buildDirectory: config.wordpress.buildDirectory,
			ssrOutputDirectory: config.wordpress.ssrOutputDirectory,
			hotFile: config.paths.hotFile,
			splitVendor: false,
		}),
		!isSsrBuild ? wordpressAppUrlPlugin(appUrl) : null,
	]

	return {
		root: config.paths.themeRoot,
		base: !isSsrBuild && mode === 'production' ? config.base.production : '',
		build,
		esbuild,
		server: {
			cors: true,
			host: 'localhost',
			port: 5173,
			strictPort: true,
			fs: {
				allow: [config.paths.projectRoot],
			},
			hmr: {
				host: 'localhost',
				clientPort: 5173,
				protocol: 'wss',
			},
		},
		ssr: isSsrBuild
			? {
					noExternal: ['@evo-mark/inertia-wordpress'],
				}
			: undefined,
		resolve: {
			alias: {
				'~fonts': config.paths.themeFontsRoot,
				'@': config.paths.themeJsRoot,
			},
			dedupe: ['@inertiajs/vue3', '@vueuse/core', 'vue'],
		},
		plugins: plugins.filter(Boolean),
	} satisfies UserConfig
})
