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
			$content = '<section class="wp-block-paragraph"><div class="container">';
			$content .= $block_content;
			$content .= '</div></section>';
			return $content;
		}
		return $block_content;
	}
}
