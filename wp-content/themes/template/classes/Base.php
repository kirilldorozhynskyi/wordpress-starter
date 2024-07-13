<?php

namespace JDEV;

use Timber\Image;
use Timber\ImageHelper;
use Timber\Menu;
use Timber\Site;
use Timber\Timber;
use Twig\Environment;
use Twig\TwigFilter;
use Twig\TwigFunction;

require ABSPATH . '/vendor/autoload.php';

/**
 * Class Base
 *
 * @package JDEV
 */
class Base
{
	const VITE_MANIFEST_PATH = '/resources/Public/Build/.vite/manifest.json';

	/**
	 * @var array
	 */
	protected array $viteManifest = [];

	public function __construct()
	{
		$this->removeEmojiSupport();
		$this->addThemeActionsAndFilters();
		$this->loadViteManifest();
	}

	protected function removeEmojiSupport(): void
	{
		remove_action('admin_print_styles', 'print_emoji_styles');
		remove_action('admin_print_scripts', 'print_emoji_detection_script');
		remove_action('wp_print_styles', 'print_emoji_styles');
		remove_action('wp_head', 'print_emoji_detection_script', 7);
	}

	protected function addThemeActionsAndFilters(): void
	{
		add_filter('script_loader_tag', [$this, 'addModuleTypeToViteScript'], 10, 3);
		add_filter('script_loader_tag', [$this, 'addModuleTypeToViteSprite'], 10, 3);
		add_action('wp_footer', [$this, 'loadBodyThemeAssets']);
		add_action('admin_enqueue_scripts', [$this, 'loadAdminThemeAssets']);
		add_action('init', [$this, 'email_notifications']);
		add_action('admin_menu', [$this, 'modifyAdminMenu']);
		add_action('admin_bar_menu', [$this, 'modifyAdminBar'], 99);
		add_action('customize_register', [$this, 'modifyCustomizer']);
		add_action('admin_init', [$this, 'modifyEditorCapabilities']);
		add_action('map_meta_cap', [$this, 'modifyPrivacyPolicyCapabilities'], 1, 3);
		add_action('after_setup_theme', [$this, 'setupTheme']);
		add_action('wp_print_styles', [$this, 'unloadDefaultAssets']);
		add_action('wp_enqueue_scripts', [$this, 'loadHeadThemeAssets']);
		add_filter('image_resize_dimensions', '__return_false');
		add_filter('timber/context', [$this, 'addToContext']);
		add_filter('timber/twig', [$this, 'addToTwig']);
		add_filter('the_password_form', [$this, 'passwordForm']);
		add_filter('upload_mimes', [$this, 'enable_vcard_upload']);
		add_filter('intermediate_image_sizes', [$this, 'deleteImageSizes']);
		add_filter('acf/settings/remove_wp_meta_box', '__return_false');
	}

	protected function loadViteManifest($manifestPath = ''): void
	{
		if (!file_exists(ABSPATH . 'hot')) {
			$manifestPath = $manifestPath ?: get_template_directory() . self::VITE_MANIFEST_PATH;
			$manifestContent = file_get_contents($manifestPath);

			if (!$manifestContent) {
				throw new \Exception(sprintf('[Vite] Failed to read manifest %s.', $manifestPath));
			}

			$this->viteManifest = json_decode($manifestContent, true);

			if (json_last_error()) {
				throw new \Exception(sprintf('[Vite] Manifest %s contains invalid data.', $manifestPath));
			}
		}
	}

	public function addModuleTypeToViteScript($tag, $handle, $src): string
	{
		if (file_exists(ABSPATH . 'hot') && ($handle === 'app_theme' || $handle === 'vite_client')) {
			$tag = '<script type="module" src="' . esc_url($src) . '"></script>';
		} elseif ($handle === 'app') {
			$src = remove_query_arg('ver', $src);
			$tag = '<script type="module" src="' . esc_url($src) . '"></script>';
		}
		return $tag;
	}

	public function addModuleTypeToViteSprite($tag, $handle, $src): string
	{
		if (file_exists(ABSPATH . 'hot') && ($handle === 'app_theme_sprite' || $handle === 'vite_client')) {
			$tag = '<script type="module" src="' . esc_url($src) . '"></script>';
		}
		return $tag;
	}

	/**
	 * Disable email notifications for admin
	 */
	public function email_notifications(): void
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

	/*
	 * Modify appearance > customize menu items
	 *
	 * @param $customizer
	 */
	public function modifyCustomizer($customizer): void
	{
		$customizer->remove_section('custom_css');
	}

	/*
	 * Modify editor's capabilities
	 */
	public function modifyEditorCapabilities(): void
	{
		$editor = get_role('editor');
		if ($editor) {
			$editor->remove_cap('manage_options');
			$editor->add_cap('edit_theme_options');
			$editor->add_cap('rocket_purge_posts');
			$editor->add_cap('rocket_purge_cache');
			$editor->add_cap('rocket_purge_opcache');
			$editor->add_cap('rocket_preload_cache');
		}
	}

	/*
	 * Modify capabilities for editing privacy policy page
	 *
	 * @param $capabilities
	 * @param $capability
	 * @param $userId
	 * @return array
	 */
	public function modifyPrivacyPolicyCapabilities($capabilities, $capability, $userId): array
	{
		if (!is_user_logged_in()) {
			return $capabilities;
		}

		$user = get_userdata($userId);
		if ($user && array_intersect(['administrator', 'editor'], $user->roles)) {
			if ($capability === 'manage_privacy_options') {
				$capabilities = array_diff($capabilities, ['manage_options']);
			}
		}

		return $capabilities;
	}

	/**
	 * Setup theme
	 */
	public function setupTheme(): void
	{
		add_theme_support('menus');
		add_theme_support('title-tag');
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
	 * Unload default WP styles and scripts
	 */
	public function unloadDefaultAssets(): void
	{
		// styles
		wp_deregister_style('wp-block-library');
		wp_deregister_style('wp-block-library-theme');
		wp_deregister_style('wp-block-style');
		// scripts
		wp_deregister_script('wp-embed');
		wp_deregister_script('jquery');
	}

	/**
	 * Load theme styles
	 */
	public function loadHeadThemeAssets(): void
	{
		if (empty($this->viteManifest['wp-content/themes/template/resources/Private/Vue/app.ts']['css'])) {
			return;
		}

		foreach ($this->viteManifest['wp-content/themes/template/resources/Private/Vue/app.ts']['css'] as $css) {
			wp_enqueue_style('stylesheet', get_template_directory_uri() . '/resources/Public/Build/' . $css, [], false);
		}
	}

	/**
	 * Load theme scripts
	 */
	public function loadBodyThemeAssets(): void
	{
		// JS
		if (file_exists(ABSPATH . 'hot')) {
			$url = file_get_contents(ABSPATH . 'hot');
			$app = $url . '/wp-content/themes/template/resources/Private/Vue/app.ts';
			$spritemap = $url . '/@vite-plugin-svg-spritemap/client';
			$version = time();

			wp_enqueue_script('app_theme_sprite', $spritemap, [], null, false);
			wp_enqueue_script('app_theme', $app, [], $version, true);
		} else {
			// wp_enqueue_script('vendors', get_template_directory_uri() . '/resources/Public/' . (wp_get_environment_type() === 'production' ? 'Production' : 'Development') . '/js/chunk-vendors.js', [], false, true);
			wp_enqueue_script(
				'app',
				get_template_directory_uri() .
					'/resources/Public/Build/' .
					$this->viteManifest['wp-content/themes/template/resources/Private/Vue/app.ts']['file'],
				[],
				false,
				true,
			);
		}
	}

	public function loadAdminThemeAssets(): void
	{
		$screen = get_current_screen();
		if ($screen->is_block_editor) {
			if (file_exists(ABSPATH . 'hot')) {
				$url = file_get_contents(ABSPATH . 'hot');
				$app = $url . '/wp-content/themes/template/resources/Private/Vue/app.ts';
				$spritemap = $url . '/@vite-plugin-svg-spritemap/client';
				$version = time();

				wp_enqueue_script('app_theme_sprite', $spritemap, [], null, false);
				wp_enqueue_script('app_theme', $app, [], $version, true);
			} else {
				if (empty($this->viteManifest['wp-content/themes/template/resources/Private/Vue/app.ts']['css'])) {
					return;
				}

				foreach ($this->viteManifest['wp-content/themes/template/resources/Private/Vue/app.ts']['css'] as $css) {
					wp_enqueue_style('stylesheet', get_template_directory_uri() . '/resources/Public/Build/' . $css, [], false);
				}
			}
		}
	}

	public function addToContext($context): array
	{
		$context['site'] = new Site();
		$context['pageTitle'] = get_the_title();
		$context['options'] = get_fields('options');
		$context['menu'] = [
			'main' => Timber::get_menu('main-menu'),
			'footer' => Timber::get_menu('footer-menu'),
			'languages' => $this->getLanguages(),
		];
		return $context;
	}

	/**
	 * Get WPML languages for custom lang nav
	 *
	 * @return array
	 */
	function getLanguages()
	{
		$languages = apply_filters('wpml_active_languages', null, 'skip_missing=0&orderby=id&order=asc');
		return $languages;
	}

	/**
	 * Add to Twig's context
	 *
	 * @param $twig
	 * @return Environment
	 */
	public function addToTwig($twig): Environment
	{
		$twig->addFunction(new TwigFunction('getSiteLanguage', [$this, 'getSiteLanguage']));
		$twig->addFunction(new TwigFunction('getBreadcrumbs', [$this, 'getBreadcrumbs']));
		$twig->addFunction(new TwigFunction('getImagePlaceholder', [$this, 'getImagePlaceholder']));
		$twig->addFunction(new TwigFunction('getFavicon', [$this, 'getFavicon']));
		$twig->addFunction(new TwigFunction('isChildOf', [$this, 'isChildOf']));
		$twig->addFunction(new TwigFunction('setType', [$this, 'setType']));
		$twig->addFunction(new TwigFunction('truncateText', [$this, 'truncateText']));
		$twig->addFunction(new TwigFunction('renderCE', [$this, 'renderCE']));
		$twig->addFunction(new TwigFunction('youtubeIframeSrc', [$this, 'youtubeIframeSrc']));
		$twig->addFunction(new TwigFunction('vimeoIframeSrc', [$this, 'vimeoIframeSrc']));
		$twig->addFunction(new TwigFunction('button', [$this, 'button']));
		$twig->addFunction(new TwigFunction('GetImage', [$this, 'GetImage']));
		$twig->addFunction(new TwigFunction('sprite', [$this, 'sprite']));

		$twig->addFilter(new TwigFilter('mailLink', [$this, 'mailLink']));
		$twig->addFilter(new TwigFilter('phoneLink', [$this, 'phoneLink']));
		$twig->addFilter(new TwigFilter('antiSpam', [$this, 'antiSpam']));

		return $twig;
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

	public function getBreadcrumbs($startFromLevel = 0): array
	{
		$breadcrumbs = [];
		$post = get_post();

		while ($post) {
			$breadcrumbs[] = [
				'id' => $post->ID,
				'title' => $post->post_title,
				'link' => get_permalink($post),
			];
			$post = $post->post_parent ? get_post($post->post_parent) : null;
		}

		if (!is_front_page() && array_key_exists('HOME', PAGES) && get_post_status(PAGES['HOME']) == 'publish') {
			$breadcrumbs[] = [
				'id' => PAGES['HOME'],
				'title' => get_the_title(PAGES['HOME']),
				'link' => get_permalink(PAGES['HOME']),
			];
		}

		return array_reverse(array_splice($breadcrumbs, $startFromLevel));
	}

	public function getImagePlaceholder($size): string
	{
		$sizes = explode(', ', $size);
		$width = $sizes[0];
		$height = $sizes[1] ?? $width;
		return "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 $width $height'%3E%3C/svg%3E";
	}

	/**
	 * Get Favicon
	 */
	public function getFavicon(): string
	{
		if (file_exists(ABSPATH . 'hot')) {
			return '';
		}

		$path = get_template_directory_uri() . '/resources/Public/Build/';
		$extpath = get_template_directory_uri() . '/resources/Public/';
		$ext = get_template_directory() . '/resources/Public/';
		$webmanifest = str_replace('assets/', '', $this->viteManifest['manifest.webmanifest']['file']);

		if (!file_exists($ext . $webmanifest)) {
			$files = glob($ext . '/*');
			foreach ($files as $file) {
				if (is_file($file)) {
					unlink($file);
				}
			}

			$manifestContent = file_get_contents($path . $this->viteManifest['manifest.webmanifest']['file']);
			$json = json_decode(str_replace('/assets/', $path . 'assets/', $manifestContent));
			$json->name = get_bloginfo();
			$json->short_name = get_bloginfo();
			$json->description = get_bloginfo('description');
			$json->lang = get_locale();
			$json->background_color = get_fields('options')['general_background_color'];
			$json->theme_color = get_fields('options')['general_theme_color'];
			file_put_contents($ext . $webmanifest, json_encode($json));
		}

		$context['fav'] = [
			'manifest' => $extpath . $webmanifest,
			'theme_color' => get_fields('options')['general_theme_color'] ?? '#000000',
			'favicons' => [
				'favicon-16x16.png' => $path . $this->viteManifest['favicon-16x16.png']['file'],
				'favicon-32x32.png' => $path . $this->viteManifest['favicon-32x32.png']['file'],
				'favicon-48x48.png' => $path . $this->viteManifest['favicon-48x48.png']['file'],
				'favicon.ico' => $path . $this->viteManifest['favicon.ico']['file'],
			],
			'apple' => [
				'apple-touch-icon-1024x1024.png' => $path . $this->viteManifest['apple-touch-icon-1024x1024.png']['file'],
				'apple-touch-icon-114x114.png' => $path . $this->viteManifest['apple-touch-icon-114x114.png']['file'],
				'apple-touch-icon-120x120.png' => $path . $this->viteManifest['apple-touch-icon-120x120.png']['file'],
				'apple-touch-icon-144x144.png' => $path . $this->viteManifest['apple-touch-icon-144x144.png']['file'],
				'apple-touch-icon-152x152.png' => $path . $this->viteManifest['apple-touch-icon-152x152.png']['file'],
				'apple-touch-icon-167x167.png' => $path . $this->viteManifest['apple-touch-icon-167x167.png']['file'],
				'apple-touch-icon-180x180.png' => $path . $this->viteManifest['apple-touch-icon-180x180.png']['file'],
				'apple-touch-icon-57x57.png' => $path . $this->viteManifest['apple-touch-icon-57x57.png']['file'],
				'apple-touch-icon-60x60.png' => $path . $this->viteManifest['apple-touch-icon-60x60.png']['file'],
				'apple-touch-icon-72x72.png' => $path . $this->viteManifest['apple-touch-icon-72x72.png']['file'],
				'apple-touch-icon-76x76.png' => $path . $this->viteManifest['apple-touch-icon-76x76.png']['file'],
			],
		];
		return Timber::compile('partials/elements/favicon.twig', $context);
	}

	/**
	 * Determines if current post is child of given parent post ID
	 *
	 * @param $pid
	 * @return boolean
	 */
	public function isChildOf($pid): bool
	{
		$queriedObject = get_queried_object();
		if ($queriedObject->ID == $pid) {
			return true;
		}

		$ancestors = get_post_ancestors($queriedObject->ID);
		return in_array($pid, $ancestors, true);
	}

	/**
	 * Set the type of a value to given type
	 *
	 * @param $value
	 * @param $type
	 * @return mixed
	 */
	public function setType($value, $type)
	{
		settype($value, $type);
		return $value;
	}

	/**
	 * Truncate text by number of chars and add ellipsis sign to the end
	 *
	 * @param $text
	 * @param $chars
	 * @param $ellipsis
	 * @return string
	 */
	public function truncateText($text, $chars, $ellipsis = '…'): string
	{
		return strlen($text) <= $chars ? $text : mb_substr(strip_tags($text), 0, $chars) . $ellipsis;
	}

	/**
	 * Render content elements
	 *
	 * @param $elements
	 * @param $gridElName
	 * @param $postId
	 * @return string
	 */
	public function renderCE($elements, $gridElName = null, $postId = null, $page = null): string
	{
		$elements = $gridElName ? $elements : get_field($elements, $postId);
		if (!$elements || !is_array($elements) || !count($elements)) {
			return '';
		}

		$queriedObject = get_queried_object();
		if (!$postId) {
			if (is_archive()) {
				$term = get_term($queriedObject);
				if ($term) {
					$postId = $term->taxonomy . '_' . $term->term_taxonomy_id;
				}
			} else {
				$post = get_post($queriedObject);
				if ($post) {
					$postId = $post->ID;
				}
			}
		}

		$context = Timber::context();
		$render = '';
		foreach ($elements as $key => $fields) {
			$context['ce'] = [
				'id' => $queriedObject->ID . $key . ($gridElName ? rand(0, 999) : ''),
				'gridElName' => $gridElName ?: false,
				'page' => $page,
			];
			foreach ($fields as $name => $value) {
				$context['ce'][$name] = $value;
			}
			$render .= Timber::compile('elements/' . $fields['acf_fc_layout'] . '/' . $fields['acf_fc_layout'] . '.twig', $context);
		}
		return $render;
	}

	/**
	 * Create iframe `src` attribute from given youtube url
	 *
	 * @param $url
	 * @param $playInBackground
	 * @return string
	 */
	public function youtubeIframeSrc($url, $playInBackground = false): string
	{
		preg_match('/^.*(?:(?:youtu\.be\/|v\/|vi\/|u\/\w\/|embed\/)|(?:(?:watch)?\?v(?:i)?=|&v(?:i)?=))([^#&?]*).*/', $url, $videoIdArray);
		$parameters =
			'?autohide=1&rel=0&enablejsapi=1&rel=0&showinfo=0' . ($playInBackground ? '&autoplay=1&loop=1&mute=1&controls=0&playlist=' . $videoIdArray[1] : '');
		$siteUrl = 'http' . (isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] === 'on' ? 's' : '') . '://' . $_SERVER['SERVER_NAME'];
		return 'https://www.youtube-nocookie.com/embed/' . $videoIdArray[1] . $parameters . '&origin=' . urlencode($siteUrl);
	}

	/**
	 * Create iframe `src` attribute from given vimeo url
	 *
	 * @param $url
	 * @param $playInBackground
	 * @return string
	 */
	public function vimeoIframeSrc($url, $playInBackground = false): string
	{
		preg_match('/(https?:\/\/)?(www\.)?(player\.)?vimeo\.com\/([a-z]*\/)*([0-9]{6,11})[?]?.*/', $url, $videoIdArray);
		$parameters = '?title=0&byline=0&portrait=0' . ($playInBackground ? '&autoplay=1&muted=1&loop=1&background=1&api=1' : '');
		return 'https://player.vimeo.com/video/' . $videoIdArray[5] . $parameters;
	}

	/**
	 * Create button
	 *
	 * @param $button
	 * @return array
	 */
	public function button($button = false, $class = false, $icon = false, $span = false): string
	{
		if ($button) {
			$context['button'] = [
				'class' => $class,
				'btn' => $button,
				'icon' => $icon,
				'span' => $span,
			];
			return Timber::compile('components/_button.twig', $context);
		}
		return '';
	}

	/**
	 * Create sprite
	 *
	 * @param $sprite
	 * @return array
	 */
	public function sprite($id, $class = false): string
	{
		$path = file_exists(ABSPATH . 'hot') ? '' : get_template_directory_uri() . '/resources/Public/Build/' . $this->viteManifest['spritemap.svg']['file'];
		$class = $class ? ' ' . $class : '';
		return '<svg class="sprite-icon icon-' .
			$id .
			$class .
			'" aria-hidden="true" focusable="false"><use xlink:href="' .
			$path .
			'#icon-' .
			$id .
			'"></use></svg>';
	}

	/**
	 * Create image
	 *
	 * @param $image
	 * @return array
	 */
	public function GetImage($img, $size = false, $class = false, $lazyLoad = true, $bg = false, $is_preview = false): string
	{
		if (count($size) === 1) {
			$normal_size = [$size[0], 0];
			$height = $size[0] * 2 > 2560 ? 2560 : $size[0] * 2;
			$retina_size = [$height, 0];
		} elseif (count($size) === 2) {
			$normal_size = $size;
			if ($size[0] * 2 > 2560) {
				$height = 2560;
				$width = (2560 / $size[0]) * $size[1];
			} else {
				$height = $size[0] * 2;
				$width = $size[1] * 2;
			}
			$retina_size = [$height, $width];
		} else {
			$normal_size = '';
			$retina_size = '';
		}

		$context['image'] = [
			'img' => $img,
			'class' => $class,
			'size' => $normal_size,
			'width' => $size[0] ?? '',
			'height' => $size[1] ?? '',
			'retina_size' => $retina_size,
			'lazyLoad' => $lazyLoad,
			'bg' => $bg,
			'is_preview' => $is_preview,
		];
		return Timber::compile('components/_image.twig', $context);
	}

	public function mailLink($mail): string
	{
		return 'mailto:' . strtolower(preg_replace('/\s+/', '', $mail));
	}

	/**
	 * Create href with `tel:` prefix and phone number without spaces
	 *
	 * @param $number
	 * @return string
	 */
	public function phoneLink($number): string
	{
		return 'tel:' . preg_replace('/(?!\+)[^0-9,.]/', '', $number);
	}

	/**
	 * Create e-mail address protected against spam bots
	 *
	 * @param $mail
	 * @return string
	 */
	public function antiSpam($mail): string
	{
		return antispambot($mail);
	}

	public function passwordForm($output): string
	{
		$context['password'] = [
			'action' => esc_url(site_url('wp-login.php?action=postpass', 'login_post')),
		];
		return Timber::compile('partials/page/password.twig', $context);
	}

	public function enable_vcard_upload($mime_types = []): array
	{
		$mime_types['vcf'] = 'text/vcard';
		$mime_types['vcard'] = 'text/vcard';
		return $mime_types;
	}

	public function deleteImageSizes($sizes): array
	{
		return array_diff($sizes, ['medium_large', 'large', '1536x1536', '2048x2048', 'medium']);
	}
}
