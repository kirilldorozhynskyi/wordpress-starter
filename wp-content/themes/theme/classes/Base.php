<?php

namespace JDEV;

use Timber\Site;

/**
 * Class Base
 *
 * @package JDEV
 */
class Base
{
	public function __construct()
	{
		$this->addThemeActionsAndFilters();
	}

	protected function addThemeActionsAndFilters(): void
	{
		add_action('after_setup_theme', [$this, 'setupTheme']);
		add_filter('use_block_editor_for_post', '__return_false');
		add_action('init', [$this, 'emailNotifications']);
		add_action('admin_menu', [$this, 'modifyAdminMenu']);
		add_action('admin_bar_menu', [$this, 'modifyAdminBar'], 99);
		add_action('customize_register', [$this, 'modifyCustomizer']);
		add_filter('image_resize_dimensions', '__return_false');
		add_filter('intermediate_image_sizes', [$this, 'deleteImageSizes']);
		add_filter('acf/settings/remove_wp_meta_box', '__return_false');
	}

	/**
	 * Setup theme
	 */
	public function setupTheme(): void
	{
		add_theme_support('menus');
		// add_theme_support('title-tag');
		add_post_type_support('page', 'excerpt');
		add_theme_support('post-thumbnails');
		// add_theme_support('woocommerce');
		// add_post_type_support('news', 'thumbnail');
		load_theme_textdomain('jdev', get_template_directory() . '/languages');

		$sizes = []; // Add your sizes here
		foreach ($sizes as $size) {
			add_image_size($size['name'], $size['size'], $size['sizeH'] ?? 0);
			add_image_size($size['name'] . '2x', $size['size'] * 2, $size['sizeH'] ? $size['sizeH'] * 2 : 0);
		}
	}

	/**
	 * Disable email notifications for admin
	 */
	public function emailNotifications(): void
	{
		// updates
		add_filter('auto_core_update_send_email', '__return_false');
		add_filter('auto_plugin_update_send_email', '__return_false');
		add_filter('auto_theme_update_send_email', '__return_false');
		// password reset
		remove_action('after_password_reset', 'wp_password_change_notification');
		// new user registration
		remove_action('register_new_user', 'wp_send_new_user_notifications');
		remove_action('edit_user_created_user', 'wp_send_new_user_notifications');
		// Uncomment if you want to re-enable notifications for new user registration
		// add_action('register_new_user', fn($user_id) => wp_send_new_user_notifications($user_id, 'user'));
		// add_action('edit_user_created_user', fn($user_id) => wp_send_new_user_notifications($user_id, 'user'));
	}

	/**
	 * Modify admin menu
	 */
	public function modifyAdminMenu(): void
	{
		remove_menu_page('edit.php');
		remove_menu_page('edit-comments.php');
	}

	/**
	 * Modify admin bar
	 *
	 * @param $adminBar
	 */
	public function modifyAdminBar($adminBar): void
	{
		$adminBar->remove_node('new-content');
		$adminBar->remove_node('comments');
	}

	/**
	 * Modify appearance > customize menu items
	 *
	 * @param $customizer
	 */
	public function modifyCustomizer($customizer): void
	{
		$customizer->remove_section('custom_css');
	}

	/**
	 * Get Timber language and fix it to ISO 639-1 standard to prevent SEO warnings
	 *
	 * @param $fallbackLanguage
	 * @return string
	 */
	public function getSiteLanguage(): string
	{
		$site = new Site();
		$siteLanguage = strtolower($site->language);
		return $siteLanguage ? explode('_', $siteLanguage)[0] : 'de';
	}

	/**
	 * Remove unnecessary image sizes
	 *
	 * @param array $sizes
	 * @return array
	 */
	public function deleteImageSizes($sizes): array
	{
		return array_diff($sizes, ['medium_large', 'large', '1536x1536', '2048x2048', 'thumbnail']);
	}
}
