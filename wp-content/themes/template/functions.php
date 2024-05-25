<?php

/**
 * This ensures that Timber is loaded and available as a PHP class.
 * If not, it gives an error message to help direct developers on where to activate
 */

use Timber\Timber;

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

// Constants
define('PAGES', [
	'HOME' => 1,
	'PRIVACY_POLICY' => 2,
	'NEWS' => 3,
	'SEARCH' => 4,
]);

// Autoload
require ABSPATH . '/vendor/autoload.php';

// Classes
new JDEV\Base();
new JDEV\RTEConfig();
new JDEV\ACFConfig();

// Models
new JDEV\Model\Search();
// if (!class_exists('GFAPI')) {
// 	add_action('admin_notices', function () {
// 		echo '<div class="error"><p>GravityForm not activated. Make sure you activate the plugin</p></div>';
// 	});
// } else {
// 	new JDEV\Model\GravityForm();
// }
// new JDEV\Model\Person();
// new JDEV\Model\News();
