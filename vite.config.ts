import { defineConfig } from 'vite'
import laravel from 'laravel-vite-plugin'
import path from 'path'
import vue from '@vitejs/plugin-vue'
import mkcert from 'vite-plugin-mkcert'
import sassGlobImports from 'vite-plugin-sass-glob-import'
import VitePluginSvgSpritemap from '@spiriit/vite-plugin-svg-spritemap'
// import { faviconsPlugin } from '@darkobits/vite-plugin-favicons'

import tailwindcss from '@tailwindcss/vite'

// Config
import config from './config.ts'

const { baseDir, SvgSpritemap } = config

export default defineConfig({
	esbuild: {
		drop: process.env.NODE_ENV == 'production' ? ['console', 'debugger'] : [],
	},
	base: process.env.NODE_ENV === 'production' ? `/${baseDir}Public/Build/` : '',
	build: {
		outDir: path.join(__dirname, `${baseDir}Public/Build`),
		manifest: true,
		rollupOptions: {
			input: {
				main: path.resolve(__dirname, `${baseDir}Private/Vue/app.ts`),
			},
			// output: {
			// 	manualChunks(id: string) {
			// 		if (id.includes('node_modules')) {
			// 			return id.toString().split('node_modules/')[1].split('/')[0].toString()
			// 		}
			// 	},
			// },
		},
	},

	resolve: {
		alias: {
			'~font': path.resolve(__dirname, 'resources/assets/fonts'),
			'@': path.resolve(__dirname, `wp-content/themes/template/resources/Private/Vue/`),
		},
	},
	plugins: [
		tailwindcss(),
		laravel({
			publicDirectory: '.',
			input: ['Scss/app.css', 'Scss/**/**/*.scss', 'Vue/app.ts'],
			refresh: false,
		}),
		{
			name: 'wordpress',
			handleHotUpdate({ file, server }) {
				if (file.endsWith('.php') || file.endsWith('.json') || file.endsWith('.twig')) {
					server.ws.send({
						type: 'full-reload',
						path: '*',
					})
				}
			},
		},
		mkcert(),
		sassGlobImports(),
		vue({
			template: {
				transformAssetUrls: {
					base: null,
					includeAbsolute: false,
				},
			},
		}),
		VitePluginSvgSpritemap(path.resolve(__dirname, `${baseDir}/Icons/*.svg`), {
			...SvgSpritemap,
			svgo: {
				plugins: [
					// Add your SVGO plugins here
				],
			},
		}),
		// faviconsPlugin({
		// 	inject: false,
		// 	cache: true,
		// 	icons: {
		// 		favicons: {
		// 			source: `${baseDir}/Public/Favicons/favicon.svg`,
		// 		},
		// 		android: {
		// 			source: `${baseDir}/Public/Favicons/favicon.svg`,
		// 		},
		// 		appleIcon: {
		// 			source: `${baseDir}/Public/Favicons/favicon.svg`,
		// 		},
		// 	},
		// }),
	],
})
