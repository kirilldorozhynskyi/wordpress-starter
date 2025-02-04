<?php

namespace JDEV;

use Timber\Timber;

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

		// add_action('after_setup_theme', [$this, 'GetFavicon']);
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
	 * Load theme scripts
	 */
	public function loadBodyThemeAssets(): void
	{
		// JS
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

	public static function GetFavicon()
	{
		if (!file_exists(ABSPATH . 'hot')) {
			$vite = new Vite();
			$viteManifest = $vite->getViteManifest();
			$path = get_template_directory_uri() . '/resources/Public/Build/Favicons/';
			$extpath = get_template_directory_uri() . '/resources/Public/ext/';
			$ext = get_template_directory() . '/resources/Public/ext/';

			$webmanifest = 'manifest-ZG-w7JEL.webmanifest';

			if (!file_exists($path . $webmanifest)) {
				$manifestContent = file_get_contents($path . $webmanifest);

				$json = json_decode($manifestContent);

				$json->name = get_bloginfo();
				$json->short_name = get_bloginfo();
				$json->description = get_bloginfo('description');
				$json->lang = get_locale();
				$json->background_color = get_fields('options') ? get_fields('options')['general_background_color'] : '';
				$json->theme_color = get_fields('options') ? get_fields('options')['general_theme_color'] : '';

				file_put_contents($ext . $webmanifest, json_encode($json));
			}

			$context['fav'] = [
				'manifest' => $path . $webmanifest,
				'theme_color' => get_fields('options') ? get_fields('options')['general_theme_color'] : '',
				'favicons' => [
					'favicon-16x16.png' => $path . $viteManifest['favicon-16x16.png']['file'],
					'favicon-32x32.png' => $path . $viteManifest['favicon-32x32.png']['file'],
					'favicon-48x48.png' => $path . $viteManifest['favicon-48x48.png']['file'],
					'favicon.ico' => $path . $viteManifest['favicon.ico']['file'],
				],
				'apple' => [
					'apple-touch-icon-1024x1024.png' => $path . $viteManifest['apple-touch-icon-1024x1024.png']['file'],
					'apple-touch-icon-114x114.png' => $path . $viteManifest['apple-touch-icon-114x114.png']['file'],
					'apple-touch-icon-120x120.png' => $path . $viteManifest['apple-touch-icon-120x120.png']['file'],
					'apple-touch-icon-152x152.png' => $path . $viteManifest['apple-touch-icon-152x152.png']['file'],
					'apple-touch-icon-167x167.png' => $path . $viteManifest['apple-touch-icon-167x167.png']['file'],
					'apple-touch-icon-180x180.png' => $path . $viteManifest['apple-touch-icon-180x180.png']['file'],
					'apple-touch-icon-57x57.png' => $path . $viteManifest['apple-touch-icon-57x57.png']['file'],
					'apple-touch-icon-60x60.png' => $path . $viteManifest['apple-touch-icon-60x60.png']['file'],
					'apple-touch-icon-76x76.png' => $path . $viteManifest['apple-touch-icon-76x76.png']['file'],
				],
			];
			// return $context;
			return Timber::compile('partials/elements/favicon.twig', $context);
		}
		return '';
	}
}
