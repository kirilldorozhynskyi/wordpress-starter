interface SvgSpritemapConfig {
	baseDir: string // Include if baseDir is essential to your configuration
	SvgSpritemap: {
		prefix: string
		output: {
			filename: string
			name: string
			view: boolean
			use: boolean
		}
		svgo: {
			plugins: object
		}
		injectSVGOnDev: boolean
	}
}

const baseDir = 'wp-content/themes/theme/resources/'

const config: SvgSpritemapConfig = {
	baseDir: baseDir,
	SvgSpritemap: {
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
}

export default config
