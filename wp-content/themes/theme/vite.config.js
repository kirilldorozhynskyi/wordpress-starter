import { defineConfig } from 'vite'
import { resolve } from 'path'
import laravel from 'laravel-vite-plugin'
import vue from '@vitejs/plugin-vue'
import mkcert from 'vite-plugin-mkcert'

const projectRootDir = resolve(__dirname)

export default defineConfig({
	plugins: [
		laravel({
			publicDirectory: '.',
			input: ['resources/Private/Scss/app.scss', 'resources/Private/Vue/app.js'],
			refresh: true
		}),
		{
			name: 'wordpress',
			handleHotUpdate({ file, server }) {
				if (file.endsWith('.php') || file.endsWith('.json')) {
					server.ws.send({
						type: 'full-reload',
						path: '*'
					})
				}
			}
		},
		mkcert(),
		vue({
			template: {
				transformAssetUrls: {
					base: null,
					includeAbsolute: false
				}
			}
		})
	],
	resolve: {
		alias: {
			js: resolve(projectRootDir, 'resources/Private/Vue'),
			scss: resolve(projectRootDir, 'resources/Private/scss')
		}
	}
})
