<?php
namespace JDEV;

/**
 * Class Deregister
 *
 * @package JDEV
 */
class Deregister
{
	public function __construct()
	{
		add_action('wp_enqueue_scripts', [$this, 'disable_woocommerce_assets'], 100);
		add_action('wp', [$this, 'disable_woocommerce_hooks'], 99);
		add_action('widgets_init', [$this, 'unregister_woocommerce_widgets'], 20);
		add_action('wp', [$this, 'completely_disable_woocommerce'], 20);
		add_action('wp_enqueue_scripts', [$this, 'disable_block_library_styles'], 100);
		add_action('wp_enqueue_scripts', [$this, 'disable_all_woocommerce_assets'], 100);
		add_action('init', [$this, 'disable_wp_emojicons']);
		add_action('wp_enqueue_scripts', [$this, 'disable_global_styles_and_block_supports'], 100);
		add_action('init', [$this, 'disable_unwanted_assets']);
		add_action('wp_enqueue_scripts', [$this, 'disable_inline_styles'], 100);
		add_action('wp_enqueue_scripts', [$this, 'disable_woocommerce_fonts'], 100);
		add_action('init', [$this, 'remove_unwanted_meta_tags']);
		add_action('wp_enqueue_scripts', [$this, 'disable_woocommerce_inline_styles_scripts'], 100);
		// add_action('wp_enqueue_scripts', [$this, 'disable_all_unwanted_assets'], 100);
		// add_action('init', [$this, 'disable_all_unwanted_assets']);
		add_action('wp_enqueue_scripts', [$this, 'disable_inline_styles_and_fonts'], 100);
		add_action('wp_enqueue_scripts', [$this, 'disable_noscript_inline_styles'], 100);
	}

	public function disable_woocommerce_assets()
	{
		if (!is_admin()) {
			wp_dequeue_style('woocommerce-general');
			wp_dequeue_style('woocommerce-layout');
			wp_dequeue_style('woocommerce-smallscreen');
			wp_dequeue_script('wc-cart-fragments');
			wp_dequeue_script('wc-add-to-cart');
			wp_dequeue_script('wc-cart');
			wp_dequeue_script('wc-checkout');
			wp_dequeue_script('wc-country-select');
			wp_dequeue_script('wc-payment');
			wp_dequeue_script('wc-address-i18n');
			wp_dequeue_script('wc-quantity-input');
			wp_deregister_script('woocommerce');
			wp_deregister_script('wc-add-to-cart-variation');
			wp_dequeue_style('wc-blocks-style');
			wp_dequeue_script('order-attribution');
			wp_dequeue_script('sourcebuster');
			wp_deregister_style('wc-blocks-style');
			wp_deregister_script('order-attribution');
			wp_deregister_script('sourcebuster');
		}
	}

	public function disable_woocommerce_hooks()
	{
		if (!is_admin()) {
			remove_action('woocommerce_before_main_content', 'woocommerce_output_content_wrapper', 10);
			remove_action('woocommerce_after_main_content', 'woocommerce_output_content_wrapper_end', 5);
			remove_action('woocommerce_sidebar', 'woocommerce_get_sidebar', 10);
			remove_action('woocommerce_before_cart', 'woocommerce_output_all_notices', 10);
			remove_action('woocommerce_before_checkout_form', 'woocommerce_output_all_notices', 10);
		}
	}

	public function unregister_woocommerce_widgets()
	{
		if (!is_admin()) {
			unregister_widget('WC_Widget_Cart');
			unregister_widget('WC_Widget_Layered_Navigation');
			unregister_widget('WC_Widget_Products');
			unregister_widget('WC_Widget_Product_Categories');
			unregister_widget('WC_Widget_Product_Tag_Cloud');
		}
	}

	public function completely_disable_woocommerce()
	{
		if (!is_admin()) {
			remove_action('wp_enqueue_scripts', ['WC_Scripts', 'scripts'], 10);
			remove_action('wp_enqueue_scripts', ['WC_Scripts', 'styles'], 10);
			remove_action('woocommerce_before_main_content', 'woocommerce_output_content_wrapper', 10);
			remove_action('woocommerce_after_main_content', 'woocommerce_output_content_wrapper_end', 5);
			remove_action('woocommerce_sidebar', 'woocommerce_get_sidebar', 10);
		}
	}

	public function disable_block_library_styles()
	{
		if (!is_admin()) {
			wp_dequeue_style('wp-block-library');
			wp_dequeue_style('wp-block-library-theme');
			wp_dequeue_style('wc-blocks-vendors-style');
		}
	}

	public function disable_all_woocommerce_assets()
	{
		if (!is_admin()) {
			global $wp_styles, $wp_scripts;
			foreach ($wp_styles->registered as $handle => $data) {
				if (strpos($data->src, 'woocommerce') !== false) {
					wp_dequeue_style($handle);
					wp_deregister_style($handle);
				}
			}

			foreach ($wp_scripts->registered as $handle => $data) {
				if (strpos($data->src, 'woocommerce') !== false) {
					wp_dequeue_script($handle);
					wp_deregister_script($handle);
				}
			}
		}
	}

	public function disable_wp_emojicons()
	{
		remove_action('wp_head', 'print_emoji_detection_script', 7);
		remove_action('wp_print_styles', 'print_emoji_styles');
		remove_action('admin_print_styles', 'print_emoji_styles');
		remove_action('admin_print_scripts', 'print_emoji_detection_script');
		remove_filter('wp_mail', 'wp_staticize_emoji_for_email');
		remove_filter('the_content_feed', 'wp_staticize_emoji');
		remove_filter('comment_text_rss', 'wp_staticize_emoji');
	}

	public function disable_global_styles_and_block_supports()
	{
		if (!is_admin()) {
			remove_action('wp_enqueue_scripts', 'wp_enqueue_global_styles');
			remove_action('wp_body_open', 'wp_global_styles_render_svg_filters');
			wp_dequeue_style('global-styles');
			wp_dequeue_style('core-block-supports');
		}
	}

	public function disable_unwanted_assets()
	{
		if (!is_admin()) {
			$this->disable_wp_emojicons();
			$this->disable_global_styles_and_block_supports();
		}
	}

	public function disable_inline_styles()
	{
		if (!is_admin()) {
			wp_dequeue_style('classic-theme-styles-inline-css');
			wp_dequeue_style('woocommerce-inline-inline-css');
			wp_dequeue_style('core-block-supports-inline-css');
		}
	}

	public function disable_woocommerce_fonts()
	{
		if (!is_admin()) {
			wp_dequeue_style('wp-fonts-local');
		}
	}

	public function remove_unwanted_meta_tags()
	{
		remove_action('wp_head', 'rest_output_link_wp_head');
		remove_action('wp_head', 'wp_shortlink_wp_head');
		remove_action('wp_head', 'rsd_link');
		remove_action('wp_head', 'wp_oembed_add_discovery_links');
		remove_action('wp_head', 'wp_oembed_add_host_js');
	}

	public function disable_woocommerce_inline_styles_scripts()
	{
		if (!is_admin()) {
			remove_action('wp_footer', 'woocommerce_output_product_gallery_styles', 10);
			wp_deregister_style('woocommerce-inline-inline-css');
		}
	}

	public function disable_noscript_inline_styles()
	{
		remove_action('wp_footer', 'woocommerce_output_product_gallery_styles', 10);
	}

	public function disable_inline_styles_and_fonts()
	{
		if (!is_admin()) {
			$this->disable_inline_styles();
			$this->disable_woocommerce_fonts();
		}
	}

	public static function init()
	{
		$instance = new self();
	}
}
