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
		Inertia::share('seoHead', Inertia::always([Globals::class, 'getSeoHead']));
		$this->removeDefaultWpMenusShare();

		Inertia::share('fields', function () {
			$post_id = get_queried_object_id();
			if (!is_singular() || !$post_id || post_password_required($post_id)) {
				return [];
			}

			$lang = Languages::current() ?? get_locale();
			$version = $post_id ? (string) get_post_modified_time('U', true, $post_id) : '0';
			$key = sprintf('public_acf_content_%s_%s_%s', $post_id, $lang ?: 'na', $version);

			// Preview, private content and query-filtered sections are request-specific.
			if (is_user_logged_in() || is_preview() || !empty($_GET) || ($post_id && get_post_status($post_id) !== 'publish')) {
				return ACFContent::getAcfContent($post_id);
			}

			return Cache::getCached($key, static fn() => ACFContent::getAcfContent($post_id));
		});
	}

	public function filterAcfShare(array $data): array
	{
		$allowed = apply_filters('inertia_theme/public_acf_options', []);
		$options = (array) ($data['options'] ?? []);

		$publicOptions = [];
		foreach ($allowed as $page => $fields) {
			$values = (array) ($options[$page] ?? []);
			$optionPage = function_exists('acf_get_options_page') ? acf_get_options_page($page) : null;
			if (($optionPage['parent_slug'] ?? '') === 'theme_settings' && !empty($optionPage['post_id'])) {
				$values = array_replace($values, get_fields('theme_settings') ?: []);
				$language = Languages::current();
				$postId = $page === 'theme_settings_default' && $language !== null ? "theme_settings_{$language}" : $optionPage['post_id'];
				if ($postId !== 'theme_settings') {
					$values = array_replace($values, get_fields($postId) ?: []);
				}
			}
			$publicOptions[$page] = array_intersect_key($values, array_flip($fields));
		}

		return ['options' => (object) $publicOptions];
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

		$language = Languages::current();
		if ($language !== null) {
			$this->languages = [
				'current' => $language,
				'list' => apply_filters('wpml_active_languages', null, 'orderby=id&order=asc'),
			];

			return $this->languages;
		}

		return null;
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
