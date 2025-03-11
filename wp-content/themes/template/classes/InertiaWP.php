<?php

namespace JDEV;

use BoxyBird\Inertia\Inertia;
use Timber\Timber;
use Timber\Menu;
require ABSPATH . '/vendor/autoload.php';
use JDEV\Model\Events;

class InertiaWP
{
	public function __construct()
	{
		add_action('after_setup_theme', [$this, 'setupTheme']);
	}

	/**
	 * Setup theme
	 */
	public function setupTheme(): void
	{
		function getEnhancedMenu($menu_name)
		{
			$menu = Timber::get_menu($menu_name);

			if ($menu && $menu->items) {
				foreach ($menu->items as &$item) {
					$item->name = $item->title;
					$item->target = $item->target;

					// Fetch ACF custom fields for this menu item
					$acf_fields = get_fields($item->ID);
					if ($acf_fields) {
						$item->acf = $acf_fields;
					}
				}
				return [
					'items' => $menu->items,
				];
			}
			return null;
		}

		Inertia::share([
			'site' => [
				'name' => get_bloginfo('name'),
				'description' => get_bloginfo('description'),
				'url' => get_bloginfo('url'),
			],
			'seo' => function () {
				$yoast_meta = YoastSEO()->meta->for_current_page();
				$ogtitle = $yoast_meta->open_graph_title;
				$description = !empty($yoast_meta->open_graph_description)
					? $yoast_meta->open_graph_description
					: (get_bloginfo('description') ?:
					wp_trim_words(get_the_excerpt(), 20));

				$seo = [
					'title' => $ogtitle,
					'description' => $description,
				];

				return $seo;
			},
			'fields' => function () {
				$fields = get_fields();

				// if (!empty($fields['flexible_content'])) {
				// 	foreach ($fields['flexible_content'] as &$block) {
				// 		if (isset($block['acf_fc_layout']) && $block['acf_fc_layout'] === 'events') {
				// 			$block['events_data'] = Events::getEvents();
				// 		}
				// 	}
				// 	unset($block);
				// }

				return $fields;
			},
			'options' => get_fields('options'),
			'theme' => [
				'uri' => get_template_directory_uri(),
			],
			'menu' => [
				// 'languages' => function () {
				// 	return $this->getLanguages();
				// },

				// $this->getLanguages(),
				'main' => getEnhancedMenu('main-menu'),
				'footer' => getEnhancedMenu('footer-menu'),
			],
		]);

		if (file_exists(__DIR__ . '/../build/manifest.json')) {
			$version = filemtime(__DIR__ . '/../build/manifest.json');
		} else {
			$version = time();
		}

		Inertia::version($version);
	}
}
