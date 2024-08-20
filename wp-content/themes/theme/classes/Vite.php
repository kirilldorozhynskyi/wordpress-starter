<?php

namespace JDEV;

/**
 * Class Vite
 *
 * @package JDEV
 */
class Vite
{
	const VITE_MANIFEST_PATH = '/resources/Public/Build/.vite/manifest.json';

	/**
	 * @var array
	 */
	protected array $viteManifest = [];

	public function __construct()
	{
		$this->loadViteManifest();
		add_filter('script_loader_tag', [$this, 'addModuleTypeToViteScript'], 10, 3);
		add_action('wp_footer', [$this, 'loadBodyThemeAssets']);
		add_action('wp_enqueue_scripts', [$this, 'loadHeadThemeAssets']);
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

	/**
	 * Load theme styles
	 */
	public function loadHeadThemeAssets(): void
	{
		if (empty($this->viteManifest['wp-content/themes/theme/resources/Private/Vue/app.ts']['css'])) {
			return;
		}

		foreach ($this->viteManifest['wp-content/themes/theme/resources/Private/Vue/app.ts']['css'] as $css) {
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

			$app = $url . 'wp-content/themes/theme/resources/Private/Vue/app.ts';
			// $spritemap = $url . '/@vite-plugin-svg-spritemap/client';
			$version = time();

			// wp_enqueue_script('app_theme_sprite', $spritemap, [], null, false);
			wp_enqueue_script('app_theme', $app, [], $version, true);
		} else {
			// wp_enqueue_script('vendors', get_template_directory_uri() . '/resources/Public/' . (wp_get_environment_type() === 'production' ? 'Production' : 'Development') . '/js/chunk-vendors.js', [], false, true);
			wp_enqueue_script(
				'app',
				get_template_directory_uri() . '/resources/Public/Build/' . $this->viteManifest['wp-content/themes/theme/resources/Private/Vue/app.ts']['file'],
				[],
				false,
				true,
			);
		}
	}
}
