<?php

namespace JDEV;

use Timber\Timber;
use BoxyBird\Inertia\Inertia;
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
		add_filter('script_loader_tag', [$this, 'addModuleTypeToViteSprite'], 10, 3);

		add_action('wp_footer', [$this, 'loadBodyThemeAssets']);
		add_action('wp_enqueue_scripts', [$this, 'loadHeadThemeAssets']);

		add_action('wp_head', [$this, 'preloadAssetsVite'], 2); // Add fonts preload
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
	 * Preload Fonts & Main CSS dynamically from Vite manifest.json
	 */
	public function preloadAssetsVite()
	{
		if (empty($this->viteManifest)) {
			return;
		}

		$templateUrl = get_template_directory_uri() . '/resources/Public/Build/';
		$preloadedCSS = [];

		// Preload Fonts
		foreach ($this->viteManifest as $file => $asset) {
			if (isset($asset['file']) && preg_match('/\.woff2$/', $asset['file'])) {
				echo '<link rel="preload" href="' . esc_url($templateUrl . $asset['file']) . '" as="font" type="font/woff2" crossorigin="anonymous">' . PHP_EOL;
			}
		}

		// Preload Main CSS only once
		if (isset($this->viteManifest['wp-content/themes/template/resources/Private/Vue/app.ts']['css'])) {
			foreach ($this->viteManifest['wp-content/themes/template/resources/Private/Vue/app.ts']['css'] as $css) {
				if (!in_array($css, $preloadedCSS)) {
					echo '<link rel="preload" href="' . esc_url($templateUrl . $css) . '" as="style">' . PHP_EOL;
					$preloadedCSS[] = $css;
				}
			}
		}
	}

	/**
	 * Load theme scripts
	 */
	public function loadBodyThemeAssets(): void
	{
		if (file_exists(ABSPATH . 'hot')) {
			$url = file_get_contents(ABSPATH . 'hot');

			$app = $url . '/wp-content/themes/template/resources/Private/Vue/app.ts';
			$spritemap = $url . '/@vite-plugin-svg-spritemap/client__spritemap';
			$version = time();

			wp_enqueue_script('app_theme_sprite', $spritemap, [], null, false);
			wp_enqueue_script('app_theme', $app, [], $version, true);
		} else {
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
	 * Load Vite manifest.json
	 */
	protected function loadViteManifest($manifestPath = ''): void
	{
		if (!file_exists(ABSPATH . 'hot')) {
			$manifestPath = $manifestPath ?: get_template_directory() . self::VITE_MANIFEST_PATH;

			if (!file_exists($manifestPath)) {
				return;
			}

			$manifestContent = file_get_contents($manifestPath);
			$decodedManifest = json_decode($manifestContent, true);

			if (json_last_error() !== JSON_ERROR_NONE) {
				throw new \Exception(sprintf('[Vite] Invalid JSON in manifest: %s.', $manifestPath));
			}

			$this->viteManifest = $decodedManifest;
		}

		Inertia::share([
			'sprite' => file_exists(ABSPATH . 'hot')
				? ''
				: get_template_directory_uri() . '/resources/Public/Build/' . $this->viteManifest['spritemap.svg']['file'],
		]);
	}

	public function addModuleTypeToViteSprite($tag, $handle, $src): string
	{
		if (file_exists(ABSPATH . 'hot') && ($handle === 'app_theme_sprite' || $handle === 'vite_client')) {
			$tag = '<script type="module" src="' . esc_url($src) . '"></script>';
		}

		return $tag;
	}
	/**
	 * Public method to get the viteManifest array
	 */
	public function getViteManifest(): array
	{
		return $this->viteManifest;
	}
}
