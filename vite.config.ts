import { defineConfig } from 'vite'
import { resolve } from 'path'
import laravel from 'laravel-vite-plugin'
import vue from '@vitejs/plugin-vue'
import mkcert from 'vite-plugin-mkcert'

const projectRootDir = resolve(__dirname)

import config from './config.ts'

const { baseDir } = config

export default defineConfig({
	plugins: [
		laravel({
			publicDirectory: '.',
			input: ['resources/Private/Scss/app.scss', 'resources/Private/Vue/app.ts'],
			refresh: true,
		}),
		{
			name: 'wordpress',
			handleHotUpdate({ file, server }) {
				if (file.endsWith('.php') || file.endsWith('.json')) {
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
	],
	resolve: {
		alias: {
			js: resolve(baseDir, 'Private/Vue'),
			scss: resolve(baseDir, 'Private/scss'),
		},
	},
})
