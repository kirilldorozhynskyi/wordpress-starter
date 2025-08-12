<?php

namespace JDEV;

/**
 * Class Favicon
 * Manages favicon generation and display
 *
 * @package JDEV
 */
class Favicon
{
	/**
	 * @var array
	 */
	protected array $viteManifest = [];

	/**
	 * @var string
	 */
	protected string $buildPath;

	/**
	 * @var string
	 */
	protected string $extPath;

	/**
	 * @var string
	 */
	protected string $extDir;

	public function __construct()
	{
		$this->buildPath = get_template_directory_uri() . '/resources/Public/Build/';
		$this->extPath = get_template_directory_uri() . '/resources/Public/ext/';
		$this->extDir = get_template_directory() . '/resources/Public/ext/';

		// Load Vite manifest
		$this->loadViteManifest();

		// Add hook for favicon output
		add_action('wp_head', [$this, 'renderFavicon'], 1);
	}

	/**
	 * Load Vite manifest
	 */
	protected function loadViteManifest(): void
	{
		if (!file_exists(ABSPATH . 'hot')) {
			$manifestPath = get_template_directory() . '/resources/Public/Build/.vite/manifest.json';

			if (file_exists($manifestPath)) {
				$manifestContent = file_get_contents($manifestPath);
				$decodedManifest = json_decode($manifestContent, true);

				if (json_last_error() === JSON_ERROR_NONE) {
					$this->viteManifest = $decodedManifest;
				}
			}
		}
	}

	/**
	 * Render favicon in head
	 */
	public function renderFavicon(): void
	{
		if (file_exists(ABSPATH . 'hot')) {
			return; // Don't output favicon in development mode
		}

		$faviconData = $this->getFaviconData();
		if ($faviconData) {
			echo $this->compileFaviconHtml($faviconData);
		}
	}

	/**
	 * Get favicon data
	 */
	protected function getFaviconData(): ?array
	{
		if (empty($this->viteManifest)) {
			return null;
		}

		// Check for web manifest
		$manifestKey = $this->findManifestKey();
		if (!$manifestKey) {
			return null;
		}

		$webmanifest = str_replace('assets/', '', $this->viteManifest[$manifestKey]['file']);

		// Create custom web manifest if it doesn't exist
		if (!file_exists($this->extDir . $webmanifest)) {
			$this->createCustomWebManifest($manifestKey, $webmanifest);
		}

		return [
			'manifest' => $this->extPath . $webmanifest,
			'theme_color' => $this->getThemeColor(),
			'favicons' => $this->getFaviconFiles(),
			'apple' => $this->getAppleTouchIcons(),
		];
	}

	/**
	 * Find manifest key in vite manifest
	 */
	protected function findManifestKey(): ?string
	{
		foreach ($this->viteManifest as $key => $asset) {
			if (strpos($key, 'manifest') !== false && strpos($asset['file'], 'webmanifest') !== false) {
				return $key;
			}
		}
		return null;
	}

	/**
	 * Create custom web manifest
	 */
	protected function createCustomWebManifest(string $manifestKey, string $webmanifest): void
	{
		// Clean old files
		$this->cleanExtDirectory();

		// Read original manifest
		$manifestContent = file_get_contents($this->buildPath . $this->viteManifest[$manifestKey]['file']);
		$json = json_decode($manifestContent, true);

		// Update data
		$json['name'] = get_bloginfo('name');
		$json['short_name'] = get_bloginfo('name');
		$json['description'] = get_bloginfo('description');
		$json['lang'] = get_locale();
		$json['background_color'] = $this->getBackgroundColor();
		$json['theme_color'] = $this->getThemeColor();

		// Save custom manifest
		file_put_contents($this->extDir . $webmanifest, json_encode($json, JSON_PRETTY_PRINT));
	}

	/**
	 * Clean ext directory
	 */
	protected function cleanExtDirectory(): void
	{
		if (!is_dir($this->extDir)) {
			mkdir($this->extDir, 0755, true);
		}

		$files = glob($this->extDir . '/*');
		foreach ($files as $file) {
			if (is_file($file) && basename($file) !== '.gitkeep') {
				unlink($file);
			}
		}
	}

	/**
	 * Get favicon files
	 */
	protected function getFaviconFiles(): array
	{
		$favicons = [];
		$faviconTypes = ['favicon-16x16', 'favicon-32x32', 'favicon-48x48', 'favicon'];

		foreach ($faviconTypes as $type) {
			$key = $this->findAssetKey($type);
			if ($key) {
				$filename = basename($this->viteManifest[$key]['file']);
				$favicons[$filename] = $this->buildPath . $this->viteManifest[$key]['file'];
			}
		}

		return $favicons;
	}

	/**
	 * Get Apple Touch Icons
	 */
	protected function getAppleTouchIcons(): array
	{
		$appleIcons = [];
		$appleTypes = [
			'apple-touch-icon-57x57',
			'apple-touch-icon-60x60',
			'apple-touch-icon-72x72',
			'apple-touch-icon-76x76',
			'apple-touch-icon-114x114',
			'apple-touch-icon-120x120',
			'apple-touch-icon-144x144',
			'apple-touch-icon-152x152',
			'apple-touch-icon-167x167',
			'apple-touch-icon-180x180',
			'apple-touch-icon-1024x1024',
		];

		foreach ($appleTypes as $type) {
			$key = $this->findAssetKey($type);
			if ($key) {
				$filename = basename($this->viteManifest[$key]['file']);
				$appleIcons[$filename] = $this->buildPath . $this->viteManifest[$key]['file'];
			}
		}

		return $appleIcons;
	}

	/**
	 * Find asset key by type
	 */
	protected function findAssetKey(string $type): ?string
	{
		foreach ($this->viteManifest as $key => $asset) {
			if (strpos($key, $type) !== false) {
				return $key;
			}
		}
		return null;
	}

	/**
	 * Get theme color from ACF
	 */
	protected function getThemeColor(): string
	{
		$options = get_fields('options');
		return $options['general_theme_color'] ?? '#000000';
	}

	/**
	 * Get background color from ACF
	 */
	protected function getBackgroundColor(): string
	{
		$options = get_fields('options');
		return $options['general_background_color'] ?? '#ffffff';
	}

	/**
	 * Compile HTML for favicon
	 */
	protected function compileFaviconHtml(array $faviconData): string
	{
		$html = [];

		// Favicon links
		foreach ($faviconData['favicons'] as $filename => $url) {
			if (strpos($filename, '.ico') !== false) {
				$html[] = '<link href="' . esc_url($url) . '" rel="icon" type="image/x-icon" />';
			} elseif (strpos($filename, '.png') !== false) {
				// Extract dimensions from filename
				preg_match('/(\d+)x(\d+)/', $filename, $matches);
				if (count($matches) >= 3) {
					$size = $matches[1] . 'x' . $matches[2];
					$html[] = '<link href="' . esc_url($url) . '" rel="icon" sizes="' . $size . '" type="image/png" />';
				}
			}
		}

		// Web manifest
		if (isset($faviconData['manifest'])) {
			$html[] = '<link href="' . esc_url($faviconData['manifest']) . '" rel="manifest" />';
		}

		// Mobile web app capable
		$html[] = '<meta content="yes" name="mobile-web-app-capable" />';
		$html[] = '<meta content="' . esc_attr($faviconData['theme_color']) . '" name="theme-color" />';
		$html[] = '<meta name="application-name" />';

		// Apple Touch Icons
		foreach ($faviconData['apple'] as $filename => $url) {
			preg_match('/(\d+)x(\d+)/', $filename, $matches);
			if (count($matches) >= 3) {
				$size = $matches[1] . 'x' . $matches[2];
				$html[] = '<link href="' . esc_url($url) . '" rel="apple-touch-icon" sizes="' . $size . '" />';
			}
		}

		// Apple mobile web app meta
		$html[] = '<meta content="yes" name="apple-mobile-web-app-capable" />';
		$html[] = '<meta content="black-translucent" name="apple-mobile-web-app-status-bar-style" />';
		$html[] = '<meta name="apple-mobile-web-app-title" />';

		return implode("\n\t", $html) . "\n";
	}
}
