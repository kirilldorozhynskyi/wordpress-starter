import { defineConfig } from 'vite'
import { wordpress } from 'wordpress-vite-plugin'
import vue from '@vitejs/plugin-vue'
import path from 'path'
import mkcert from 'vite-plugin-mkcert'
import favicons from '@peterek/vite-plugin-favicons'
import VitePluginSvgSpritemap from '@spiriit/vite-plugin-svg-spritemap'

import tailwindcss from '@tailwindcss/vite'

// Config
import config from './config'
const { baseDir, SvgSpritemap } = config

export default defineConfig({
	esbuild: {
		drop: process.env.NODE_ENV === 'production' ? ['console', 'debugger'] : []
	},
	server: {
		cors: true
	},

	resolve: {
		alias: {
			'~fonts': `/${baseDir}Public/Fonts`,
			'@': path.resolve(__dirname, 'wp-content/themes/template/resources/Private/Vue/')
		},
		dedupe: ['@inertiajs/vue3', '@vueuse/core', 'vue']
	},
	plugins: [
		mkcert(),
		tailwindcss(),
		vue({
			template: {
				transformAssetUrls: {
					base: false,
					includeAbsolute: false
				}
			}
		}),
		wordpress({
			input: 'resources/js/main.js',
			ssr: 'resources/js/ssr.js',
			namespace: 'theme-inertia',
			splitVendor: true
		}),
		{
			name: 'wordpress',
			handleHotUpdate({ file, server }) {
				if (/\.(php|json|twig)$/.test(file)) {
					server.ws.send({
						type: 'full-reload',
						path: '*'
					})
				}
			}
		},

		VitePluginSvgSpritemap('resources/icons/*.svg', {
			prefix: SvgSpritemap.prefix,
			output: SvgSpritemap.output,
			svgo: {
				plugins: [
					{ name: 'removeStyleElement' },
					{ name: 'cleanupIds' },
					{ name: 'removeTitle' },
					{ name: 'removeViewBox' },
					{ name: 'removeUselessStrokeAndFill' },
					{
						name: 'removeAttrs',
						params: {
							attrs: '(fill|stroke)'
						}
					}
				]
			},
			injectSVGOnDev: SvgSpritemap.injectSVGOnDev
		}),

		favicons('resources/Public/Favicons/favicon.svg', {
			icons: {
				android: true,
				appleIcon: true,
				appleStartup: true,
				favicons: true,
				windows: false,
				yandex: false
			}
		})
	]
})
