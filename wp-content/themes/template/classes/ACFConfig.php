<?php

namespace JDEV;

/**
 * Class ACFConfig
 *
 * @package JDEV
 */
class ACFConfig
{
	public function __construct()
	{
		add_filter('acf/update_field', [$this, 'makeFieldsTranslatable'], 10, 1);
		add_filter('acf/load_field/type=repeater', [$this, 'makeRepeaterFieldsCollapsible'], 10, 1);
		add_filter('acf/format_value/type=wysiwyg', [$this, 'formatWysiwygTextContent'], 10, 1);
		add_filter('acf/settings/save_json', [$this, 'acfJsonSavePoint'], 10, 1);
		add_filter('acf/settings/load_json', [$this, 'acfJsonLoadPoint'], 10, 1);
		add_action('acf/input/admin_head', [$this, 'acfClose'], 10, 1);

		add_action('init', [$this, 'register']);
	}

	/**
	 * Save ACF to json fields
	 *
	 * @param $paths
	 * @return array
	 */
	public function acfClose($paths)
	{
		?>
		<script type="text/javascript">
			(function ($) {
				$(document).ready(function () {
					$('.layout').addClass('-collapsed');

					// $('.acf-postbox').addClass('closed');

				});
			})(jQuery);

		</script>
		<?php
	}

	/**
	 * Save ACF to json fields
	 *
	 * @param $paths
	 * @return array
	 */
	public function acfJsonSavePoint($paths)
	{
		// update path
		$path = get_stylesheet_directory() . '/acf-json';

		// return
		return $path;
	}

	/**
	 * Load ACF to json fields
	 *
	 * @param $paths
	 * @return array
	 */
	public function acfJsonLoadPoint($paths)
	{
		// remove original path (optional)
		unset($paths[0]);

		// append path
		$paths[] = get_stylesheet_directory() . '/acf-json';

		// return
		return $paths;
	}

	/**
	 * Make all fields translatable via WPML
	 * Possible values: 1 = copy / 2 = translate / 3 = copy only once
	 *
	 * @param $field
	 * @return array
	 */
	public function makeFieldsTranslatable($field)
	{
		$field['wpml_cf_preferences'] = 3;
		return $field;
	}

	/**
	 * Make all repeater fields collapsible
	 *
	 * @param $field
	 * @return array
	 */
	public function makeRepeaterFieldsCollapsible($field)
	{
		$field['collapsed'] = 'collapsed';
		return $field;
	}

	/**
	 * Convert all email adresses in RTE text content to HTML entities to block spam bots
	 *
	 * @param $value
	 * @return string
	 */
	public function formatWysiwygTextContent($value)
	{
		$mailRegex = '[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+';
		if (preg_match_all('~(' . $mailRegex . ')~im', $value, $matches)) {
			foreach ($matches[1] as $match) {
				if (filter_var($match, FILTER_VALIDATE_EMAIL)) {
					$value = str_replace($match, antispambot($match), $value);
				}
			}
		}
		return $value;
	}

	/**
	 * Register
	 */
	public function register()
	{
		// Theme settings page
		acf_add_local_field_group(include_once 'ACF/Pages/ThemeSettings.php');
	}
}
