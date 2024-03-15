/*
 * File: /config.js
 * Project: proeko-fe
 * Version: 1.0.0
 * Created Date: Thursday, September 28th 2023, 14:36:16
 * Author: Kirill Dorozhynskyi - kyrylo.dorozhynskyi@justdev.org
 * -----
 * Last Modified: Tuesday, March 5th 2024 10:50:11
 * Modified By: Kirill Dorozhynskyi
 * -----
 * Copyright (c) 2024 justDev
 */

const config = {
	rootDir: 'src',
	buildDir: 'dist',
	assetsDir: 'src/public/assets',
	fonts: {
		dev: 'src/resources/fonts',
		fix: '/assets/build/',
		prod: './'
	},
	purgecss: {
		enable: false,
		safeList: []
	},
	critical: {
		enable: false
	},
	htmlMinify: {
		enable: false,
		options: {
			collapseWhitespace: true,
			removeAttributeQuotes: false,
			removeComments: true,
			sortAttributes: true,
			sortClassName: true
		}
	},
	htmlBeautify: {
		inDir: 'dist',
		html: {
			enabled: true
		},
		js: {
			enabled: false
		},
		css: {
			enabled: false
		}
	},
	imagemin: {
		gifsicle: {
			optimizationLevel: 7,
			interlaced: false
		},
		webp: {
			quality: 75
		},
		optipng: {
			optimizationLevel: 7
		},
		mozjpeg: {
			quality: 20
		},
		pngquant: {
			quality: [0.8, 0.9],
			speed: 4
		},
		svgo: {
			plugins: [
				{
					name: 'removeViewBox'
				},
				{
					name: 'removeEmptyAttrs',
					active: false
				}
			]
		}
	},
	SvgSpritemap: {
		prefix: 'icon-',
		output: {
			filename: '[name][extname]',
			name: 'spritemap.svg',
			view: true,
			use: true
		},
		svgo: {
			plugins: [
				{
					name: 'removeStyleElement'
				},
				{
					name: 'cleanupIds'
				},
				{
					name: 'removeTitle'
				},
				{
					name: 'removeViewBox'
				},
				{
					name: 'removeUselessStrokeAndFill'
				},
				{
					name: 'removeAttrs',
					params: {
						attrs: '(fill|stroke)'
					}
				}
			]
		},
		injectSVGOnDev: true
	}
}

export default config
