<?php

namespace InertiaTheme;

use EvoMark\InertiaWordpress\Helpers\Header;
use EvoMark\InertiaWordpress\Request\RequestHandler;

class InertiaRequest extends RequestHandler
{
	public static function isServerNotFound(): bool
	{
		return ($_GET['starter_not_found'] ?? '') === '1';
	}

	public function checkForInertiaRequest(): bool
	{
		return !self::isServerNotFound() && parent::checkForInertiaRequest();
	}

	public static function sendPageHeaders(): void
	{
		header('Vary: X-Inertia', false);
		nocache_headers();
	}

	public function isPartial(): bool
	{
		$component = $this->getHeader(Header::PARTIAL_COMPONENT, '');

		return $component !== '' && explode('?', $component, 2)[0] === $this->component;
	}

	public function getPageData(): array
	{
		$page = parent::getPageData();
		$flash = $page['props']['flash'] ?? [];
		unset($page['props']['flash']);

		if ((array) $flash !== []) {
			$page['flash'] = (object) $flash;
		}

		// Page content and page-specific options must never carry over to instant visits.
		$page['sharedProps'] = array_values(array_intersect(['theme', 'sprite', 'wp', 'menu'], $this->sharedProps->keys()->all()));

		return $page;
	}

	public function body($args = [])
	{
		if ($this->getSsrResponse() !== null) {
			return parent::body($args);
		}

		$id = esc_attr($args['id'] ?? 'app');
		$class = esc_attr($args['class'] ?? '');
		$page = wp_json_encode($this->getPageData(), JSON_HEX_TAG | JSON_INVALID_UTF8_SUBSTITUTE);

		wp_body_open();

		echo '<script data-page="' . $id . '" type="application/json">' . $page . '</script>';
		echo '<div id="' . $id . '" class="' . $class . '"></div>';

		wp_footer();
	}
}
