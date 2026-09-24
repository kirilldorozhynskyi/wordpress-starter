import { createServer } from 'vite'
import vue from '@vitejs/plugin-vue'
import tailwind from '@tailwindcss/vite'
import { resolve } from 'node:path'
const server = await createServer({
	configFile: false,
	cacheDir: '/tmp/wordpress-starter-form-preview-vite',
	plugins: [vue(), tailwind()],
	resolve: {
		alias: { '@': resolve('wp-content/themes/inertia/resources/Private/js'), '~fonts': resolve('wp-content/themes/inertia/resources/Public/Fonts') },
	},
	server: { host: '127.0.0.1', port: 5174, strictPort: true },
})
await server.listen()
console.log('Form fixture: http://127.0.0.1:5174/tests/frontend/fixtures/forms.html')
