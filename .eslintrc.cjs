module.exports = {
	root: true,

	env: {
		browser: true,
		es2021: true,
	},
	extends: ['plugin:vue/vue3-essential', '@vue/airbnb', '@vue/typescript/recommended'],
	parserOptions: {
		ecmaVersion: 2020,
	},
	rules: {
		'comma-dangle': 'off',
		'function-paren-newline': 'off',
		'implicit-arrow-linebreak': 'off',
		'import/no-extraneous-dependencies': 'off',
		'import/extensions': 'off',
		'import/no-unresolved': 'off',
		'max-classes-per-file': 'off',
		'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
		'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
		'no-unused-expressions': 'off',
		'object-curly-newline': 'off',
		quotes: 'off',
		semi: 'off',
		'@typescript-eslint/no-unused-expressions': 'error',
		'vue/html-indent': 'off',
		'vue/max-len': ['error', { code: 160, template: 160, comments: 160 }],
		'vue/html-self-closing': 'off',
		'vue/multi-word-component-names': 'off',
		indent: ['error', 'tab'],
		'no-tabs': 0,
	},
	overrides: [
		{
			files: ['*.ts', '*.vue'],
			rules: {
				indent: 'off',
			},
		},
	],
}
