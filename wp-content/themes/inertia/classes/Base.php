<?php

namespace InertiaTheme;

class Base
{
	public function __construct()
	{
		add_action('after_setup_theme', [$this, 'onThemeActivation']);
		add_action('after_setup_theme', [$this, 'setupTheme']);
		add_action('after_setup_theme', [$this, 'addImageSizes']);
		add_filter('use_block_editor_for_post', '__return_false');

		add_action('init', [$this, 'disableEmailNotifications']);
		add_action('admin_init', [$this, 'disableDefaultPostsAdmin']);
		add_action('admin_menu', [$this, 'modifyAdminMenu']);
		add_action('admin_bar_menu', [$this, 'modifyAdminBar'], 99);
		add_action('customize_register', [$this, 'modifyCustomizer']);
		add_action('init', [$this, 'emailNotifications']);

		add_filter('use_block_editor_for_post', '__return_false');
		add_filter('intermediate_image_sizes', [$this, 'deleteImageSizes']);
		add_filter('acf/settings/remove_wp_meta_box', '__return_false');
	}

	public function onThemeActivation(): void
	{
		// Remove all 'post' type posts
		$default_posts = get_posts([
			'post_type' => 'post',
			'numberposts' => -1,
			'post_status' => 'publish',
		]);

		foreach ($default_posts as $post) {
			wp_delete_post($post->ID, true);
		}

		$comments = get_comments();
		foreach ($comments as $comment) {
			wp_delete_comment($comment->comment_ID, true);
		}
	}

	public function setupTheme(): void
	{
		add_theme_support('menus');
		add_post_type_support('page', 'excerpt');
		add_theme_support('post-thumbnails');
		add_filter('comments_open', '__return_false');
		load_theme_textdomain('jdev', get_template_directory() . '/languages');
	}

	public function addImageSizes()
	{
		$sizes = [
			[
				'2x' => true,
				'name' => 'post',
				'size' => 800,
				'sizeH' => 800,
			],
			// [
			// 	'2x' => false,
			// 	'name' => 'full',
			// 	'size' => 1920,
			// 	'sizeH' => 1920,
			// ],
			// [
			// 	'2x' => false,
			// 	'name' => 'full_2x',
			// 	'size' => 2560,
			// 	'sizeH' => 2560,
			// ],
			[
				// real full — не трогаем, не ресайзим
				'2x' => false,
				'name' => 'full', // WP original
				'size' => null, // no size
				'sizeH' => null,
				'skip' => true, // флаг пропуска
			],
		];

		foreach ($sizes as $size) {
			add_image_size($size['name'], $size['size'], $size['sizeH'] ?? 0);
			if ($size['2x']) {
				add_image_size($size['name'] . '2x', $size['size'] * 2, $size['sizeH'] ? $size['sizeH'] * 2 : 0);
			}
		}
	}

	public function disableEmailNotifications(): void
	{
		add_filter('auto_core_update_send_email', '__return_false');
		add_filter('auto_plugin_update_send_email', '__return_false');
		add_filter('auto_theme_update_send_email', '__return_false');

		remove_action('after_password_reset', 'wp_password_change_notification');
		remove_action('register_new_user', 'wp_send_new_user_notifications');
		remove_action('edit_user_created_user', 'wp_send_new_user_notifications');
	}

	public function modifyAdminMenu(): void
	{
		remove_menu_page('edit.php');
		remove_submenu_page('edit.php', 'post-new.php');
		remove_menu_page('edit-comments.php');
	}

	public function modifyAdminBar($adminBar): void
	{
		$adminBar->remove_node('new-content');
		$adminBar->remove_node('new-post');
		$adminBar->remove_node('comments');
	}

	public function disableDefaultPostsAdmin(): void
	{
		if (!is_admin()) {
			return;
		}

		global $pagenow;

		$isPostListScreen = $pagenow === 'edit.php' && empty($_GET['post_type']);
		$isPostCreateScreen = $pagenow === 'post-new.php' && empty($_GET['post_type']);
		$isPostEditScreen = $pagenow === 'post.php' && get_post_type((int) ($_GET['post'] ?? 0)) === 'post';

		if (!$isPostListScreen && !$isPostCreateScreen && !$isPostEditScreen) {
			return;
		}

		wp_safe_redirect(admin_url());
		exit;
	}

	public function modifyCustomizer($customizer): void
	{
		$customizer->remove_section('custom_css');
	}

	public function deleteImageSizes(array $sizes): array
	{
		return array_diff($sizes, ['medium_large', '1536x1536']);
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
}
