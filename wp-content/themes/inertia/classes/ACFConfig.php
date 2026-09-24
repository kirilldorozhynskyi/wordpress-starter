<?php

namespace InertiaTheme;

class ACFConfig
{
	public function __construct()
	{
		add_filter('acf/update_field', [$this, 'makeFieldsTranslatable'], 10, 1);
		add_filter('acf/load_field/type=repeater', [$this, 'makeRepeaterFieldsCollapsible'], 10, 1);
		add_filter('acf/format_value/type=wysiwyg', [$this, 'formatWysiwygTextContent'], 10, 1);
		add_filter('acf/settings/save_json', [$this, 'acfJsonSavePoint'], 10, 1);
		add_filter('acf/settings/load_json', [$this, 'acfJsonLoadPoint'], 10, 1);
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

	public function makeFieldsTranslatable($field): array
	{
		$field['wpml_cf_preferences'] = 3;
		return $field;
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

		$languages = apply_filters('wpml_active_languages', null);

		if ($languages) {
			foreach ($languages as $code => $details) {
				acf_add_options_sub_page([
					'parent_slug' => 'theme_settings',
					'menu_slug' => "theme_settings_{$code}",
					'menu_title' => $details['native_name'],
					'page_title' => "Theme Settings ({$details['native_name']})",
					'capability' => 'edit_theme_options',
					'post_id' => "theme_settings_{$code}",
				]);
			}
		} else {
			acf_add_options_sub_page([
				'parent_slug' => 'theme_settings',
				'menu_slug' => 'theme_settings_default',
				'menu_title' => 'Default',
				'page_title' => 'Theme Settings (Default)',
				'capability' => 'edit_theme_options',
				'post_id' => 'theme_settings',
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
