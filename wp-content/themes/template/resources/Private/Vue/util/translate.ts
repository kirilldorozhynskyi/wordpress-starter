import en from './lang/en'
import sk from './lang/sk'

const translate = {
	datetimeFormats: {
		en: en.datetimeFormats,
		sk: sk.datetimeFormats,
	},
	locale: document.documentElement.lang || 'en',
	messages: {
		en: en,
		sk: sk,
	},
}

export default translate
