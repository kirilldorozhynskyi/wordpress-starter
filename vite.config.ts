import { defineConfig } from 'vite'
import { resolve } from 'path'
import laravel from 'laravel-vite-plugin'
import path from 'path'

import vue from '@vitejs/plugin-vue'
import mkcert from 'vite-plugin-mkcert'

import config from './config.ts'

const { baseDir } = config

export default defineConfig({
	base: process.env.NODE_ENV == 'production' ? `/${baseDir}Public/Build/` : '',
	build: {
		outDir: path.join(__dirname, `${baseDir}Public/Build`),
		manifest: true,
		rollupOptions: {
			input: {
				main: path.resolve(__dirname, `${baseDir}Private/Vue/app.ts`),
			},
			// output: {
			// 	manualChunks(id) {
			// 		if (id.includes('node_modules')) {
			// 			return id.toString().split('node_modules/')[1].split('/')[0].toString()
			// 		}
			// 	},
			// },
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
})
