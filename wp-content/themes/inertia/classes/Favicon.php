<?php

namespace InertiaTheme;

class Favicon
{
	private string $build_path;
	private string $build_dir;
	private string $ext_path;
	private string $ext_dir;
	private string $hot_file;
	private string $legacy_hot_file;

	private array $favicon_config = [
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
			'apple-touch-startup-image-1179x2556.png',
			'apple-touch-startup-image-1242x2208.png',
			'apple-touch-startup-image-1242x2688.png',
			'apple-touch-startup-image-1290x2796.png',
			'apple-touch-startup-image-1334x750.png',
			'apple-touch-startup-image-1488x2266.png',
			'apple-touch-startup-image-1536x2048.png',
			'apple-touch-startup-image-1620x2160.png',
			'apple-touch-startup-image-1640x2360.png',
			'apple-touch-startup-image-1668x2224.png',
			'apple-touch-startup-image-1668x2388.png',
			'apple-touch-startup-image-1792x828.png',
			'apple-touch-startup-image-2048x1536.png',
			'apple-touch-startup-image-2048x2732.png',
			'apple-touch-startup-image-2160x1620.png',
			'apple-touch-startup-image-2208x1242.png',
			'apple-touch-startup-image-2224x1668.png',
			'apple-touch-startup-image-2266x1488.png',
			'apple-touch-startup-image-2360x1640.png',
			'apple-touch-startup-image-2388x1668.png',
			'apple-touch-startup-image-2436x1125.png',
			'apple-touch-startup-image-2556x1179.png',
			'apple-touch-startup-image-2688x1242.png',
			'apple-touch-startup-image-2732x2048.png',
			'apple-touch-startup-image-2796x1290.png',
			'apple-touch-startup-image-640x1136.png',
			'apple-touch-startup-image-750x1334.png',
			'apple-touch-startup-image-828x1792.png',
		],
		'favicons' => ['favicon-16x16.png', 'favicon-32x32.png', 'favicon-48x48.png', 'favicon.ico'],
	];

	public function __construct()
	{
		$template_uri = trailingslashit(get_template_directory_uri());
		$template_dir = trailingslashit(get_template_directory());

		$this->build_path = $template_uri . 'resources/Public/Build/';
		$this->build_dir = $template_dir . 'resources/Public/Build/';
		$this->ext_path = $template_uri . 'resources/Public/ext/';
		$this->ext_dir = $template_dir . 'resources/Public/ext/';
		$this->hot_file = $template_dir . 'resources/Private/.vite/hot';
		$this->legacy_hot_file = $template_dir . '.vite/hot';

		add_action('wp_head', [$this, 'renderFavicon'], 1);
	}

	public function renderFavicon(): void
	{
		if ($this->isDevelopment() || !$this->hasGeneratedAssets()) {
			return;
		}

		$favicon_data = $this->getFaviconData();

		if (!$favicon_data) {
			return;
		}

		echo $this->compileFaviconHtml($favicon_data);
	}

	private function hasGeneratedAssets(): bool
	{
		foreach (['favicon.ico', 'favicon-32x32.png', 'apple-touch-icon.png', 'android-chrome-192x192.png'] as $file) {
			if (file_exists($this->build_dir . $file)) {
				return true;
			}
		}

		return false;
	}

	private function isDevelopment(): bool
	{
		return file_exists($this->hot_file) || file_exists($this->legacy_hot_file);
	}

	private function getFaviconData(): ?array
	{
		$manifest_file = 'manifest.webmanifest';

		if (!file_exists($this->ext_dir . $manifest_file)) {
			$this->createCustomWebManifest($manifest_file);
		}

		return [
			'manifest' => file_exists($this->ext_dir . $manifest_file) ? $this->ext_path . $manifest_file : null,
			'theme_color' => $this->getThemeColor(),
			'favicons' => $this->getFilesForGroup('favicons'),
			'apple' => $this->getFilesForGroup('appleIcon'),
			'android' => $this->getFilesForGroup('android'),
			'appleStartup' => $this->getFilesForGroup('appleStartup'),
		];
	}

	private function createCustomWebManifest(string $manifest_file): void
	{
		if (!wp_mkdir_p($this->ext_dir)) {
			return;
		}

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

		foreach ($this->getFilesForGroup('android') as $filename => $url) {
			if (!preg_match('/(\d+)x(\d+)/', $filename, $matches)) {
				continue;
			}

			$manifest['icons'][] = [
				'src' => $url,
				'sizes' => $matches[1] . 'x' . $matches[2],
				'type' => 'image/png',
			];
		}

		file_put_contents($this->ext_dir . $manifest_file, wp_json_encode($manifest, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES));
	}

	private function getFilesForGroup(string $group): array
	{
		$files = [];

		foreach ($this->favicon_config[$group] ?? [] as $file) {
			if (file_exists($this->build_dir . $file)) {
				$files[$file] = $this->build_path . $file;
			}
		}

		return $files;
	}

	private function getThemeColor(): string
	{
		$options = function_exists('get_fields') ? get_fields('options') : [];

		return $options['general_theme_color'] ?? '#000000';
	}

	private function getBackgroundColor(): string
	{
		$options = function_exists('get_fields') ? get_fields('options') : [];

		return $options['general_background_color'] ?? '#ffffff';
	}

	private function compileFaviconHtml(array $favicon_data): string
	{
		$html = [];

		foreach ($favicon_data['favicons'] as $filename => $url) {
			if (str_ends_with($filename, '.ico')) {
				$html[] = '<link href="' . esc_url($url) . '" rel="icon" type="image/x-icon" />';
				continue;
			}

			if (!preg_match('/(\d+)x(\d+)/', $filename, $matches)) {
				continue;
			}

			$html[] = '<link href="' . esc_url($url) . '" rel="icon" sizes="' . $matches[1] . 'x' . $matches[2] . '" type="image/png" />';
		}

		if (!empty($favicon_data['manifest'])) {
			$html[] = '<link href="' . esc_url($favicon_data['manifest']) . '" rel="manifest" />';
		}

		$html[] = '<meta content="yes" name="mobile-web-app-capable" />';
		$html[] = '<meta content="' . esc_attr($favicon_data['theme_color']) . '" name="theme-color" />';
		$html[] = '<meta content="' . esc_attr(get_bloginfo('name')) . '" name="application-name" />';

		foreach ($favicon_data['apple'] as $filename => $url) {
			if (preg_match('/(\d+)x(\d+)/', $filename, $matches)) {
				$html[] = '<link href="' . esc_url($url) . '" rel="apple-touch-icon" sizes="' . $matches[1] . 'x' . $matches[2] . '" />';
				continue;
			}

			$html[] = '<link href="' . esc_url($url) . '" rel="apple-touch-icon" />';
		}

		$html[] = '<meta content="yes" name="apple-mobile-web-app-capable" />';
		$html[] = '<meta content="black-translucent" name="apple-mobile-web-app-status-bar-style" />';
		$html[] = '<meta content="' . esc_attr(get_bloginfo('name')) . '" name="apple-mobile-web-app-title" />';

		foreach ($favicon_data['appleStartup'] as $filename => $url) {
			if (!preg_match('/(\d+)x(\d+)/', $filename, $matches)) {
				continue;
			}

			$html[] =
				'<link href="' .
				esc_url($url) .
				'" rel="apple-touch-startup-image" media="screen and (device-width: ' .
				$matches[1] .
				'px) and (device-height: ' .
				$matches[2] .
				'px) and (-webkit-device-pixel-ratio: 2)" />';
		}

		return implode("\n\t", $html) . "\n";
	}
}
