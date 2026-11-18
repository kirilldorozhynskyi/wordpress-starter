<?php

// Run with: ddev wp eval-file scripts/checks/gravity-forms.php
if (!defined('WP_CLI') || !WP_CLI) {
	exit(1);
}

if (wp_get_environment_type() !== 'development') {
	WP_CLI::error('The Gravity Forms integration test requires a development WordPress database.');
}
if (!class_exists(GFAPI::class)) {
	WP_CLI::error('Activate Gravity Forms before running the integration test.');
}

$assert = static function (bool $condition, string $message): void {
	if (!$condition) {
		throw new RuntimeException($message);
	}
};
$dispatch = static function (string $method, string $route, array $params = []): WP_REST_Response {
	$request = new WP_REST_Request($method, $route);
	if ($method === 'GET') {
		$request->set_query_params($params);
		return rest_do_request($request);
	}

	// PHP normally populates these values before WordPress dispatches a multipart request.
	$previousPost = $_POST;
	$_POST = $params;
	$request->set_header('Content-Type', 'multipart/form-data');
	$request->set_body_params($params);
	try {
		return rest_do_request($request);
	} finally {
		$_POST = $previousPost;
	}
};

wp_set_current_user(0);
add_filter('pre_wp_mail', '__return_true', PHP_INT_MAX);
$formId = GFAPI::add_form([
	'title' => 'Starter integration test ' . wp_generate_uuid4(),
	'button' => ['type' => 'text', 'text' => 'Send test'],
	'notifications' => [],
	'fields' => [
		['id' => 1, 'type' => 'text', 'label' => 'Name', 'isRequired' => true],
		['id' => 2, 'type' => 'phone', 'label' => 'Phone', 'isRequired' => true, 'phoneFormat' => 'international'],
		['id' => 3, 'type' => 'text', 'label' => 'Internal', 'visibility' => 'administrative'],
		['id' => 4, 'type' => 'fileupload', 'label' => 'Attachment', 'allowedExtensions' => 'txt'],
	],
]);
if (is_wp_error($formId)) {
	WP_CLI::error($formId->get_error_message());
}

try {
	try {
		$definition = $dispatch('GET', '/inertia/v1/get-form', ['id' => $formId, 'lang' => 'en']);
		$fields = $definition->get_data()['fields'] ?? [];
		$assert(
			$definition->get_status() === 200 && array_column($fields, 'key') === ['input_1', 'input_2', 'input_4'],
			'The public API returned incorrect fields.',
		);

		$route = '/gf/v2/forms/' . $formId . '/submissions';
		$postData = ['input_1' => 'Starter test', 'input_2' => '+421900123456'];
		$blocked = $dispatch('POST', $route, $postData);
		$assert($blocked->get_status() === 404 && GFAPI::count_entries($formId) === 0, 'The form accepted a submission outside the public allowlist.');

		add_filter('inertia_theme/public_gravity_form_ids', static fn(array $ids): array => [...$ids, $formId]);
		$invalid = $dispatch('POST', $route, ['input_2' => 'not-a-phone']);
		$data = $invalid->get_data();
		$assert(
			$invalid->get_status() === 400 && ($data['is_valid'] ?? null) === false && isset($data['validation_messages'][1], $data['validation_messages'][2]),
			'Gravity Forms did not report both the required field and invalid phone number.',
		);
		$assert(GFAPI::count_entries($formId) === 0, 'An invalid submission was saved.');

		// A new HTTP request would reload field objects without their previous validation state.
		unset(GFFormDisplay::$submission[$formId]);
		GFFormsModel::flush_current_form(GFFormsModel::get_form_cache_key($formId));
		$success = $dispatch('POST', $route, $postData);
		$data = $success->get_data();
		$assert(
			$success->get_status() === 200 && ($data['is_valid'] ?? false) === true,
			'Gravity Forms rejected a valid submission: ' .
				wp_json_encode([
					'status' => $success->get_status(),
					'code' => $data['code'] ?? null,
					'validation' => $data['validation_messages'] ?? [],
				]),
		);
		$assert(!isset($data['entry_id']), 'The public response revealed the stored entry ID.');
		$entries = GFAPI::get_entries($formId);
		$assert(is_array($entries) && count($entries) === 1 && ($entries[0]['1'] ?? '') === 'Starter test', 'The accepted submission was not saved once.');
	} finally {
		$deleted = GFAPI::delete_form($formId);
		$assert($deleted === true && !GFAPI::get_form($formId), 'The temporary form could not be deleted.');
	}
} catch (Throwable $error) {
	WP_CLI::error($error->getMessage());
}

WP_CLI::success('Gravity Forms REST validation, allowlist, entry storage and cleanup passed.');
