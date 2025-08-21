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

	/**
	 * @var array
	 */
	protected array $faviconConfig = [
		'android' => [
			'android-chrome-144x144.png',
			'android-chrome-192x192.png',
			'android-chrome-256x256.png',
			'android-chrome-36x36.png',
			'android-chrome-384x384.png',
			'android-chrome-48x48.png',
			'android-chrome-512x512.png',
			'android-chrome-72x72.png',
			'android-chrome-96x96.png',
		],
		'appleIcon' => [
			'apple-touch-icon-1024x1024.png',
			'apple-touch-icon-114x114.png',
			'apple-touch-icon-120x120.png',
			'apple-touch-icon-144x144.png',
			'apple-touch-icon-152x152.png',
			'apple-touch-icon-167x167.png',
			'apple-touch-icon-180x180.png',
			'apple-touch-icon-57x57.png',
			'apple-touch-icon-60x60.png',
			'apple-touch-icon-72x72.png',
			'apple-touch-icon-76x76.png',
			'apple-touch-icon-precomposed.png',
			'apple-touch-icon.png',
		],
		'appleStartup' => [
			'apple-touch-startup-image-1125x2436.png',
			'apple-touch-startup-image-1136x640.png',
			'apple-touch-startup-image-1242x2208.png',
			'apple-touch-startup-image-1242x2688.png',
			'apple-touch-startup-image-1334x750.png',
			'apple-touch-startup-image-1536x2048.png',
			'apple-touch-startup-image-1620x2160.png',
			'apple-touch-startup-image-1668x2224.png',
			'apple-touch-startup-image-1668x2388.png',
			'apple-touch-startup-image-1792x828.png',
			'apple-touch-startup-image-2048x1536.png',
			'apple-touch-startup-image-2048x2732.png',
			'apple-touch-startup-image-2160x1620.png',
			'apple-touch-startup-image-2208x1242.png',
			'apple-touch-startup-image-2224x1668.png',
			'apple-touch-startup-image-2388x1668.png',
			'apple-touch-startup-image-2436x1125.png',
			'apple-touch-startup-image-2688x1242.png',
			'apple-touch-startup-image-2732x2048.png',
			'apple-touch-startup-image-640x1136.png',
			'apple-touch-startup-image-750x1334.png',
			'apple-touch-startup-image-828x1792.png',
			'apple-touch-startup-image-1179x2556.png',
			'apple-touch-startup-image-2556x1179.png',
			'apple-touch-startup-image-1290x2796.png',
			'apple-touch-startup-image-2796x1290.png',
			'apple-touch-startup-image-1488x2266.png',
			'apple-touch-startup-image-2266x1488.png',
			'apple-touch-startup-image-1640x2360.png',
			'apple-touch-startup-image-2360x1640.png',
		],
		'favicons' => ['favicon-16x16.png', 'favicon-32x32.png', 'favicon-48x48.png', 'favicon.ico'],
	];

	public function __construct()
	{
		$this->buildPath = get_template_directory_uri() . '/resources/Public/Build/';
		$this->extPath = get_template_directory_uri() . '/resources/Public/ext/';
		$this->extDir = get_template_directory() . '/resources/Public/ext/';

		// Add hook for favicon output
		add_action('wp_head', [$this, 'renderFavicon'], 1);
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
		// Create custom web manifest if it doesn't exist
		$manifestFile = 'manifest.webmanifest';
		if (!file_exists($this->extDir . $manifestFile)) {
			$this->createCustomWebManifest($manifestFile);
		}

		return [
			'manifest' => $this->extPath . $manifestFile,
			'theme_color' => $this->getThemeColor(),
			'favicons' => $this->getFaviconFiles(),
			'apple' => $this->getAppleTouchIcons(),
			'android' => $this->getAndroidChromeIcons(),
			'appleStartup' => $this->getAppleStartupImages(),
		];
	}

	/**
	 * Create custom web manifest
	 */
	protected function createCustomWebManifest(string $manifestFile): void
	{
		// Clean old files
		$this->cleanExtDirectory();

		// Create manifest data
		$manifest = [
			'name' => get_bloginfo('name'),
			'short_name' => get_bloginfo('name'),
			'description' => get_bloginfo('description'),
			'lang' => get_locale(),
			'background_color' => $this->getBackgroundColor(),
			'theme_color' => $this->getThemeColor(),
			'display' => 'standalone',
			'orientation' => 'portrait',
			'scope' => '/',
			'start_url' => '/',
			'icons' => [],
		];

		// Add Android icons to manifest
		foreach ($this->faviconConfig['android'] as $icon) {
			if (file_exists($this->getBuildDir() . $icon)) {
				preg_match('/(\d+)x(\d+)/', $icon, $matches);
				if (count($matches) >= 3) {
					$manifest['icons'][] = [
						'src' => $this->buildPath . $icon,
						'sizes' => $matches[1] . 'x' . $matches[2],
						'type' => 'image/png',
					];
				}
			}
		}

		// Save custom manifest
		file_put_contents($this->extDir . $manifestFile, json_encode($manifest, JSON_PRETTY_PRINT));
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
	 * Get build directory path
	 */
	protected function getBuildDir(): string
	{
		return get_template_directory() . '/resources/Public/Build/';
	}

	/**
	 * Get favicon files
	 */
	protected function getFaviconFiles(): array
	{
		$favicons = [];
		$buildDir = $this->getBuildDir();

		foreach ($this->faviconConfig['favicons'] as $icon) {
			if (file_exists($buildDir . $icon)) {
				$favicons[$icon] = $this->buildPath . $icon;
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
		$buildDir = $this->getBuildDir();

		foreach ($this->faviconConfig['appleIcon'] as $icon) {
			if (file_exists($buildDir . $icon)) {
				$appleIcons[$icon] = $this->buildPath . $icon;
			}
		}

		return $appleIcons;
	}

	/**
	 * Get Android Chrome Icons
	 */
	protected function getAndroidChromeIcons(): array
	{
		$androidIcons = [];
		$buildDir = $this->getBuildDir();

		foreach ($this->faviconConfig['android'] as $icon) {
			if (file_exists($buildDir . $icon)) {
				$androidIcons[$icon] = $this->buildPath . $icon;
			}
		}

		return $androidIcons;
	}

	/**
	 * Get Apple Startup Images
	 */
	protected function getAppleStartupImages(): array
	{
		$startupImages = [];
		$buildDir = $this->getBuildDir();

		foreach ($this->faviconConfig['appleStartup'] as $image) {
			if (file_exists($buildDir . $image)) {
				$startupImages[$image] = $this->buildPath . $image;
			}
		}

		return $startupImages;
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
		$html[] = '<meta name="application-name" content="' . esc_attr(get_bloginfo('name')) . '" />';

		// Apple Touch Icons
		foreach ($faviconData['apple'] as $filename => $url) {
			preg_match('/(\d+)x(\d+)/', $filename, $matches);
			if (count($matches) >= 3) {
				$size = $matches[1] . 'x' . $matches[2];
				$html[] = '<link href="' . esc_url($url) . '" rel="apple-touch-icon" sizes="' . $size . '" />';
			} else {
				// For icons without size in filename (like apple-touch-icon.png)
				$html[] = '<link href="' . esc_url($url) . '" rel="apple-touch-icon" />';
			}
		}

		// Apple mobile web app meta
		$html[] = '<meta content="yes" name="apple-mobile-web-app-capable" />';
		$html[] = '<meta content="black-translucent" name="apple-mobile-web-app-status-bar-style" />';
		$html[] = '<meta name="apple-mobile-web-app-title" content="' . esc_attr(get_bloginfo('name')) . '" />';

		// Apple startup images
		foreach ($faviconData['appleStartup'] as $filename => $url) {
			preg_match('/(\d+)x(\d+)/', $filename, $matches);
			if (count($matches) >= 3) {
				$size = $matches[1] . 'x' . $matches[2];
				$html[] =
					'<link href="' .
					esc_url($url) .
					'" rel="apple-touch-startup-image" media="screen and (device-width: ' .
					$matches[1] .
					'px) and (device-height: ' .
					$matches[2] .
					'px) and (-webkit-device-pixel-ratio: 2)" />';
			}
		}

		return implode("\n\t", $html) . "\n";
	}
}
