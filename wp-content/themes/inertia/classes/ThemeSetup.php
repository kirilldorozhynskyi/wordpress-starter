<?php

namespace InertiaTheme;

use InertiaTheme\Model\GravityForm;
use InertiaTheme\Model\News;

class ThemeSetup
{
	public function __construct()
	{
		$this->checkDependencies();
	}

	private function checkDependencies(): void
	{
		$errors = [];

		if (!class_exists('ACF')) {
			$errors[] = 'ACF or ACF PRO not activated. Make sure you activate the plugin <a href="https://www.advancedcustomfields.com/pro/">ACF</a>';
		}

		if (!empty($errors)) {
			add_action('admin_notices', static function () use ($errors) {
				foreach ($errors as $error) {
					echo '<div class="error"><p>' . $error . '</p></div>';
				}
			});
			return;
		}

		$this->initTheme();
	}

	private function initTheme(): void
	{
		new Base();
		new Deregister();
		new ACFConfig();
		new Favicon();
		new InertiaShare();
		new News();
		new Vite();

		if (class_exists('GFAPI')) {
			new GravityForm();
		}

		add_action('save_post', [self::class, 'clearCache']);
		add_action('deleted_post', [self::class, 'clearCache']);
		add_action('wp_update_nav_menu', [self::class, 'clearCache']);
		add_action('update_option', [self::class, 'clearCache']);
		add_action('acf/save_post', [self::class, 'clearCache']);
	}

	public static function clearCache(): void
	{
		Cache::clear();
	}
}
