import pluginVue from 'eslint-plugin-vue'
import { configureVueProject, defineConfigWithVueTs, vueTsConfigs } from '@vue/eslint-config-typescript'
import globals from 'globals'

configureVueProject({ scriptLangs: ['ts', 'js'] })

export default defineConfigWithVueTs(
	{
		ignores: ['**/node_modules/**', '**/vendor/**', '**/resources/Public/Build/**', '**/.vite/**', '**/.inertia/**']
	},
	pluginVue.configs['flat/essential'],
	vueTsConfigs.recommended,
	{
		languageOptions: {
			globals: { ...globals.browser, ...globals.node }
		},
		rules: {
			'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
			'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
			'vue/multi-word-component-names': 'off',
			'vue/max-len': ['error', { code: 160, template: 160, comments: 160 }]
		}
	}
)
