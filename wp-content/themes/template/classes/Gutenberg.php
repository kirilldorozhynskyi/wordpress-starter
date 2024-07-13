<?php
namespace JDEV;

use DirectoryIterator;
use WP_Block_Type_Registry;
use Exception;
use Timber\Timber;

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

		try {
			// Check if directory exists before iterating
			if (!is_dir($blocksDir)) {
				throw new Exception("Directory $blocksDir does not exist.");
			}

			foreach ($blocks = new DirectoryIterator($blocksDir) as $item) {
				// Check if block.json file exists in each subfolder.
				if ($item->isDir() && !$item->isDot() && file_exists($item->getPathname() . '/block.json')) {
					$block_json = file_get_contents($item->getPathname() . '/block.json');
					$block_data = json_decode($block_json, true);

					// Ensure 'acf' key exists and has 'renderCallback' specified
					if (isset($block_data['acf']['renderCallback'])) {
						// Register the block type with ACF and specify the render callback
						register_block_type($item->getPathname(), [
							'render_callback' => [$this, $block_data['acf']['renderCallback']],
						]);
					}
				}
			}
		} catch (Exception $e) {
		}
	}

	public function wporgBlockWrapper($block_content, $block)
	{
		if (isset($block['blockName']) && str_contains($block['blockName'], 'core/')) {
			$content = '<section class="wpg-block ' . str_replace('/', '-', $block['blockName']) . '"><div class="container">';
			$content .= $block_content;
			$content .= '</div></section>';
			return $content;
		}
		return $block_content;
	}

	public function blockCategoriesAll($categories)
	{
		$custom_category = [
			'slug' => 'custom-design-category',
			'title' => 'jD | ' . __('Design', 'jdev'),
		];

		array_unshift($categories, $custom_category);

		return $categories;
	}

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
	public static function jDBlockRender($attributes, $content = '', $is_preview = false, $post_id = 0, $wp_block = null)
	{
		// Create the slug of the block using the name property in the block.json.
		$slug = str_replace('jd/', '', $attributes['name']);
		$slug = str_replace('-', '_', $slug);

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
}
