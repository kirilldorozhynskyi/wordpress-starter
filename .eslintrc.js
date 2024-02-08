module.exports = {
	root: true,

	env: {
		browser: true,
		es2021: true
	},
	extends: ['plugin:vue/vue3-essential', '@vue/airbnb', '@vue/typescript/recommended'],
	parserOptions: {
		ecmaVersion: 2020
	},
	rules: {
		'max-classes-per-file': 'off',
		'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
		'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
		'no-unused-expressions': 'off',
		'@typescript-eslint/no-unused-expressions': 'error',
		'vue/multi-word-component-names': 'off',
		indent: [4, 'tab'],
		'no-tabs': 0
	},
	overrides: [
		{
			files: ['*.ts', '*.vue'],
			rules: {
				indent: 'off'
			}
		}
	]
}
