module.exports = {
	apps: [
		{
			name: 'inertia-ssr',
			cwd: __dirname,
			script: 'wp-content/themes/inertia/resources/Private/.vite/ssr/ssr.mjs',
			interpreter: process.execPath,
			env: {
				NODE_ENV: 'production',
				PORT: process.env.INERTIA_SSR_PORT || '13714',
			},
		},
	],
}
