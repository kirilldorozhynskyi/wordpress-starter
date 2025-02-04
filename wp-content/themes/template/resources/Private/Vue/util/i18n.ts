import en from './lang/en.json'

const translate = {
	legacy: false,
	datetimeFormats: {
		en: en.datetimeFormats,
		// sk: sk.datetimeFormats,
	},
	locale: document.documentElement.lang || 'en',
	messages: {
		en: en,
		// sk: sk,
	},
}

const i18nConfig = translate

export default i18nConfig
