<?php

namespace InertiaTheme;

class Cache
{
	public static function getCached(string $key, callable $callback, int $ttl = 300, string $group = 'inertia_theme')
	{
		if (self::isDevelopment()) {
			return $callback();
		}

		$value = wp_cache_get($key, $group);
		if (false !== $value) {
			return $value;
		}

		$transient_key = $group . '_' . $key;
		$value = get_transient($transient_key);

		if (false !== $value) {
			wp_cache_set($key, $value, $group, $ttl);
			return $value;
		}

		$value = $callback();

		if (null !== $value) {
			wp_cache_set($key, $value, $group, $ttl);
			set_transient($transient_key, $value, $ttl);
		}

		return $value;
	}

	public static function clear(string $group = 'inertia_theme'): void
	{
		if (function_exists('wp_cache_flush_group')) {
			wp_cache_flush_group($group);
		} else {
			wp_cache_flush();
		}

		global $wpdb;

		$like_value = $wpdb->esc_like('_transient_' . $group . '_') . '%';
		$like_timeout = $wpdb->esc_like('_transient_timeout_' . $group . '_') . '%';

		$wpdb->query($wpdb->prepare("DELETE FROM {$wpdb->options} WHERE option_name LIKE %s OR option_name LIKE %s", $like_value, $like_timeout));
	}

	private static function isDevelopment(): bool
	{
		if (function_exists('wp_get_environment_type') && wp_get_environment_type() === 'development') {
			return true;
		}

		return defined('WP_ENV') && WP_ENV === 'development';
	}
}
