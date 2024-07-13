<?php
namespace JDEV;

/**
 * Class WC
 *
 * @package JDEV
 */
class WC
{
	public function __construct()
	{
		add_action('template_redirect', [$this, 'conditionally_remove_wc_assets']);
		add_filter('woocommerce_enqueue_styles', [$this, 'conditionally_woocommerce_enqueue_styles']);
		add_action('wp_enqueue_scripts', [$this, 'conditionally_wp_enqueue_scripts']);
	}

	// $twig->addFunction(new TwigFunction('timber_set_product', [$this, 'timber_set_product']));

	/**
	 * Callback function that returns true if the current page is a WooCommerce page or false if otherwise.
	 *
	 * @return boolean true for WC pages and false for non WC pages
	 */
	public function is_wc_page()
	{
		return class_exists('WooCommerce') && (is_woocommerce() || is_cart() || is_checkout() || is_account_page());
	}

	/**
	 * Remove WC stuff on non WC pages.
	 */
	public function conditionally_remove_wc_assets()
	{
		// if this is a WC page, abort.
		if ($this->is_wc_page()) {
			return;
		}

		// remove WC generator tag
		remove_filter('get_the_generator_html', 'wc_generator_tag', 10, 2);
		remove_filter('get_the_generator_xhtml', 'wc_generator_tag', 10, 2);

		// unload WC scripts
		remove_action('wp_enqueue_scripts', ['WC_Frontend_Scripts', 'load_scripts']);
		remove_action('wp_print_scripts', ['WC_Frontend_Scripts', 'localize_printed_scripts'], 5);
		remove_action('wp_print_footer_scripts', ['WC_Frontend_Scripts', 'localize_printed_scripts'], 5);

		// remove "Show the gallery if JS is disabled"
		remove_action('wp_head', 'wc_gallery_noscript');

		// remove WC body class
		remove_filter('body_class', 'wc_body_class');
	}

	/**
	 * Unload WC stylesheets on non WC pages
	 *
	 * @param array $enqueue_styles
	 * @return array
	 */
	public function conditionally_woocommerce_enqueue_styles($enqueue_styles)
	{
		return $this->is_wc_page() ? $enqueue_styles : [];
	}

	/**
	 * Remove inline style and specific scripts on non WC pages
	 */
	public function conditionally_wp_enqueue_scripts()
	{
		if (!$this->is_wc_page()) {
			wp_dequeue_style('woocommerce-inline');
			wp_dequeue_script('wc-order-attribution'); // Ensure this handle matches the script you want to dequeue
		}
	}

	/**
	 * Remove custom WC action
	 */
	public function remove_wc_custom_action()
	{
		remove_action('wp_head', 'wc_gallery_noscript');
	}

	// public function timber_set_product($post)
	// {
	// 	global $product;

	// 	if (is_woocommerce()) {
	// 		$product = wc_get_product($post->ID);
	// 	}
	// }
}
