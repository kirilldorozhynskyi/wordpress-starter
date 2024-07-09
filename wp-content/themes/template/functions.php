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
new JDEV\Gutenberg();
new JDEV\WC();
new JDEV\RTEConfig();
new JDEV\ACFConfig();

// Models
new JDEV\Model\Search();
if (!class_exists('GFAPI')) {
	add_action('admin_notices', function () {
		echo '<div class="error"><p>GravityForm not activated. Make sure you activate the plugin</p></div>';
	});
} else {
	new JDEV\Model\GravityForm();
}
new JDEV\Model\Person();
new JDEV\Model\News();

/**
 * Render callback to prepare and display a registered block using Timber.
 *
 * @param    array    $attributes The block attributes.
 * @param    string   $content The block content.
 * @param    bool     $is_preview Whether or not the block is being rendered for editing preview.
 * @param    int      $post_id The current post being edited or viewed.
 * @param    WP_Block $wp_block The block instance (since WP 5.5).
 * @return   void
 */
function myAcfBlockRenderCallback($attributes, $content = '', $is_preview = false, $post_id = 0, $wp_block = null)
{
	// Create the slug of the block using the name property in the block.json.
	$slug = str_replace('acf/', '', $attributes['name']);

	$context = Timber::context();

	// Store block attributes.
	$context['attributes'] = $attributes;

	// Store field values. These are the fields from your ACF field group for the block.
	$context['ce'] = get_fields();

	// Store whether the block is being rendered in the editor or on the frontend.
	$context['is_preview'] = $is_preview;

	// Render the block.
	Timber::render('views/blocks/' . $slug . '/' . $slug . '.twig', $context);
}
