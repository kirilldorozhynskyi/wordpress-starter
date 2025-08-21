import { defineConfig } from 'vite'
import laravel from 'laravel-vite-plugin'
import path from 'path'
import vue from '@vitejs/plugin-vue'
import mkcert from 'vite-plugin-mkcert'
import VitePluginSvgSpritemap from '@spiriit/vite-plugin-svg-spritemap'
import tailwindcss from '@tailwindcss/vite'
import favicons from '@peterek/vite-plugin-favicons'

// Config
import config from './config'

const { baseDir, SvgSpritemap } = config

export default defineConfig({
	esbuild: {
		drop: process.env.NODE_ENV === 'production' ? ['console', 'debugger'] : [],
	},
	base: process.env.NODE_ENV === 'production' ? `/${baseDir}Public/Build/` : '',
	build: {
		outDir: path.resolve(__dirname, `${baseDir}Public/Build`),
		manifest: true,
		rollupOptions: {
			input: {
				main: path.resolve(__dirname, `${baseDir}Private/Vue/app.ts`),
			},
			output: {
				manualChunks(id: string) {
					if (id.includes('node_modules')) {
						return id.toString().split('node_modules/')[1].split('/')[0].toString()
					}
				},
			},
		},
	},

	resolve: {
		alias: {
			'~fonts': `/${baseDir}Public/Fonts`,
			'@': path.resolve(__dirname, 'wp-content/themes/template/resources/Private/Vue/'),
		},
	},

	plugins: [
		tailwindcss(),
		laravel({
			publicDirectory: '.',
			input: ['Scss/app.css', 'Scss/**/*.scss', 'Vue/app.ts'],
			refresh: false,
		}),

		{
			name: 'wordpress',
			handleHotUpdate({ file, server }) {
				if (/\.(php|json|twig)$/.test(file)) {
					server.ws.send({
						type: 'full-reload',
						path: '*',
					})
				}
			},
		},

		mkcert(),

		vue({
			template: {
				transformAssetUrls: {
					base: null,
					includeAbsolute: false,
				},
			},
		}),

		VitePluginSvgSpritemap(path.resolve(__dirname, `${baseDir}/Icons/*.svg`), {
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
							attrs: '(fill|stroke)',
						},
					},
				],
			},
			injectSVGOnDev: SvgSpritemap.injectSVGOnDev,
		}),

		favicons(`${baseDir}Public/Favicons/favicon.svg`, {
			icons: {
				android: true,
				appleIcon: true,
				appleStartup: true,
				favicons: true,
				windows: false,
				yandex: false,
			},
		}),
	],
})
