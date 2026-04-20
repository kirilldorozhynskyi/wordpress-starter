<?php

namespace InertiaTheme;

use EvoMark\InertiaWordpress\Inertia;
use Exception;

class Vite
{
	const VITE_MANIFEST_PATH = '/resources/Public/Build/manifest.json';
	const MAIN_ENTRY = 'resources/Private/js/main.ts';

	protected array $viteManifest = [];
	protected static string $spriteUrl = '';
	private bool $headCleanupBufferStarted = false;

	public function __construct()
	{
		$this->loadViteManifest();
		add_action('wp_head', [$this, 'startHeadAssetCleanup'], 0);
		add_action('wp_head', [$this, 'preloadAssetsVite'], 1);
		add_action('wp_head', [$this, 'finishHeadAssetCleanup'], PHP_INT_MAX);
		add_action('wp_footer', [$this, 'loadBodyThemeAssets']);
		add_action('wp_enqueue_scripts', [$this, 'loadHeadThemeAssets']);

		add_filter('script_loader_tag', [$this, 'addModuleTypeToViteScript'], 10, 3);
		add_filter('script_loader_tag', [$this, 'addModuleTypeToViteSprite'], 10, 3);
	}

	public function addModuleTypeToViteScript($tag, $handle, $src): string
	{
		if ($this->isHot() && ($handle === 'app_theme' || $handle === 'theme-inertia' || $handle === 'theme-inertia-js' || $handle === 'vite_client' || $handle === 'vite-client')) {
			$tag = '<script type="module" src="' . esc_url($src) . '"></script>';
		} elseif ($handle === 'app' || $handle === 'theme-inertia' || $handle === 'theme-inertia-js') {
			$src = remove_query_arg('ver', $src);
			$tag = '<script type="module" src="' . esc_url($src) . '"></script>';
		}
		return $tag;
	}

	public function startHeadAssetCleanup(): void
	{
		if ($this->isHot() || empty($this->viteManifest)) {
			return;
		}

		ob_start();
		$this->headCleanupBufferStarted = true;
	}

	public function finishHeadAssetCleanup(): void
	{
		if (!$this->headCleanupBufferStarted || ob_get_level() === 0) {
			return;
		}

		echo $this->cleanupDuplicateBuildAssetTags((string) ob_get_clean());
		$this->headCleanupBufferStarted = false;
	}

	public function preloadAssetsVite(): void
	{
		if (empty($this->viteManifest)) {
			return;
		}

		$mainEntry = self::MAIN_ENTRY;
		$pageEntry = $this->getCurrentInertiaPageEntry();

		foreach ($this->getCriticalFontFiles($mainEntry) as $font) {
			echo '<link rel="preload" href="' . esc_url($this->getBuildAssetUrl($font)) . '" as="font" type="font/woff2" crossorigin="anonymous">' . PHP_EOL;
		}

		foreach ($this->getThemeCssFiles($mainEntry, $pageEntry) as $css) {
			echo '<link rel="preload" href="' . esc_url($this->getBuildAssetUrl($css)) . '" as="style">' . PHP_EOL;
		}

		foreach ($this->getManifestModuleFiles(array_filter([$mainEntry, $pageEntry])) as $moduleFile) {
			echo '<link rel="modulepreload" href="' . esc_url($this->getBuildAssetUrl($moduleFile)) . '" crossorigin>' . PHP_EOL;
		}
	}

	public function loadBodyThemeAssets(): void
	{
		if ($this->isHot()) {
			return;
		} else {
			// Production mode
		}
	}

	public function loadHeadThemeAssets(): void
	{
		if ($this->isHot()) {
			// Deactivate the plugin's default script during Dev to avoid conflicts
			wp_dequeue_script('theme-inertia-js');
			return;
		}

		$mainEntry = self::MAIN_ENTRY;
		if (empty($this->viteManifest[$mainEntry]['css'])) {
			return;
		}

		$pageEntry = $this->getCurrentInertiaPageEntry();
		$cssFiles = $this->getThemeCssFiles($mainEntry, $pageEntry);

		foreach ($cssFiles as $index => $css) {
			$handle = $index === 0 ? 'theme-styles' : 'theme-styles-' . md5($css);
			wp_enqueue_style($handle, $this->getBuildAssetUrl($css), [], false);
		}
	}

	protected function loadViteManifest($manifestPath = ''): void
	{
		if (!$this->isHot()) {
			$manifestPath = $manifestPath ?: get_template_directory() . self::VITE_MANIFEST_PATH;

			if (!file_exists($manifestPath)) {
				return;
			}

			$manifestContent = file_get_contents($manifestPath);
			$decodedManifest = json_decode($manifestContent, true);

			if (json_last_error() !== JSON_ERROR_NONE) {
				throw new Exception(sprintf('[Vite] Invalid JSON in manifest: %s.', $manifestPath));
			}

			$this->viteManifest = $decodedManifest;
		}

		self::$spriteUrl = $this->isHot()
			? ''
			: get_template_directory_uri() .
				'/resources/Public/Build/' .
				($this->viteManifest['spritemap.svg']['file'] ?? '') .
				'?v=' .
				$this->getBuildVersion();

		Inertia::share('sprite', self::$spriteUrl);
	}

	public function addModuleTypeToViteSprite($tag, $handle, $src): string
	{
		if ($this->isHot() && ($handle === 'app_theme_sprite' || $handle === 'theme-inertia-sprite' || $handle === 'vite_client' || $handle === 'vite-client')) {
			$tag = '<script type="module" src="' . esc_url($src) . '"></script>';
		}

		return $tag;
	}

	public function getViteManifest(): array
	{
		return $this->viteManifest;
	}

	protected function getBuildAssetUrl(string $assetPath): string
	{
		return get_template_directory_uri() . '/resources/Public/Build/' . ltrim($assetPath, '/');
	}

	private function cleanupDuplicateBuildAssetTags(string $html): string
	{
		$buildAssetsPath = preg_quote('/wp-content/themes/inertia/resources/Public/Build/assets/', '#');
		$versionPattern = '(?:\?ver=|&ver=|&amp;ver=|&\#038;ver=)';

		return preg_replace(
			'#\s*<link\b(?=[^>]*\bhref=(["\'])[^"\']*' . $buildAssetsPath . '[^"\']*' . $versionPattern . '[^"\']*\1)[^>]*>\s*#i',
			PHP_EOL,
			$html,
		) ?? $html;
	}

	protected function getCurrentInertiaPageEntry(): ?string
	{
		// EvoMark\InertiaWordpress handles page passing differently but we can check the block or global
		return null; // In standard InertiaWordpress you might need to extract page props
	}

	protected function getManifestGraph(string $entryKey, array &$visited = []): array
	{
		if (isset($visited[$entryKey]) || !isset($this->viteManifest[$entryKey])) {
			return [];
		}

		$visited[$entryKey] = true;
		$graph = [$entryKey];

		foreach ($this->viteManifest[$entryKey]['imports'] ?? [] as $importKey) {
			$graph = array_merge($graph, $this->getManifestGraph($importKey, $visited));
		}

		return $graph;
	}

	protected function getManifestModuleFiles(array $entryKeys): array
	{
		$visited = [];
		$files = [];

		foreach ($entryKeys as $entryKey) {
			foreach ($this->getManifestGraph($entryKey, $visited) as $manifestKey) {
				$file = $this->viteManifest[$manifestKey]['file'] ?? null;
				if (is_string($file) && str_ends_with($file, '.js')) {
					$files[] = $file;
				}
			}
		}

		return array_values(array_unique($files));
	}

	protected function getManifestCssFiles(array $entryKeys): array
	{
		$visited = [];
		$cssFiles = [];

		foreach ($entryKeys as $entryKey) {
			foreach ($this->getManifestGraph($entryKey, $visited) as $manifestKey) {
				$cssFiles = array_merge($cssFiles, $this->viteManifest[$manifestKey]['css'] ?? []);
			}
		}

		return array_values(array_unique($cssFiles));
	}

	protected function getThemeCssFiles(?string $mainEntry = null, ?string $pageEntry = null): array
	{
		$mainEntry = $mainEntry ?: self::MAIN_ENTRY;
		$pageEntry = $pageEntry ?: $this->getCurrentInertiaPageEntry();
		$cssFiles = $this->viteManifest[$mainEntry]['css'] ?? [];

		if ($pageEntry) {
			$cssFiles = array_merge($cssFiles, $this->getManifestCssFiles([$pageEntry]));
		}

		return array_values(array_unique($cssFiles));
	}

	protected function getCriticalFontFiles(string $entryKey): array
	{
		$assets = $this->viteManifest[$entryKey]['assets'] ?? [];
		$fonts = array_values(
			array_filter(
				$assets,
				static fn($asset) => is_string($asset) && str_ends_with($asset, '.woff2') && preg_match('/(Canela-Thin|Left21-Regular)/i', $asset),
			),
		);

		return array_values(array_unique($fonts));
	}

	public static function getSpriteUrl(): string
	{
		return self::$spriteUrl;
	}

	private function getBuildVersion(): string
	{
		$manifest_path = get_template_directory() . self::VITE_MANIFEST_PATH;
		return file_exists($manifest_path) ? (string) filemtime($manifest_path) : (string) time();
	}

	public function getHotFilePath(): string
	{
		return dirname(get_template_directory(), 3) . '/hot';
	}

	public function isHot(): bool
	{
		return file_exists($this->getHotFilePath());
	}
}
