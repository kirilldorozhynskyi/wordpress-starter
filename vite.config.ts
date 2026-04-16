import path from 'node:path'
import { existsSync, mkdirSync, readdirSync } from 'node:fs'
import type { PluginOption } from 'vite'
import { defineConfig } from 'vite'
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

export default defineConfig(({ isSsrBuild, mode }) => {
	const plugins: PluginOption[] = [
		!isSsrBuild
			? {
					name: 'inertia-theme-full-reload',
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
		!isSsrBuild && hasSvgIcons ? VitePluginSvgSpritemap(config.paths.themeIconsGlob, config.svgSpritemap) : null,
		!isSsrBuild && hasFaviconsSource ? favicons(config.paths.themeFaviconSource, config.favicons) : null,
		wordpress({
			input: config.paths.themeEntry,
			ssr: config.paths.themeSsrEntry,
			namespace: config.wordpress.namespace,
			publicDirectory: config.wordpress.publicDirectory,
			buildDirectory: config.wordpress.buildDirectory,
			ssrOutputDirectory: config.wordpress.ssrOutputDirectory,
			hotFile: path.resolve(config.paths.projectRoot, 'hot'),
			splitVendor: false,
		}),
	]

	return {
		root: config.paths.themeRoot,
		base: !isSsrBuild && mode === 'production' ? config.base.production : '',
		build: !isSsrBuild
			? {
					rollupOptions: {
						output: {
							manualChunks: getVendorChunkName,
						},
					},
				}
			: undefined,
		esbuild: {
			target: config.esbuild.target,
			drop: mode === 'production' ? [...config.esbuild.drop] : [],
		},
		server: {
			cors: true,
			fs: {
				allow: [config.paths.projectRoot],
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
	}
})
