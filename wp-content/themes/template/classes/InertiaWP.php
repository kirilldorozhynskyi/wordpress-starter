<?php

namespace JDEV;

use BoxyBird\Inertia\Inertia;

require ABSPATH . '/vendor/autoload.php';

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
		$vite = new Vite();

		$viteManifest = $vite->getViteManifest();

		Inertia::share([
			'site' => [
				'name' => get_bloginfo('name'),
				'description' => get_bloginfo('description'),
				'url' => get_bloginfo('url'),
			],
			'sprite' => ($path = file_exists(ABSPATH . 'hot')
				? ''
				: get_template_directory_uri() . '/resources/Public/Build/' . $viteManifest['spritemap.svg']['file']),
		]);

		if (file_exists(__DIR__ . '/../build/manifest.json')) {
			$version = filemtime(__DIR__ . '/../build/manifest.json');
		} else {
			$version = time();
		}

		Inertia::version($version);
	}
}
