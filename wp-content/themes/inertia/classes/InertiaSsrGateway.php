<?php

namespace InertiaTheme;

use EvoMark\InertiaWordpress\Data\SsrResponse;
use EvoMark\InertiaWordpress\Helpers\Path;
use EvoMark\InertiaWordpress\Helpers\Settings;
use EvoMark\InertiaWordpress\Ssr\HttpGateway;
use Throwable;

class InertiaSsrGateway extends HttpGateway
{
	public static function bundlePath(): string
	{
		return Path::join(get_stylesheet_directory(), 'resources', 'Private', '.vite', 'ssr', 'ssr.mjs');
	}

	public function dispatch(array $page): ?SsrResponse
	{
		if (!Settings::get('ssr_enabled')) {
			return null;
		}

		// The upstream gateway resolves its own bundle path inside uploads.
		if (!is_file(self::bundlePath())) {
			$this->failed('SSR bundle not found at ' . self::bundlePath());
			return null;
		}

		try {
			$response = $this->client->request('POST', $this->url('/render'), ['json' => $page, 'http_errors' => false]);
		} catch (Throwable $error) {
			$this->failed('SSR request failed: ' . $error->getMessage(), $error);
			return null;
		}

		if ($response->getStatusCode() !== 200) {
			$this->failed('SSR server responded with status ' . $response->getStatusCode());
			return null;
		}

		$data = json_decode((string) $response->getBody(), true);
		if (!is_array($data) || !is_string($data['body'] ?? null)) {
			$this->failed('SSR server returned an invalid response');
			return null;
		}

		return new SsrResponse(array_values((array) ($data['head'] ?? [])), $data['body']);
	}
}
