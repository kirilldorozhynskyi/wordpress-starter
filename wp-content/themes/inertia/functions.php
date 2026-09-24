<?php

use EvoWpRestRegistration\RestApi;
use InertiaTheme\ThemeSetup;

if (!class_exists(RestApi::class)) {
	require_once ABSPATH . 'vendor/autoload.php';
}

new ThemeSetup();

// Define constants
define('PAGES', [
	'HOME' => 2,
	'NEWS' => 20,
	'FLATS_HOME' => 8,
	'GDPR' => 3,
	'COOKIES' => 258,
]);

new RestApi([
	'namespace' => 'Inertia\\RestApi\\',
	'version' => 1,
	'directory' => __DIR__ . '/rest-api',
	'base_url' => 'inertia',
]);

register_nav_menus([
	'header-menu' => __('Header Menu'),
]);

/**
 * Temporarily disable Inertia SSR during development mode to prevent stale content.
 */
add_filter('pre_option_inertia_ssr_enabled', function ($value) {
	$hotFile = dirname(get_stylesheet_directory(), 3) . '/hot';

	if (file_exists($hotFile)) {
		return '0';
	}

	return $value;
});
