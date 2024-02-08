<?php

namespace JDEV;

/**
 * Class RTEConfig
 *
 * @package JDEV
 */
class RTEConfig
{
	public function __construct()
	{
		add_filter('mce_css', [$this, 'unloadDefaultStyles']);
		add_filter('mce_external_plugins', [$this, 'registerExternalPlugins']);
		add_filter('acf/fields/wysiwyg/toolbars', [$this, 'configureBasicToolbar']);
		add_filter('mce_buttons', [$this, 'configureFullToolbar']);
		add_filter('tiny_mce_before_init', [$this, 'configureStyles']);
		add_shortcode('shy', [$this, 'softHyphenShortcode']);
	}

	/**
	 * Unload default styles
	 *
	 * @param $stylesheets
	 * @return string
	 */
	public function unloadDefaultStyles($stylesheets)
	{
		$stylesheets = explode(',', $stylesheets);
		foreach ($stylesheets as $key => $sheet) {
			if (preg_match('/wp-includes/', $sheet)) {
				unset($stylesheets[$key]);
			}
		}
		return implode(',', $stylesheets);
	}

	/**
	 * Register external plugins
	 *
	 * @param $plugins
	 * @return array
	 */
	public function registerExternalPlugins($plugins)
	{
		$plugins['table'] = content_url() . '/lib/tiny-mce-plugins/table.min.js';
		return $plugins;
	}

	/**
	 * Toolbar buttons configuration for basic RTE
	 *
	 * @param $toolbars
	 * @return array
	 */
	public function configureBasicToolbar($toolbars)
	{
		$toolbars['Basic'][1] = [
			'styleselect',
			'removeformat',
			'link',
			'unlink',
			'bold',
			'italic',
			'underline',
			'strikethrough',
			'blockquote',
			'subscript',
			'superscript',
			'hr',
		];
		return $toolbars;
	}

	/**
	 * Toolbar buttons configuration for full RTE
	 *
	 * @return array
	 */
	public function configureFullToolbar()
	{
		return [
			'formatselect',
			'styleselect',
			'removeformat',
			'link',
			'unlink',
			'bold',
			'italic',
			'underline',
			'strikethrough',
			'blockquote',
			'subscript',
			'superscript',
			'hr',
			'bullist',
			'numlist',
			'table',
			'alignleft',
			'aligncenter',
			'alignright',
		];
	}

	/**
	 * Configuration for block and style formats
	 *
	 * @param $settings
	 * @return array
	 */
	public function configureStyles($settings)
	{
		$blockFormats = [
			'Paragraph' => 'p',
			'Heading 1' => 'h1',
			'Heading 2' => 'h2',
			'Heading 3' => 'h3',
			'Heading 4' => 'h4',
			'Heading 5' => 'h5',
			'Heading 6' => 'h6',
		];
		$styleFormats = [
			[
				'title' => 'Display 1',
				'selector' => 'p, h1, h2, h3, h4, h5, h6',
				'classes' => 'display-1',
			],
			[
				'title' => 'Display 2',
				'selector' => 'p, h1, h2, h3, h4, h5, h6',
				'classes' => 'display-2',
			],
			[
				'title' => 'Display 3',
				'selector' => 'p, h1, h2, h3, h4, h5, h6',
				'classes' => 'display-3',
			],
			[
				'title' => 'Display 4',
				'selector' => 'p, h1, h2, h3, h4, h5, h6',
				'classes' => 'display-4',
			],
			[
				'title' => 'Display 5',
				'selector' => 'p, h1, h2, h3, h4, h5, h6',
				'classes' => 'display-5',
			],
			[
				'title' => 'Display 6',
				'selector' => 'p, h1, h2, h3, h4, h5, h6',
				'classes' => 'display-6',
			],
			[
				'title' => 'Lead text',
				'selector' => 'p',
				'classes' => 'lead',
			],
			[
				'title' => 'Small text',
				'selector' => 'p',
				'classes' => 'small',
			],
			[
				'title' => 'Lowercase text',
				'selector' => 'p',
				'classes' => 'text-lowercase',
			],
			[
				'title' => 'Uppercase text',
				'selector' => 'p',
				'classes' => 'text-uppercase',
			],
			[
				'title' => 'Capitalized text',
				'selector' => 'p',
				'classes' => 'text-capitalize',
			],
			[
				'title' => 'No text decoration',
				'selector' => 'p',
				'classes' => 'text-decoration-none',
			],
			[
				'title' => 'Text wrap',
				'selector' => 'p',
				'classes' => 'text-wrap',
			],
			[
				'title' => 'Primary color',
				'inline' => 'span',
				'classes' => 'text-primary',
			],
			[
				'title' => 'Primary button',
				'selector' => 'a',
				'classes' => 'btn btn-primary',
			],
			[
				'title' => 'Secondary button',
				'selector' => 'a',
				'classes' => 'btn btn-secondary',
			],
			[
				'title' => 'Inline list',
				'selector' => 'ul',
				'classes' => 'list-inline',
			],
		];
		$blockFormatsArr = [];
		foreach ($blockFormats as $title => $tag) {
			$blockFormatsArr[] = "$title=$tag";
		}
		$blockFormatsString = implode(';', $blockFormatsArr);
		$styleFormatsJson = json_encode($styleFormats);
		$settings = array_merge($settings, [
			'block_formats' => $blockFormatsString,
			'block_formats_merge' => false,
			'style_formats' => $styleFormatsJson,
			'style_formats_merge' => false,
			'apply_source_formatting' => false,
		]);
		return $settings;
	}

	public function softHyphenShortcode()
	{
		return '&shy;';
	}
}
