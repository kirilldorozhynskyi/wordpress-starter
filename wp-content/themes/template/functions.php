<?php

use Timber\Timber;

new JDEV\Base();
new JDEV\Deregister();
new JDEV\Vite();
new JDEV\Favicon();

if (Timber::$version) {
	$timber = true;
} else {
	$timber = false;
}

if (!class_exists('ACF') or !$timber) {
	if (!$timber) {
		add_action('admin_notices', function () {
			echo '<div class="error"><p>Timber not activated. Make sure you activate the plugin <a href="https://wordpress.org/plugins/timber-library/">Timber</a></p></div>';
		});
	}

	if (!class_exists('ACF')) {
		add_action('admin_notices', function () {
			echo '<div class="error"><p>ACF or ACF PRO not activated. Make sure you activate the plugin <a href="https://wordpress.org/plugins/advanced-custom-fields/">ACF</a></p></div>';
		});
	}

	add_filter('template_include', function ($template) {
		return get_stylesheet_directory() . '/static/no-timber.php';
	});
	return;
}

require_once ABSPATH . '/vendor/autoload.php';

new JDEV\InertiaWP();
new JDEV\ACFConfig();
new JDEV\DynamicImages();

// Models
new JDEV\Model\News();
// Add this code to your theme's functions.php or a custom plugin

if (!class_exists('GFAPI')) {
	add_action('admin_notices', function () {
		echo '<div class="error"><p>GravityForm not activated. Make sure you activate the plugin</p></div>';
	});
} else {
	new JDEV\Model\GravityForm();
}

define('PAGES', [
	'HOME' => 3,
	'NEWS' => 4,
]);
