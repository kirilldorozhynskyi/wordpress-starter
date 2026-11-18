<?php

namespace InertiaTheme\Model;

use InertiaTheme\Controller\GravityFormController;
use InertiaTheme\Languages;
use WeakMap;
use WP_Error;
use WP_REST_Request;

class GravityForm
{
	private WeakMap $languageScopes;

	public function __construct()
	{
		$this->languageScopes = new WeakMap();
		add_filter('gform_field_validation', [$this, 'validatePhoneField'], 10, 4);
		add_action('init', [$this, 'captureUtmParams']);
		add_filter('rest_pre_dispatch', [$this, 'restrictFormSubmissions'], 100, 3);
		add_filter('rest_request_before_callbacks', [$this, 'switchSubmissionLanguage'], 5, 3);
		add_filter('rest_request_after_callbacks', [$this, 'restoreSubmissionLanguage'], PHP_INT_MAX, 3);
	}

	public function restrictFormSubmissions(mixed $response, mixed $server, WP_REST_Request $request): mixed
	{
		$formId = $this->getSubmissionFormId($request);
		if ($formId === null || current_user_can('gravityforms_edit_forms')) {
			return $response;
		}

		if (!GravityFormController::isPublicForm($formId)) {
			return new WP_Error('gravity_form_not_found', __('Gravity form was not found.', 'jdev'), ['status' => 404]);
		}

		return $response;
	}

	public function switchSubmissionLanguage(mixed $response, array $handler, WP_REST_Request $request): mixed
	{
		if (!is_wp_error($response) && $this->getSubmissionFormId($request) !== null) {
			$restore = Languages::switchForRequest($request->get_query_params()['lang'] ?? null);
			if ($restore !== null) {
				$this->languageScopes[$request] = $restore;
			}
		}

		return $response;
	}

	public function restoreSubmissionLanguage(mixed $response, array $handler, WP_REST_Request $request): mixed
	{
		if (isset($this->languageScopes[$request])) {
			$restore = $this->languageScopes[$request];
			unset($this->languageScopes[$request]);
			$restore();
		}

		return $response;
	}

	private function getSubmissionFormId(WP_REST_Request $request): ?int
	{
		return $request->get_method() === 'POST' && preg_match('~^/gf/v2/forms/(\d+)/submissions/?$~', $request->get_route(), $matches)
			? (int) $matches[1]
			: null;
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
