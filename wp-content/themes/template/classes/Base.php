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
		remove_action('admin_print_styles', 'print_emoji_styles');
		remove_action('admin_print_scripts', 'print_emoji_detection_script');
		remove_action('wp_print_styles', 'print_emoji_styles');
		remove_action('wp_head', 'print_emoji_detection_script', 7);

		add_filter('script_loader_tag', [$this, 'addModuleTypeToViteScript'], 10, 3);
		add_filter('script_loader_tag', [$this, 'addModuleTypeToViteSprite'], 10, 3);
		add_action('wp_footer', [$this, 'loadBodyThemeAssets']);

		add_action('init', [$this, 'email_notifications']);
		add_action('admin_menu', [$this, 'modifyAdminMenu']);
		add_action('admin_bar_menu', [$this, 'modifyAdminBar'], 99);
		add_action('customize_register', [$this, 'modifyCustomizer']);
		add_action('admin_init', [$this, 'modifyEditorCapabilities']);
		add_action('map_meta_cap', [$this, 'modifyPrivacyPolicyCapabilities'], 1, 3);
		add_action('after_setup_theme', [$this, 'setupTheme']);
		add_action('wp_print_styles', [$this, 'unloadDefaultAssets']);
		add_action('wp_enqueue_scripts', [$this, 'loadHeadThemeAssets']);
		// add_action('admin_init', [$this, 'loadRTEStyles']);

		add_filter('use_block_editor_for_post', '__return_false');
		add_filter('image_resize_dimensions', '__return_false');
		add_filter('timber/context', [$this, 'addToContext']);
		add_filter('timber/twig', [$this, 'addToTwig']);
		add_filter('wp_sentry_options', [$this, 'sentryErrorsCapturing']);

		add_filter('the_password_form', [$this, 'passwordForm']);

		add_filter('upload_mimes', [$this, 'enable_vcard_upload']);
		add_filter('intermediate_image_sizes', [$this, 'deleteImageSizes']);

		// load Vite manifest
		$this->loadViteManifest();
	}

	protected function loadViteManifest($manifestPath = '')
	{
		if (!file_exists(ABSPATH . 'hot')) {
			if (empty($manifestPath)) {
				$manifestPath = get_template_directory() . self::VITE_MANIFEST_PATH;
			}

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

	public function addModuleTypeToViteScript($tag, $handle, $src)
	{
		if (file_exists(ABSPATH . 'hot')) {
			if ('app_theme' === $handle || 'vite_client' === $handle) {
				$tag = '<script type="module" src="' . esc_url($src) . '"></script>';
			}
			return $tag;
		} else {
			if ('app' !== $handle) {
				return $tag;
			}

			// remove version from src & change the script tag by adding type="module" and return it.
			$src = remove_query_arg('ver', $src);
			$tag = '<script type="module" src="' . esc_url($src) . '"></script>';
			return $tag;
		}
	}

	public function addModuleTypeToViteSprite($tag, $handle, $src)
	{
		if (file_exists(ABSPATH . 'hot')) {
			if ('app_theme_sprite' === $handle || 'vite_client' === $handle) {
				$tag = '<script type="module" src="' . esc_url($src) . '"></script>';
			}
			return $tag;
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
	public function modifyAdminMenu()
	{
		remove_menu_page('edit.php');
		remove_menu_page('edit-comments.php');
	}

	/**
	 * Modify admin bar
	 *
	 * @param $adminBar
	 */
	public function modifyAdminBar($adminBar)
	{
		// $adminBar->remove_node('wp-logo');
		$adminBar->remove_node('new-content');
		$adminBar->remove_node('comments');
	}

	/*
	 * Modify appearance > customize menu items
	 *
	 * @param $customizer
	 */
	public function modifyCustomizer($customizer)
	{
		$customizer->remove_section('custom_css');
	}

	/*
	 * Modify editor's capabilities
	 */
	public function modifyEditorCapabilities()
	{
		$editor = get_role('editor');
		// General
		$editor->remove_cap('manage_options');
		$editor->add_cap('edit_theme_options');
		// WP Rocket
		$editor->add_cap('rocket_purge_posts');
		$editor->add_cap('rocket_purge_cache');
		$editor->add_cap('rocket_purge_opcache');
		$editor->add_cap('rocket_preload_cache');
	}

	/*
	 * Modify capabilities for editing privacy policy page
	 *
	 * @param $capabilities
	 * @param $capability
	 * @param $userId
	 * @return array
	 */
	public function modifyPrivacyPolicyCapabilities($capabilities, $capability, $userId)
	{
		if (!is_user_logged_in()) {
			return $capabilities;
		}
		if (array_intersect(['administrator', 'editor'], get_userdata($userId)->roles)) {
			if ($capability === 'manage_privacy_options') {
				$capabilities = array_diff($capabilities, ['manage_options']);
			}
		}
		return $capabilities;
	}

	/**
	 * Setup theme
	 */
	public function setupTheme()
	{
		add_theme_support('menus');
		add_theme_support('title-tag');
		add_post_type_support('page', 'excerpt');
		add_theme_support('post-thumbnails');
		// add_post_type_support('news', 'thumbnail');
		load_theme_textdomain('jdev', get_template_directory() . '/languages');

		$sizes = [];

		foreach ($sizes as $key => $value) {
			add_image_size($value['name'], $value['size'], $value['sizeH'] ? $value['sizeH'] : 0);
			add_image_size($value['name'] . '2x', $value['size'] * 2, $value['sizeH'] ? $value['sizeH'] * 2 : 0);
		}
	}

	/**
	 * Unload default WP styles and scripts
	 */
	public function unloadDefaultAssets()
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
	public function loadHeadThemeAssets()
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
	public function loadBodyThemeAssets()
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

	// /**
	//  * Load RTE styles
	//  */
	// public function loadRTEStyles()
	// {
	// 	add_editor_style(
	// 		get_template_directory_uri() .
	// 			'/resources/Public/Build/' .
	// 			$this->viteManifest['wp-content/themes/template/resources/Private/Scss/rte.scss']['file']
	// 	);
	// }

	/**
	 * Add to Timber's context
	 *
	 * @param $context
	 * @return array
	 */
	public function addToContext($context)
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
	public function addToTwig($twig)
	{
		$twig->addFunction(new TwigFunction('getSiteLanguage', [$this, 'getSiteLanguage']));
		$twig->addFunction(new TwigFunction('languageSwitcher', [$this, 'languageSwitcher']));
		$twig->addFunction(new TwigFunction('languageSwitcherMobile', [$this, 'languageSwitcherMobile']));
		$twig->addFunction(new TwigFunction('getBreadcrumbs', [$this, 'getBreadcrumbs']));
		$twig->addFunction(new TwigFunction('getGalleryImage', [$this, 'getGalleryImage']));
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
	 * Sentry - capturing errors
	 */
	public function sentryErrorsCapturing(\Sentry\Options $options)
	{
		$options->setBeforeSendCallback(function (\Sentry\Event $event) {
			$exceptions = $event->getExceptions();

			// No exceptions in the event? Send the event to Sentry, it's most likely a log message
			if (empty($exceptions)) {
				return $event;
			}

			$stacktrace = $exceptions[0]->getStacktrace();

			// No stacktrace in the first exception? Send it to Sentry just to be safe then
			if ($stacktrace === null) {
				return $event;
			}

			// Little helper and fallback for PHP versions without the str_contains function
			$strContainsHelper = function ($haystack, $needle) {
				if (function_exists('str_contains')) {
					return str_contains($haystack, $needle);
				}

				return $needle !== '' && mb_strpos($haystack, $needle) !== false;
			};

			foreach ($stacktrace->getFrames() as $frame) {
				// Check the the frame happened inside our theme or plugin
				// Change THEME_NAME and PLUGIN_NAME to whatever is required
				// And / or modify this `if` statement to detect other variables
				if ($strContainsHelper($frame->getFile(), 'themes/template')) {
					// Send the event to Sentry
					return $event;
				}
			}

			// Stacktrace contained no frames in our theme and/or plugin? We send nothing to Sentry
			return null;
		});

		return $options;
	}

	/**
	 * Get Timber language and fix it to ISO 639-1 standard to prevent SEO warnings
	 *
	 * @param $fallbackLanguage
	 * @return string
	 */
	public function getSiteLanguage()
	{
		$twigSite = new Site();
		$siteLanguage = strtolower($twigSite->language);
		if ($siteLanguage) {
			$lang = explode('_', $siteLanguage)[0];
		} else {
			$lang = 'de';
		}

		return $lang;
	}

	/**
	 * Create WPML language switcher panel
	 *
	 * @return string
	 */
	public function languageSwitcher()
	{
		$print = null;
		$list = apply_filters('wpml_active_languages', null, 'orderby=id&order=asc');
		if ($list) {
			if (count($list) > 1) {
				$temp[0] = '';
				foreach ($list as $l) {
					// DE lang is default
					if ($l['language_code'] == 'de') {
						$temp[0] = $l; // assign default language to first position of temp array
					} else {
						$temp[] = $l; // push other languages to temp
					}
				}

				// change original with temp, then remove temp
				$list = $temp;
				unset($temp);

				// output
				$print = '<ul class="main-nav"><li class="d-inline-block main-nav-item sub">';
				// get active language
				for ($i = 0; $i < count($list); $i++) {
					if ($list[$i]['active'] == '1') {
						$print .=
							'<div class="main-nav-link d-flex align-items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" aria-label="Globe icon" class="icon icon-globe me-1">
                            <path d="M10.16,11.33c-.62,2.47-1.7,4-2.16,4.67-.47-.67-1.55-2.2-2.16-4.67h4.33Zm5.11,0c-1.04,2.26-3.1,3.96-5.59,4.49,.88-1.38,1.49-2.91,1.85-4.49h3.74ZM.73,11.33h3.74c.36,1.59,.98,3.12,1.85,4.49-2.49-.53-4.55-2.23-5.59-4.49Zm9.7-1.33H5.57c-.19-1.32-.19-2.68,0-4h4.85c.19,1.32,.19,2.68,0,4Zm-6.2,0H.25C.09,9.36,0,8.69,0,8s.09-1.36,.25-2h3.97c-.18,1.33-.18,2.67,0,4Zm11.52,0h-3.98c.18-1.33,.18-2.67,0-4h3.97c.16,.64,.25,1.31,.25,2s-.09,1.36-.25,2Zm-5.58-5.33H5.84C6.45,2.2,7.53,.67,8,0c.8,1.14,1.63,2.53,2.16,4.67Zm-5.7,0H.73C1.77,2.41,3.83,.71,6.32,.18c-.82,1.29-1.48,2.82-1.85,4.49Zm10.81,0h-3.74c-.37-1.64-1.01-3.17-1.85-4.49,2.49,.53,4.55,2.23,5.59,4.49Z" style="fill-rule:evenodd;"/>
                        </svg>
                        <span>' .
							$list[$i]['translated_name'] .
							'</span>
                        </div>';
					}
				}

				$print .= '<nav class="main-sub-nav"><ul class="list-unstyled main-sub-nav-list">';
				// get other languages
				for ($j = 0; $j < count($list); $j++) {
					if ($list[$j]['active'] != '1') {
						$print .=
							'<li class="main-sub-nav-item"><a class="main-sub-nav-link" href="' .
							$list[$j]['url'] .
							'" target="_self">' .
							$list[$j]['translated_name'] .
							'</a></li>';
					}
				}
				$print .= '</ul></nav></li></ul>';
			} else {
				foreach ($list as $l) {
					// output
					$print = '<ul class="main-nav"><li class="d-inline-block main-nav-item sub">';
					$print .= '<div class="main-nav-link">' . $l['translated_name'] . '</div>';
					$print .= '</li></ul>';
				}
			}
		}

		return $print;
	}

	/**
	 * Create WPML language switcher panel for mobile
	 *
	 * @return string
	 */
	public function languageSwitcherMobile()
	{
		$print = null;
		$list = apply_filters('wpml_active_languages', null, 'orderby=id&order=desc');
		if ($list) {
			$print .= '<div class="d-flex justify-content-center"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" aria-label="Globe icon" class="icon icon-globe">
            <path d="M10.16,11.33c-.62,2.47-1.7,4-2.16,4.67-.47-.67-1.55-2.2-2.16-4.67h4.33Zm5.11,0c-1.04,2.26-3.1,3.96-5.59,4.49,.88-1.38,1.49-2.91,1.85-4.49h3.74ZM.73,11.33h3.74c.36,1.59,.98,3.12,1.85,4.49-2.49-.53-4.55-2.23-5.59-4.49Zm9.7-1.33H5.57c-.19-1.32-.19-2.68,0-4h4.85c.19,1.32,.19,2.68,0,4Zm-6.2,0H.25C.09,9.36,0,8.69,0,8s.09-1.36,.25-2h3.97c-.18,1.33-.18,2.67,0,4Zm11.52,0h-3.98c.18-1.33,.18-2.67,0-4h3.97c.16,.64,.25,1.31,.25,2s-.09,1.36-.25,2Zm-5.58-5.33H5.84C6.45,2.2,7.53,.67,8,0c.8,1.14,1.63,2.53,2.16,4.67Zm-5.7,0H.73C1.77,2.41,3.83,.71,6.32,.18c-.82,1.29-1.48,2.82-1.85,4.49Zm10.81,0h-3.74c-.37-1.64-1.01-3.17-1.85-4.49,2.49,.53,4.55,2.23,5.59,4.49Z" style="fill-rule:evenodd;"/>
            </svg></div>';
			$print .= '<ul class="list-unstyled main-nav-list d-flex justify-content-center pt-0">';
			foreach ($list as $l) {
				$print .=
					'<li class="p-1"><a class="main-nav-link link-hover-underlined" href="' .
					$l['url'] .
					'" target="_self">' .
					$l['translated_name'] .
					'</a></li>';
			}
			$print .= '</ul>';
		}

		return $print;
	}

	/**
	 * Generate and return breadcrumbs for current post
	 *
	 * @param $startFromLevel
	 * @return array
	 */
	public function getBreadcrumbs($startFromLevel = 0)
	{
		$breadcrumbs = [];
		function createBreadcrumb($post)
		{
			return [
				'id' => $post->ID,
				'title' => $post->post_title,
				'link' => get_permalink($post),
			];
		}

		// current object breadcrumb
		$post = get_post();
		$breadcrumbs[] = createBreadcrumb($post);
		// find post parent
		if (is_single()) {
			$parent = $post->meta_post_parent;
			if ($parent) {
				$breadcrumbs[] = createBreadcrumb(get_post($parent));
			}
		}
		// find page parents recursively
		if (is_page()) {
			$parent = $post->post_parent;
			while ($parent) {
				$parent = get_post($parent);
				$breadcrumbs[] = createBreadcrumb($parent);
				if ($parent->post_parent) {
					$parent = get_post($parent->post_parent);
				} else {
					$parent = null;
				}
			}
		}
		// add homepage to end of array - if current object is not homepage
		if (!is_front_page() && array_key_exists('HOME', PAGES) && get_post_status(PAGES['HOME']) == 'publish') {
			$breadcrumbs[] = createBreadcrumb(get_post(PAGES['HOME']));
		}
		// return reversed array
		$breadcrumbsReversed = array_reverse($breadcrumbs);
		return array_splice($breadcrumbsReversed, $startFromLevel);
	}

	/**
	 * Create 2 image arrays from given source
	 * First - cropped image for gallery
	 * Second - full-size image for photoswipe
	 *
	 * @param $source
	 * @param $galleryMaxWidth
	 * @param $galleryMaxHeight
	 * @return array
	 */
	public function getGalleryImage($source, $galleryMaxWidth, $galleryMaxHeight)
	{
		$photoswipeMaxWidth = 1920;
		$photoswipeMaxHeight = 1080;
		$image = new Image($source);
		$imageWidth = $image->width();
		$imageHeight = $image->height();
		$slideImage = new Image(ImageHelper::resize($image, $imageWidth > $imageHeight ? $galleryMaxWidth : 0, $galleryMaxHeight, 'center'));
		$photoswipeImage = new Image(
			ImageHelper::resize(
				$image,
				$imageWidth > $imageHeight ? ($imageWidth > $photoswipeMaxWidth ? $photoswipeMaxWidth : $imageWidth) : 0,
				$imageHeight > $photoswipeMaxHeight ? $photoswipeMaxHeight : $imageHeight,
				'center',
			),
		);
		return [
			'slide' => $slideImage,
			'pswp' => $photoswipeImage,
		];
	}

	/**
	 * Create image loader placeholder with given dimensions
	 * Usage: lazy-loading
	 *
	 * @param $width
	 * @param $height
	 * @return string
	 */
	public function getImagePlaceholder($size)
	{
		$sizes = explode(', ', $size);
		if (count($sizes) == 1) {
			$width = $size;
			$height = $size;
		} else {
			$width = $sizes[0];
			$height = $sizes[1];
		}
		return "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 $width $height'%3E%3C/svg%3E";
	}

	/**
	 * Get Favicon
	 */
	public function getFavicon()
	{
		$path = get_template_directory_uri() . '/resources/Public/Build/';
		$extpath = get_template_directory_uri() . '/resources/Public/ext/';
		$ext = get_template_directory() . '/resources/Public/ext/';

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
			'theme_color' => get_fields('options')['general_theme_color'],
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
	public function isChildOf($pid)
	{
		$queriedObject = get_queried_object();
		if ($queriedObject->ID == $pid) {
			return true;
		} else {
			$ancestors = get_post_ancestors($queriedObject->ID);
			foreach ($ancestors as $ancestor) {
				if ($ancestor == $pid) {
					return true;
				}
			}
		}
		return false;
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
	public function truncateText($text, $chars, $ellipsis = '…')
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
	public function renderCE($elements, $gridElName = null, $postId = null, $page = null)
	{
		$elements = $gridElName ? $elements : get_field($elements, $postId);
		if (!$elements || !is_array($elements) || !count($elements)) {
			return false;
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
	public function youtubeIframeSrc($url, $playInBackground = false)
	{
		preg_match('/^.*(?:(?:youtu\.be\/|v\/|vi\/|u\/\w\/|embed\/)|(?:(?:watch)?\?v(?:i)?=|&v(?:i)?=))([^#&?]*).*/', $url, $videoIdArray);
		$parameters =
			'?autohide=1&rel=0&enablejsapi=1&rel=0&showinfo=0' . ($playInBackground ? '&autoplay=1&loop=1&mute=1&controls=0&playlist=' . $videoIdArray[1] : '');
		$siteUrl = 'http' . (isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] == 'on' ? 's' : '') . '://' . $_SERVER['SERVER_NAME'];
		return 'https://www.youtube-nocookie.com/embed/' . $videoIdArray[1] . $parameters . '&origin=' . urlencode($siteUrl);
	}

	/**
	 * Create iframe `src` attribute from given vimeo url
	 *
	 * @param $url
	 * @param $playInBackground
	 * @return string
	 */
	public function vimeoIframeSrc($url, $playInBackground = false)
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
	public function button($button = false, $class = false, $icon = false, $span = false)
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
	}

	/**
	 * Create sprite
	 *
	 * @param $sprite
	 * @return array
	 */
	public function sprite($id, $class = false)
	{
		// return '<svg class="sprite-icon icon-' . $id . '" aria-hidden="true" focusable="false"><use xlink:href="sprite-' . $id . '"></use></svg>';

		if (file_exists(ABSPATH . 'hot')) {
			$path = '';
		} else {
			$path = get_template_directory_uri() . '/resources/Public/Build/' . $this->viteManifest['spritemap.svg']['file'];
		}

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
	public function GetImage($img, $size = false, $class = false)
	{
		if (count($size) == 1 || $size[0] == $size[1]) {
			$normal_size = $size[0];
			$retina_size = $size[0] * 2;
		} elseif (count($size) == 2 && $size[0] != $size[1]) {
			$normal_size = $size[0] . ', ' . $size[1];
			$retina_size = $size[0] * 2 . ', ' . $size[1] * 2;
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
		];
		return Timber::compile('components/_image.twig', $context);
	}

	// /**
	//  * Create image
	//  *
	//  * @param $image
	//  * @return array
	//  */
	// public function _Image($id, $class = '', $size = 'thumbnail', $array = false)
	// {
	// 	$src = wp_get_attachment_image_src($id, $size);
	// 	$src2x = wp_get_attachment_image_src($id, $size . '2x');
	// 	$alt_text = get_post_meta($id, '_wp_attachment_image_alt', true);

	// 	$context['image'] = [
	// 		'class' => $class,
	// 		'size' => $src[1] . ', ' . $src[2],
	// 		'src' => $src[0],
	// 		'width' => $src[1],
	// 		'height' => $src[2],
	// 		'retina' => $src2x[0],
	// 		'alt' => $alt_text,
	// 	];
	// 	if ($array) {
	// 		return $context['image'];
	// 	}

	// 	return Timber::compile('components/_image_wp.twig', $context);
	// }

	/**
	 * Create href with `mailto:` prefix and e-mail address
	 *
	 * @param $mail
	 * @return string
	 */
	public function mailLink($mail)
	{
		return 'mailto:' . strtolower(preg_replace('/\s+/', '', $mail));
	}

	/**
	 * Create href with `tel:` prefix and phone number without spaces
	 *
	 * @param $number
	 * @return string
	 */
	public function phoneLink($number)
	{
		return 'tel:' . preg_replace('/(?!\+)[^0-9,.]/', '', $number);
	}

	/**
	 * Create e-mail address protected against spam bots
	 *
	 * @param $mail
	 * @return string
	 */
	public function antiSpam($mail)
	{
		return antispambot($mail);
	}

	/**
	 * Custom password form template for password protected pages
	 * https://wordpress.org/documentation/article/protect-posts-with-password/
	 *
	 * @param string  $output The password form HTML output.
	 */
	public function passwordForm($output)
	{
		$context['password'] = [
			'action' => esc_url(site_url('wp-login.php?action=postpass', 'login_post')),
		];
		return Timber::compile('partials/page/password.twig', $context);
	}

	// Enable vcard upload
	public function enable_vcard_upload($mime_types = [])
	{
		$mime_types['vcf'] = 'text/vcard';
		$mime_types['vcard'] = 'text/vcard';
		return $mime_types;
	}

	// Remove files
	public function deleteImageSizes($sizes)
	{
		return array_diff($sizes, ['medium_large', 'large', '1536x1536', '2048x2048', 'thumbnail', 'medium']);
	}
}
