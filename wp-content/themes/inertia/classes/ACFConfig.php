<?php

namespace InertiaTheme;

class ACFConfig
{
	public function __construct()
	{
		add_filter('acf/update_field', [$this, 'makeFieldsTranslatable'], 10, 1);
		add_filter('acf/location/rule_match/options_page', [$this, 'matchLanguageSettings'], 10, 4);
		add_filter('acf/load_field/type=repeater', [$this, 'makeRepeaterFieldsCollapsible'], 10, 1);
		add_filter('acf/format_value/type=wysiwyg', [$this, 'formatWysiwygTextContent'], 10, 1);
		add_filter('acf/settings/save_json', [$this, 'acfJsonSavePoint'], 10, 1);
		add_filter('acf/settings/load_json', [$this, 'acfJsonLoadPoint'], 10, 1);
		add_filter('acf/json/load_paths', [$this, 'keepSharedAcfJson'], 10, 1);
		add_action('acf/input/admin_head', [$this, 'acfClose']);
		add_action('acf/init', [$this, 'register']);
	}

	public function acfClose(): void
	{
		?>
        <script type="text/javascript">
            (function ($) {
                $(document).ready(function () {
                    $('.layout').addClass('-collapsed');
                });
            })(jQuery);
        </script>
        <?php
	}

	public function acfJsonSavePoint($path): string
	{
		return get_stylesheet_directory() . '/acf-json';
	}

	public function acfJsonLoadPoint($paths): array
	{
		unset($paths[0]);
		$paths[] = get_stylesheet_directory() . '/acf-json';
		return $paths;
	}

	public function keepSharedAcfJson(array $paths): array
	{
		$root = get_stylesheet_directory() . '/acf-json';
		if (in_array($root, $paths, true)) {
			return $paths;
		}
		foreach ($paths as $path) {
			// Legacy ACF/WPML can replace the shared directory with a language subdirectory.
			if (str_starts_with($path, $root . '/')) {
				return [$root, ...$paths];
			}
		}
		return $paths;
	}

	public function makeFieldsTranslatable($field): array
	{
		$field['wpml_cf_preferences'] ??= 3;
		return $field;
	}

	public function matchLanguageSettings(bool $match, array $rule, array $screen, array $group): bool
	{
		if (
			$match ||
			($group['key'] ?? '') !== 'group_theme_settings' ||
			($rule['operator'] ?? '') !== '==' ||
			($rule['value'] ?? '') !== 'theme_settings_default'
		) {
			return $match;
		}

		$page = acf_get_options_page($screen['options_page'] ?? '');
		return ($page['parent_slug'] ?? '') === 'theme_settings' && str_starts_with($page['menu_slug'] ?? '', 'theme_settings_');
	}

	public function makeRepeaterFieldsCollapsible($field): array
	{
		$field['collapsed'] = 'collapsed';
		return $field;
	}

	public function formatWysiwygTextContent($value): string
	{
		$mailRegex = '[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+';

		if (preg_match_all('~(' . $mailRegex . ')~im', (string) $value, $matches)) {
			foreach ($matches[1] as $match) {
				if (filter_var($match, FILTER_VALIDATE_EMAIL)) {
					$value = str_replace($match, antispambot($match), $value);
				}
			}
		}

		return (string) $value;
	}

	public function register(): void
	{
		if (!function_exists('acf_add_options_page')) {
			return;
		}

		acf_add_options_page([
			'menu_slug' => 'theme_settings',
			'menu_title' => 'Theme Settings',
			'page_title' => 'Theme Settings',
			'capability' => 'edit_theme_options',
			'redirect' => true,
		]);

		acf_add_options_sub_page([
			'parent_slug' => 'theme_settings',
			'menu_slug' => 'theme_settings_default',
			'menu_title' => 'Default',
			'page_title' => 'Theme Settings (Default)',
			'capability' => 'edit_theme_options',
			'post_id' => 'theme_settings',
		]);

		foreach (Languages::configured() as $code => $name) {
			$slug = "theme_settings_{$code}";
			if ($slug === 'theme_settings_default') {
				continue;
			}
			acf_add_options_sub_page([
				'parent_slug' => 'theme_settings',
				'menu_slug' => $slug,
				'menu_title' => $name,
				'page_title' => "Theme Settings ({$name})",
				'capability' => 'edit_theme_options',
				'post_id' => $slug,
			]);
		}

		acf_add_options_page([
			'menu_slug' => 'error_settings',
			'menu_title' => 'Error Settings',
			'page_title' => 'Error Settings',
			'capability' => 'edit_theme_options',
			'post_id' => 'error_settings',
		]);

		acf_add_options_page([
			'menu_slug' => 'contact_settings',
			'menu_title' => 'Contact Settings',
			'page_title' => 'Contact Settings',
			'capability' => 'edit_theme_options',
			'post_id' => 'contact_settings',
		]);
	}
}
