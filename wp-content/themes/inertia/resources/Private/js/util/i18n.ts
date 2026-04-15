import en from './lang/en.json'
import sk from './lang/sk.json'

function customRule(choice: number): number {
	if (choice === 0) {
		return 0
	}

	if (choice === 1) {
		return 1
	}

	if (choice >= 2 && choice <= 4) {
		return 2
	}

	if (choice >= 5 && choice <= 21) {
		return 3
	}

	if (choice >= 22 && choice <= 24) {
		return 2
	}

	return 3
}

const messages = {
	en,
	sk,
}

const normalizeLocale = (locale?: string | null) => {
	if (!locale) {
		return null
	}

	return locale.toLowerCase().split(/[-_]/)[0]
}

export const resolveLocale = (locale?: string | null) => {
	const normalizedLocale = normalizeLocale(locale)

	if (normalizedLocale && normalizedLocale in messages) {
		return normalizedLocale as keyof typeof messages
	}

	if (typeof document !== 'undefined') {
		const documentLocale = normalizeLocale(document.documentElement.lang || 'en')

		if (documentLocale && documentLocale in messages) {
			return documentLocale as keyof typeof messages
		}
	}

	return 'en'
}

export const createI18nConfig = (locale?: string | null) => ({
	legacy: false,
	datetimeFormats: {
		en: en.datetimeFormats,
		sk: sk.datetimeFormats,
	},
	pluralRules: {
		sk: customRule,
	},
	locale: resolveLocale(locale),
	messages,
})

export default createI18nConfig
