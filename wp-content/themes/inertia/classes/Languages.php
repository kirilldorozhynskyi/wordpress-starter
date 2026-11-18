<?php

namespace InertiaTheme;

use Closure;

final class Languages
{
	public static function current(): ?string
	{
		$language = apply_filters('wpml_current_language', null);
		if (self::isCode($language)) {
			return $language;
		}

		return defined('ICL_LANGUAGE_CODE') && self::isCode(ICL_LANGUAGE_CODE) ? ICL_LANGUAGE_CODE : null;
	}

	/** @return array<string, string> */
	public static function configured(): array
	{
		global $sitepress;

		// Unlike wpml_active_languages, the configured languages are available before the main query.
		$languages = is_callable([$sitepress, 'get_active_languages'])
			? $sitepress->get_active_languages()
			: apply_filters('wpml_setting', [], 'active_languages');
		$configured = [];
		foreach ((array) $languages as $key => $language) {
			$code = is_array($language) ? $language['code'] ?? ($language['language_code'] ?? $key) : (is_string($language) ? $language : $key);
			if (self::isCode($code)) {
				$configured[$code] = is_array($language) ? $language['native_name'] ?? $code : $code;
			}
		}

		return $configured;
	}

	public static function switchForRequest(mixed $requested): ?Closure
	{
		$language = self::forRequest($requested);
		$current = self::current();
		if ($language === null || strcasecmp($language, $current ?? '') === 0) {
			return null;
		}

		// WPML 5 closes the innermost scope with null. Older releases restore by language code.
		$restore = defined('ICL_SITEPRESS_VERSION') && version_compare(ICL_SITEPRESS_VERSION, '5.0', '<') ? $current : null;
		do_action('wpml_switch_language', $language);

		return static fn() => do_action('wpml_switch_language', $restore);
	}

	private static function forRequest(mixed $language): ?string
	{
		if (!self::isCode($language)) {
			return null;
		}

		$current = self::current();
		$codes = array_keys(self::configured());
		if ($current !== null) {
			$codes[] = $current;
		}
		foreach ($codes as $code) {
			if (strcasecmp($code, $language) === 0) {
				return $code;
			}
		}

		return null;
	}

	private static function isCode(mixed $language): bool
	{
		return is_string($language) && strcasecmp($language, 'all') !== 0 && preg_match('/^[a-z][a-z0-9_-]*$/iD', $language) === 1;
	}
}
