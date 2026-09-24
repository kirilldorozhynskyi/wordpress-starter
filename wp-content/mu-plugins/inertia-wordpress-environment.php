<?php
/**
 * Plugin Name: Inertia WordPress Environment
 * Description: Allows container environment variables to control SSR without changing database options.
 */

if (!defined('ABSPATH')) {
	exit();
}

$enabled = getenv('INERTIA_SSR_ENABLED');
if ($enabled !== false) {
	add_filter('pre_option_inertia_ssr_enabled', static fn() => $enabled === '1' ? '1' : '0');
	$port = (int) (getenv('INERTIA_SSR_PORT') ?: 13714);
	add_filter('pre_option_inertia_ssr_url', static fn() => 'http://127.0.0.1:' . $port);
}
