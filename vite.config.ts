import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'
import laravel from 'laravel-vite-plugin'
import mkcert from 'vite-plugin-mkcert'
import sassGlobImports from 'vite-plugin-sass-glob-import'
import VitePluginSvgSpritemap from '@spiriit/vite-plugin-svg-spritemap'

// Config
import config from './config.js'

const theme = 'wp-content/themes/template/resources/'

const { rootDir, assetsDir, imagemin, htmlBeautify, fonts, SvgSpritemap } = config

export default defineConfig({
	base: process.env.NODE_ENV == 'production' ? `/${theme}Public/Build/` : '',
	build: {
		outDir: path.join(__dirname, `${theme}Public/Build`),
		manifest: true,
		rollupOptions: {
			input: {
				main: path.resolve(__dirname, `${theme}Private/Vue/app.ts`),
				// rte: path.resolve(__dirname, `${theme}Private/Scss/rte.scss`),
			},
		},
	},
	resolve: {
		alias: {
			'~bootstrap': path.resolve(__dirname, 'node_modules/bootstrap'),
			'~fonts': '/wp-content/themes/template/resources/Public/Fonts',
			vue: 'vue/dist/vue.esm-bundler.js',
		},
	},
	plugins: [
		laravel({
			publicDirectory: '.',
			input: ['Scss/style.scss', 'Scss/**/**/*.scss', 'Vue/app.ts'],
			refresh: true,
		}),
		{
			name: 'wordpress',
			handleHotUpdate({ file, server }) {
				if (file.endsWith('.php') || file.endsWith('.twig')) {
					server.hot.send({
						type: 'full-reload',
						path: '*',
					})
				}
			},
		},
		mkcert(),
		sassGlobImports(),
		vue(),
		VitePluginSvgSpritemap(path.resolve(process.cwd(), `${theme}/Icons/*.svg`), SvgSpritemap),
	],
})
