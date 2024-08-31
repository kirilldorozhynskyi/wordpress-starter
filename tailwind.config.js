import config from './config'
const { baseDir } = config

/** @type {import('tailwindcss').Config} */
export default {
	content: [`./${baseDir}/Private/Vue/**/**/*.vue`],

	theme: {
		extend: {}
	},
	plugins: []
}
