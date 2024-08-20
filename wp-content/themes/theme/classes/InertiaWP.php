<?php

namespace JDEV;

use BoxyBird\Inertia\Inertia;

class InertiaWP
{
	public function __construct()
	{
		add_action('after_setup_theme', [$this, 'setupTheme']);
	}

	/**
	 * Setup theme
	 */
	public function setupTheme(): void
	{
		Inertia::share([
			'site' => [
				'name' => get_bloginfo('name'),
				'description' => get_bloginfo('description'),
				'url' => get_bloginfo('url'),
			],
		]);

		if (file_exists(__DIR__ . '/../build/manifest.json')) {
			$version = filemtime(__DIR__ . '/../build/manifest.json');
		} else {
			$version = time();
		}

		Inertia::version($version);
	}
}
