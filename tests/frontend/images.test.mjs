import assert from 'node:assert/strict'
import { test } from 'node:test'
import {
	densitySrcset,
	getMediaEntries,
	getNativeImageSource,
	getNativeMediaSource,
} from '../../wp-content/themes/inertia/resources/Private/js/util/responsive-image.mjs'

const image = {
	url: '/hero.jpg',
	width: 2000,
	height: 1000,
	sizes: {
		thumbnail: '/hero-square.jpg',
		'thumbnail-width': 150,
		'thumbnail-height': 150,
		large: '/hero-1024.jpg',
		'large-width': 1024,
		'large-height': 512,
		medium: '/hero-300.jpg',
		'medium-width': 300,
		'medium-height': 150,
		unavailable: '/hero.jpg',
		'unavailable-width': 600,
		'unavailable-height': 300,
		medium2x: '/hero-600.jpg',
		'medium2x-width': 600,
		'medium2x-height': 300,
	},
}

test('uses real WordPress derivatives ordered by width and excludes square and mislabeled assets', () => {
	assert.deepEqual(getNativeImageSource(image), {
		src: '/hero.jpg',
		srcset: '/hero-300.jpg 300w, /hero-600.jpg 600w, /hero-1024.jpg 1024w, /hero.jpg 2000w',
		hasWidths: true,
		width: 2000,
		height: 1000,
	})
})

test('pairs an explicitly selected size with a real retina variant', () => {
	assert.equal(getNativeImageSource(image, { size: 'medium' }).srcset, '/hero-300.jpg 1x, /hero-600.jpg 2x')
	assert.equal(getNativeImageSource(image, { size: 'large' }).srcset, '')
	assert.equal(getNativeImageSource(image, { size: 'medium', retina: false }).srcset, '')
	assert.equal(densitySrcset('/hero.jpg', '/hero.jpg'), '')
})

test('supports structured WordPress resources and standalone URLs', () => {
	const resource = {
		sizes: {
			full: { url: '/hero.jpg', width: 2000, height: 1000 },
			medium: { url: '/hero-300.jpg', width: 300, height: 150 },
		},
	}
	assert.equal(getNativeImageSource(resource).srcset, '/hero-300.jpg 300w, /hero.jpg 2000w')
	assert.equal(getNativeImageSource('/logo.svg').src, '/logo.svg')
	assert.equal(getNativeImageSource('/logo.svg').srcset, '')
	assert.equal(getNativeImageSource({ url: '/only.jpg', width: 800, height: 600 }).srcset, '/only.jpg 800w')
})

test('selects named sizes for media breakpoints and accepts the size_retina prop used by ImageWP', () => {
	const entries = getMediaEntries({ 1024: { size: 'large' }, 640: { size: 'medium', size_retina: 'medium2x' }, invalid: { size: 'medium' } })
	assert.deepEqual(
		entries.map(([breakpoint]) => breakpoint),
		['640', '1024']
	)
	assert.equal(getNativeMediaSource(image, entries[0][1], true).srcset, '/hero-300.jpg 1x, /hero-600.jpg 2x')
	assert.equal(getNativeMediaSource(image, { size: 'missing' }, true), null)
})
