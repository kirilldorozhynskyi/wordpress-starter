<?php

namespace JDEV;

use EvoMark\InertiaWordpress\Inertia;
use EvoMark\InertiaWordpress\Helpers\Path;
use EvoMark\InertiaWordpress\Helpers\Settings;

class Vite
{
	private string $entryFile;
	private string $entryNamespace;
	private string $buildUrl;
	private string $hotFile;
	private string $manifestPath;
	private array $manifest = [];

	public function __construct()
	{
		$this->entryFile = Settings::get('entry_file') ?? 'resources/js/main.js';
		$this->entryNamespace = Settings::get('entry_namespace') ?? 'theme-inertia';

		$uploads = wp_upload_dir();
		$namespacePath = Path::join($uploads['basedir'], 'scw-vite-hmr', $this->entryNamespace);

		$this->hotFile = Path::join($namespacePath, 'hot');
		$this->manifestPath = Path::join($namespacePath, 'build', 'manifest.json');
		$this->buildUrl = trailingslashit($uploads['baseurl'] . '/scw-vite-hmr/' . $this->entryNamespace . '/build');

			add_action('wp_head', [$this, 'preloadFontAssets'], 1);
			add_action('after_setup_theme', [$this, 'loadSprite']);
		}

		public function loadSprite(): void
		{
			if ($this->isDevServer()) {
				$devUrl = $this->getDevServerUrl();
				if (empty($devUrl)) {
					return;
				}

				add_action('wp_enqueue_scripts', function () use ($devUrl) {
					$handle = 'vite_sprite_dev';
					wp_enqueue_script($handle, rtrim($devUrl, '/') . '/@vite-plugin-svg-spritemap/client__spritemap', [], null, true);
					wp_script_add_data($handle, 'type', 'module');
				}, 100);

				Inertia::share('sprite', '');
				return;
			}

			$this->ensureManifestLoaded();
			if (!$this->manifest || empty($this->manifest['spritemap.svg']['file'])) {
				return;
			}

			Inertia::share('sprite', $this->buildUrl . $this->manifest['spritemap.svg']['file']);
		}

	public function preloadFontAssets(): void
	{
		if ($this->isDevServer()) {
			return;
		}

		$this->ensureManifestLoaded();
		if (!$this->manifest) {
			return;
		}

		$preloaded = [];

		foreach ($this->manifest as $asset) {
			if (empty($asset['file']) || !preg_match('/\.woff2$/', $asset['file'])) {
				continue;
			}

			if (in_array($asset['file'], $preloaded, true)) {
				continue;
			}

			echo '<link rel="preload" href="' . esc_url($this->buildUrl . $asset['file']) . '" as="font" type="font/woff2" crossorigin="anonymous">' . PHP_EOL;

			$preloaded[] = $asset['file'];
		}
	}

	private function isDevServer(): bool
	{
		return file_exists($this->hotFile);
	}

	private function getDevServerUrl(): ?string
	{
		if (!$this->isDevServer()) {
			return null;
		}

		$url = file_get_contents($this->hotFile);
		return $url ? trim($url) : null;
	}

	private function ensureManifestLoaded(): void
	{
		if ($this->manifest || !file_exists($this->manifestPath)) {
			return;
		}

		$manifestContent = file_get_contents($this->manifestPath);
		$decoded = json_decode($manifestContent, true);

		if (json_last_error() === JSON_ERROR_NONE && is_array($decoded)) {
			$this->manifest = $decoded;
		}
	}
}
