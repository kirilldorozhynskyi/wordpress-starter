import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'
import laravel from 'laravel-vite-plugin'
import mkcert from 'vite-plugin-mkcert'
import sassGlobImports from 'vite-plugin-sass-glob-import'
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons'

const theme = 'wp-content/themes/template/resources/'

export default defineConfig({
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
		createSvgIconsPlugin({
			iconDirs: [path.resolve(process.cwd(), `${theme}Icons`)],
			symbolId: 'icon-[dir]-[name]',
			customDomId: '__svg__icons__dom__',
		}),
	],
})
