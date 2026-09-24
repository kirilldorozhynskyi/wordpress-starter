<?php

namespace InertiaTheme\Model;

class GravityForm
{
	public function __construct()
	{
		add_filter('gform_field_validation', [$this, 'validatePhoneField'], 10, 4);
		add_action('init', [$this, 'captureUtmParams']);
	}

	public function captureUtmParams(): void
	{
		foreach (['utm_source', 'utm_medium'] as $key) {
			if (empty($_GET[$key])) {
				continue;
			}

			$value = sanitize_text_field(wp_unslash($_GET[$key]));
			setcookie($key, $value, time() + 60 * 60 * 24 * 90, COOKIEPATH ?: '/', COOKIE_DOMAIN ?: '', is_ssl(), false);
			$_COOKIE[$key] = $value;
		}
	}

	public function validatePhoneField(array $result, mixed $value, array $form, object $field): array
	{
		unset($form);

		if (($field->type ?? null) !== 'phone') {
			return $result;
		}

		$raw = is_string($value) ? trim($value) : '';

		if ($raw === '') {
			return $result;
		}

		$normalized = preg_replace('/[\s\-\.\(\)]/', '', $raw) ?? '';

		if (!preg_match('/^\+?\d{7,15}$/', $normalized)) {
			$result['is_valid'] = false;
			$result['message'] = __('Incorrect phone number.', 'jdev');
		}

		return $result;
	}
}
