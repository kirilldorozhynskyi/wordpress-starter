<?php

namespace InertiaTheme;

class Deregister
{
	public function __construct()
	{
		add_action('init', [$this, 'disableWpEmojicons']);
		add_action('init', [$this, 'removeUnwantedMetaTags']);
		add_action('wp_enqueue_scripts', [$this, 'disableBlockLibraryStyles'], 100);
		add_action('wp_enqueue_scripts', [$this, 'disableGlobalStylesAndBlockSupports'], 100);
		add_action('wp_enqueue_scripts', [$this, 'disableWpmlLanguageSwitcherCss'], 200);

		add_filter('should_load_separate_core_block_assets', '__return_false');
		add_action(
			'wp_enqueue_scripts',
			static function () {
				wp_dequeue_style('classic-theme-styles');
			},
			20,
		);
	}

	public function disableWpEmojicons(): void
	{
		remove_action('wp_head', 'print_emoji_detection_script', 7);
		remove_action('wp_print_styles', 'print_emoji_styles');
		remove_action('admin_print_styles', 'print_emoji_styles');
		remove_action('admin_print_scripts', 'print_emoji_detection_script');
		remove_filter('wp_mail', 'wp_staticize_emoji_for_email');
		remove_filter('the_content_feed', 'wp_staticize_emoji');
		remove_filter('comment_text_rss', 'wp_staticize_emoji');
	}

	public function removeUnwantedMetaTags(): void
	{
		remove_action('wp_head', 'rest_output_link_wp_head');
		remove_action('wp_head', 'wp_shortlink_wp_head');
		remove_action('wp_head', 'rsd_link');
		remove_action('wp_head', 'wp_oembed_add_discovery_links');
		remove_action('wp_head', 'wp_oembed_add_host_js');
	}

	public function disableBlockLibraryStyles(): void
	{
		if (is_admin()) {
			return;
		}

		wp_dequeue_style('wp-block-library');
		wp_dequeue_style('wp-block-library-theme');
		wp_dequeue_style('wc-blocks-vendors-style');
	}

	public function disableGlobalStylesAndBlockSupports(): void
	{
		if (is_admin()) {
			return;
		}

		remove_action('wp_enqueue_scripts', 'wp_enqueue_global_styles');
		remove_action('wp_body_open', 'wp_global_styles_render_svg_filters');
		wp_dequeue_style('global-styles');
		wp_dequeue_style('core-block-supports');
	}

	public function disableWpmlLanguageSwitcherCss(): void
	{
		if (is_admin()) {
			return;
		}

		global $wp_styles;

		if (!isset($wp_styles) || empty($wp_styles->registered)) {
			return;
		}

		foreach ($wp_styles->registered as $handle => $data) {
			$src = isset($data->src) ? (string) $data->src : '';
			if ($src && strpos($src, 'plugins/sitepress-multilingual-cms/templates/language-switchers/legacy-list-vertical/style.min.css') !== false) {
				wp_dequeue_style($handle);
				wp_deregister_style($handle);
			}
		}

		add_filter('wpml_ls_load_css', '__return_false');
	}
}
