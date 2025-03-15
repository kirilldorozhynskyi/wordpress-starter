<?php

namespace JDEV;

use BoxyBird\Inertia\Inertia;
use Timber\Timber;
use Timber\Menu;
use JDEV\ACFContent;
use JDEV\Globals;
require ABSPATH . '/vendor/autoload.php';

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
		Inertia::share([
			'site' => $this->getSiteInfo(),
			'seo' => function () {
				return Globals::getSeoData();
			},
			'fields' => function () {
				return ACFContent::getAcfContent();
			},
			'options' => get_fields('options'),
			'theme' => [
				'uri' => get_template_directory_uri(),
			],
			'menu' => $this->getMenus(),
		]);

		Inertia::version($this->getBuildVersion());
	}

	/**
	 * Gets basic information about the site
	 *
	 * @return array
	 */
	private function getSiteInfo(): array
	{
		return [
			'name' => get_bloginfo('name'),
			'description' => get_bloginfo('description'),
			'url' => get_bloginfo('url'),
		];
	}

	/**
	 * Gets a menu with additional ACF fields
	 *
	 * @return array
	 */
	private function getMenus(): array
	{
		return [
			'main' => $this->getEnhancedMenu('main-menu'),
			'footer' => $this->getEnhancedMenu('footer-menu'),
		];
	}

	/**
	 * Gets a menu with ACF fields
	 *
	 * @param string $menu_name
	 * @return array|null
	 */
	private function getEnhancedMenu(string $menu_name): ?array
	{
		$menu = Timber::get_menu($menu_name);

		if (!$menu || empty($menu->items)) {
			return null;
		}

		foreach ($menu->items as $item) {
			$item->name = $item->title;
			$item->target = $item->target;

			$acf_fields = get_fields($item->ID);
			if ($acf_fields) {
				$item->acf = $acf_fields;
			}
		}

		return [
			'items' => $menu->items,
		];
	}

	/**
	 * Gets the assembly version
	 *
	 * @return string
	 */
	private function getBuildVersion(): string
	{
		$manifest_path = __DIR__ . '/../build/manifest.json';

		return file_exists($manifest_path) ? (string) filemtime($manifest_path) : (string) time();
	}
}
