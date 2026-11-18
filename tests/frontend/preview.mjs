import { createServer } from 'vite'
import vue from '@vitejs/plugin-vue'
import tailwind from '@tailwindcss/vite'
import { resolve } from 'node:path'

const port = Number(process.env.FORMS_PREVIEW_PORT || 5174)
const motionPath = '/tests/frontend/fixtures/motion'
const motionFixture = {
	name: 'motion-fixture',
	configureServer(server) {
		server.middlewares.use(async (request, response, next) => {
			const { pathname } = new URL(request.url, 'http://localhost')
			if (pathname !== motionPath && pathname !== motionPath + '/static') return next()

			const page = {
				component: 'Motion',
				props: { animated: pathname === motionPath, errors: {} },
				url: pathname,
				version: 'motion-fixture',
			}
			response.setHeader('Vary', 'X-Inertia')
			if (request.headers['x-inertia'] === 'true') {
				response.setHeader('X-Inertia', 'true')
				response.setHeader('Content-Type', 'application/json')
				return response.end(JSON.stringify(page))
			}

			try {
				const { renderMotion } = await server.ssrLoadModule(motionPath + '.ts')
				const { body } = await renderMotion(page)
				const html = await server.transformIndexHtml(
					pathname,
					`<!doctype html><html lang="en"><head><link rel="stylesheet" href="/wp-content/themes/inertia/resources/Private/css/animations.css"></head>
					<body>${body}<script type="module" src="${motionPath}.ts"></script></body></html>`
				)
				response.setHeader('Content-Type', 'text/html; charset=utf-8')
				response.end(html)
			} catch (error) {
				next(error)
			}
		})
	},
}
const server = await createServer({
	configFile: false,
	cacheDir: resolve('node_modules/.cache/wordpress-starter-form-preview'),
	plugins: [vue(), tailwind(), motionFixture],
	resolve: {
		alias: { '@': resolve('wp-content/themes/inertia/resources/Private/js'), '~fonts': resolve('wp-content/themes/inertia/resources/Public/Fonts') },
	},
	server: { host: '127.0.0.1', port, strictPort: true },
})
await server.listen()
console.log(`Form fixture: http://127.0.0.1:${port}/tests/frontend/fixtures/forms.html`)
