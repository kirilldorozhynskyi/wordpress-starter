<?php

namespace InertiaTheme;

use EvoMark\InertiaWordpress\Helpers\HookActions;
use EvoMark\InertiaWordpress\Helpers\HookFilters;
use EvoMark\InertiaWordpress\Inertia;
use Timber\Timber;

class InertiaShare
{
	private ?array $languages = null;
	private array $menuCache = [];

	public function __construct()
	{
		add_action(HookActions::SET_GLOBAL_SHARES, [$this, 'shareFields'], 20);
		add_filter(HookFilters::ACF_SHARE, [$this, 'filterAcfShare']);
	}

	public function shareFields(): void
	{
		Inertia::share('theme', [
			'uri' => get_template_directory_uri(),
		]);

		Inertia::share('menu', fn() => $this->getMenus());
		$this->removeDefaultWpMenusShare();

		Inertia::share('fields', function () {
			$post_id = get_queried_object_id() ?: 0;
			$lang = defined('ICL_LANGUAGE_CODE') ? ICL_LANGUAGE_CODE : get_locale();
			$version = $post_id ? (string) get_post_modified_time('U', true, $post_id) : '0';
			$key = sprintf('acf_content_%s_%s_%s', $post_id ?: '0', $lang ?: 'na', $version);

			return Cache::getCached($key, static fn() => ACFContent::getAcfContent(), 300, 'theme');
		});
	}

	public function filterAcfShare(array $data): array
	{
		unset($data['post']);

		return $data;
	}

	private function getMenus(): array
	{
		return [
			'languages' => $this->getLanguages(),
			'main' => $this->getEnhancedMenu('main-menu'),
			'footer' => $this->getEnhancedMenu('footer-menu'),
			'header' => $this->getEnhancedMenu('header-menu'),
		];
	}

	private function removeDefaultWpMenusShare(): void
	{
		$wp = inertia_request()->getShared('wp', []);

		if (!is_array($wp) || !array_key_exists('menus', $wp)) {
			return;
		}

		unset($wp['menus']);

		Inertia::share('wp', $wp);
	}

	private function getLanguages(): ?array
	{
		if ($this->languages !== null) {
			return $this->languages;
		}

		if (defined('ICL_LANGUAGE_CODE')) {
			$this->languages = [
				'current' => ICL_LANGUAGE_CODE,
				'list' => apply_filters('wpml_active_languages', null, 'orderby=id&order=asc'),
			];

			return $this->languages;
		}

		$this->languages = null;

		return $this->languages;
	}

	private function getEnhancedMenu(string $menuName): ?array
	{
		if (array_key_exists($menuName, $this->menuCache)) {
			return $this->menuCache[$menuName];
		}

		$menu = Timber::get_menu($menuName);

		if (!$menu || empty($menu->items)) {
			$this->menuCache[$menuName] = null;

			return $this->menuCache[$menuName];
		}

		$normalizeItem = function ($item) use (&$normalizeItem): array {
			$title = $item->title;

			if (empty($title) && !empty($item->object_id)) {
				$title = get_the_title($item->object_id);
			}

			if (empty($title)) {
				$title = $item->post_name ?: (string) $item->ID;
			}

			$normalized = [
				'id' => (int) $item->ID,
				'name' => $title,
				'title' => $title,
				'url' => $item->url,
				'type' => $item->type,
				'target' => $item->target ?: '_self',
				'current' => (bool) $item->current,
				'current_item_parent' => (bool) $item->current_item_parent,
				'children' => [],
			];

			if ($acfFields = get_fields($item->ID)) {
				$normalized['acf'] = $acfFields;
			}

			if (!empty($item->children)) {
				foreach ($item->children as $child) {
					$normalized['children'][] = $normalizeItem($child);
				}
			}

			return $normalized;
		};

		$items = [];

		foreach ($menu->items as $item) {
			$items[] = $normalizeItem($item);
		}

		$menuFields = get_fields('nav_menu_' . $menu->term_id);

		$this->menuCache[$menuName] = [
			'title' => $menuFields['title'] ?? ($menu->name ?? ''),
			'items' => $items,
		];

		return $this->menuCache[$menuName];
	}
}
