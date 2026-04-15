import path from 'node:path'
import { fileURLToPath } from 'node:url'

const projectRoot = fileURLToPath(new URL('.', import.meta.url))
const themeRoot = path.resolve(projectRoot, 'wp-content/themes/inertia')
const themeSourceRoot = path.resolve(themeRoot, 'resources/Private')
const themeJsRoot = path.resolve(themeSourceRoot, 'js')
const themePublicRoot = path.resolve(themeRoot, 'resources/Public')
const themeBuildRoot = path.resolve(themePublicRoot, 'Build')
const themeFontsRoot = path.resolve(themePublicRoot, 'Fonts')
const themeExtRoot = path.resolve(themePublicRoot, 'ext')
const themeFaviconsRoot = path.resolve(themePublicRoot, 'Favicons')
const themeFaviconSource = path.resolve(themeFaviconsRoot, 'favicon.svg')
const themeIconsRoot = path.resolve(themeSourceRoot, 'Icons')
const themeIconsGlob = path.resolve(themeIconsRoot, '*.svg')
const themeViteRoot = path.resolve(themeSourceRoot, '.vite')
const themeHotFile = path.resolve(themeViteRoot, 'hot')

const config = {
	base: {
		production: '/wp-content/themes/inertia/resources/Public/Build/',
	},
	esbuild: {
		target: 'es2020',
		drop: ['console', 'debugger'],
	},
	paths: {
		projectRoot,
		themeRoot,
		themeSourceRoot,
		themeJsRoot,
		themeEntry: path.resolve(themeJsRoot, 'main.ts'),
		themeSsrEntry: path.resolve(themeJsRoot, 'ssr.ts'),
		themePublicRoot,
		themeBuildRoot,
		themeFontsRoot,
		themeExtRoot,
		themeFaviconsRoot,
		themeFaviconSource,
		themeIconsRoot,
		themeIconsGlob,
		themeViteRoot,
		themeHotFile,
	},
	directoriesToEnsure: [themeBuildRoot, themeFontsRoot, themeExtRoot, themeFaviconsRoot, themeIconsRoot, themeViteRoot],
	svgSpritemap: {
		prefix: 'icon-',
		output: {
			filename: '[name][extname]',
			name: 'spritemap.svg',
			view: true,
			use: true,
		},
		svgo: {
			plugins: [
				{ name: 'removeStyleElement' },
				{ name: 'cleanupIds' },
				{ name: 'removeTitle' },
				{ name: 'removeViewBox' },
				{ name: 'removeUselessStrokeAndFill' },
				{
					name: 'removeAttrs',
					params: {
						attrs: '(fill|stroke)',
					},
				},
			],
		},
		injectSVGOnDev: true,
	},
	favicons: {
		icons: {
			android: true,
			appleIcon: true,
			appleStartup: true,
			favicons: true,
			windows: false,
			yandex: false,
		},
	},
	wordpress: {
		namespace: 'theme-inertia',
		publicDirectory: 'resources/Public',
		buildDirectory: 'Build',
		ssrOutputDirectory: 'resources/Private/.vite/ssr',
	},
} as const

export default config
