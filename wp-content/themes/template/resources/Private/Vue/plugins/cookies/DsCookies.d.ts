import DsCookies from './DsCookies'

declare module '@vue/runtime-core' {
	interface ComponentCustomProperties {
		$cookies: DsCookies
	}
}
