import { createI18n } from 'vue3-i18n'

const messages = {
	en: {
		cookies: {
			button: {
				accept: 'Accept',
				close: 'Close',
			},
			info: {
				disabled: 'Please enable cookies to view this content',
			},
		},
	},
}

// eslint-disable-next-line import/prefer-default-export
export const i18n = createI18n({
	locale: 'en',
	messages,
})
