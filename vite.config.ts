import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'
import laravel from 'laravel-vite-plugin'
import mkcert from 'vite-plugin-mkcert'
import sassGlobImports from 'vite-plugin-sass-glob-import'
import VitePluginSvgSpritemap from '@spiriit/vite-plugin-svg-spritemap'
import { faviconsPlugin } from '@darkobits/vite-plugin-favicons'

// Config
import config from './config.ts'

const { baseDir, SvgSpritemap } = config

export default defineConfig({
	esbuild: {
		drop: ['console', 'debugger'],
	},
	base: process.env.NODE_ENV == 'production' ? `/${baseDir}Public/Build/` : '',
	build: {
		outDir: path.join(__dirname, `${baseDir}Public/Build`),
		manifest: true,
		rollupOptions: {
			input: {
				main: path.resolve(__dirname, `${baseDir}Private/Vue/app.ts`),
			},
			output: {
				manualChunks(id) {
					if (id.includes('node_modules')) {
						return id.toString().split('node_modules/')[1].split('/')[0].toString()
					}
				},
			},
		},
	},
	resolve: {
		alias: {
			'~bootstrap': path.resolve(__dirname, 'node_modules/bootstrap'),
			'~fonts': `/${baseDir}Public/Fonts`,
			vue: 'vue/dist/vue.esm-bundler.js',
		},
	},
	plugins: [
		laravel({
			publicDirectory: '.',
			input: ['Scss/app.scss', 'Scss/**/**/*.scss', 'Vue/app.ts'],
			refresh: false,
		}),
		{
			name: 'wordpress',
			handleHotUpdate({ file, server }) {
				if (file.endsWith('.php') || file.endsWith('.twig')) {
					server.ws.send({
						type: 'full-reload',
						path: '*',
					})
				}
			},
		},
		mkcert(),
		sassGlobImports(),
		vue(),
		VitePluginSvgSpritemap(path.resolve(__dirname, `${baseDir}/Icons/*.svg`), SvgSpritemap),
		faviconsPlugin({
			inject: false,
			cache: true,
			icons: {
				favicons: {
					source: `${baseDir}/Public/Favicons/favicon.svg`,
				},
				android: {
					source: `${baseDir}/Public/Favicons/favicon.svg`,
				},
				appleIcon: {
					source: `${baseDir}/Public/Favicons/favicon.svg`,
				},
			},
		}),
	],
})
