<?php

namespace JDEV;

/**
 * Class Base
 *
 * @package JDEV
 */
class Base
{
	public function __construct()
	{
		$this->addThemeActionsAndFilters();
	}
	protected function addThemeActionsAndFilters(): void
	{
		add_action('after_setup_theme', [$this, 'setupTheme']);
		add_filter('use_block_editor_for_post', '__return_false');
	}

	/**
	 * Setup theme
	 */
	public function setupTheme(): void
	{
		add_theme_support('menus');
		// add_theme_support('title-tag');
		add_post_type_support('page', 'excerpt');
		add_theme_support('post-thumbnails');
		// add_theme_support('woocommerce');
		// add_post_type_support('news', 'thumbnail');
		load_theme_textdomain('jdev', get_template_directory() . '/languages');

		$sizes = []; // Add your sizes here
		foreach ($sizes as $size) {
			add_image_size($size['name'], $size['size'], $size['sizeH'] ?? 0);
			add_image_size($size['name'] . '2x', $size['size'] * 2, $size['sizeH'] ? $size['sizeH'] * 2 : 0);
		}
	}
}
