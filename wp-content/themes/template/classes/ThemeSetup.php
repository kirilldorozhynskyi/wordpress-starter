<?php

/**
 * Theme Setup
 * Handles theme initialization and dependency checks
 */

namespace JDEV;

class ThemeSetup
{
	public function __construct()
	{
		$this->checkDependencies();
		$this->initTheme();
	}

	/**
	 * Check required dependencies
	 */
	private function checkDependencies(): void
	{
		$errors = [];

		// Check ACF
		if (!class_exists('ACF')) {
			$errors[] = 'ACF or ACF PRO not activated. Make sure you activate the plugin <a href="https://www.advancedcustomfields.com/pro/">ACF</a>';
		}

		// Display errors
		if (!empty($errors)) {
			add_action('admin_notices', function () use ($errors) {
				foreach ($errors as $error) {
					echo '<div class="error"><p>' . $error . '</p></div>';
				}
			});

			// Redirect to fallback template
			add_filter('template_include', function ($template) {
				return get_stylesheet_directory() . '/static/no-timber.php';
			});
			return;
		}
	}

	/**
	 * Initialize theme components
	 */
	private function initTheme(): void
	{
		// Core classes
		new Base();
		new Deregister();
		new Vite();
		new Favicon();

		// Inertia and ACF
		new InertiaWP();
		new ACFConfig();
		new DynamicImages();

		// Models
		new Model\News();

		// Gravity Forms (optional)
		if (class_exists('GFAPI')) {
			new Model\GravityForm();
		} else {
			add_action('admin_notices', function () {
				echo '<div class="error"><p>GravityForm not activated. Make sure you activate the plugin</p></div>';
			});
		}
	}
}
