<?php
/**
 * File: /wp-content/themes/template/classes/Gutenberg.php
 * Project: GLENDEA
 * Version: 1.0.0
 * Created Date: Wednesday, July 24th 2024, 23:51:24
 * Author: Kirill Dorozhynskyi - kirilldy@justdev.org
 * -----
 * Last Modified: Saturday, July 27th 2024 13:15:35
 * Modified By: Kirill Dorozhynskyi
 * -----
 * Copyright (c) 2024 justDev
 */

namespace JDEV;

use DirectoryIterator;
use WP_Block_Type_Registry;
use Exception;
use Timber\Timber;
use Timber\Loader;

/**
 * Class Gutenberg
 *
 * @package JDEV
 */
class Gutenberg
{
	public function __construct()
	{
		add_action('init', [$this, 'registerAcfBlocks']);
		add_filter('render_block', [$this, 'wporgBlockWrapper'], 10, 2);
		add_filter('block_categories_all', [$this, 'blockCategoriesAll']);
	}

	public function registerAcfBlocks()
	{
		$blocksDir = get_template_directory() . '/views/blocks';

		if (!is_dir($blocksDir)) {
			error_log("Directory $blocksDir does not exist.");
			return;
		}

		foreach (new DirectoryIterator($blocksDir) as $item) {
			if ($item->isDir() && !$item->isDot()) {
				$blockJsonPath = $item->getPathname() . '/block.json';
				if (file_exists($blockJsonPath)) {
					$block_data = json_decode(file_get_contents($blockJsonPath), true);
					if (isset($block_data['acf']['renderCallback'])) {
						register_block_type($item->getPathname(), [
							'render_callback' => [$this, $block_data['acf']['renderCallback']],
						]);
					}
				}
			}
		}
	}

	public function wporgBlockWrapper($block_content, $block)
	{
		if (isset($block['blockName']) && str_contains($block['blockName'], 'core/')) {
			if ($block['blockName'] === 'core/list-item') {
				return $block_content;
			} else {
				return '<section class="wpg-block ' .
					str_replace('/', '-', $block['blockName']) .
					'"><div class="container">' .
					$block_content .
					'</div></section>';
			}
		}
		return $block_content;
	}

	public function blockCategoriesAll($categories)
	{
		array_unshift($categories, [
			'slug' => 'custom-design-category',
			'title' => 'jD | ' . __('Design', 'jdev'),
		]);
		return $categories;
	}

	/**
	 * Render callback to prepare and display a registered block using Timber.
	 *
	 * @param array    $attributes The block attributes.
	 * @param string   $content The block content.
	 * @param bool     $is_preview Whether or not the block is being rendered for editing preview.
	 * @param int      $post_id The current post being edited or viewed.
	 * @param WP_Block $wp_block The block instance (since WP 5.5).
	 * @return void
	 */
	public static function jDBlockRender($attributes, $content = '', $is_preview = false, $post_id = 0, $wp_block = null)
	{
		// Create the slug of the block using the name property in the block.json.
		$slug = str_replace(['jd/', '-'], ['', '_'], $attributes['name']);

		// Initialize Timber context
		$context = Timber::context();
		$context['attributes'] = $attributes;
		$context['ce'] = get_fields();
		$context['is_preview'] = $is_preview;

		Timber::render('views/blocks/' . $slug . '/' . $slug . '.twig', $context);
	}
}
