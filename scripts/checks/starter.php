<?php

// Run with: ddev wp eval-file scripts/checks/starter.php
if (!defined('WP_CLI') || !WP_CLI) {
	exit(1);
}

$check = static function (bool $condition, string $message): void {
	if (!$condition) {
		WP_CLI::error($message);
	}
	WP_CLI::success($message);
};

$check(defined('JD_SUPPORT_VERSION'), 'jD Support loads.');
$check(is_plugin_active('syncport/syncport.php'), 'Syncport is active.');
$check(class_exists('YahnisElsts\\PluginUpdateChecker\\v5p5\\Vcs\\Api'), 'Inertia update-checker compatibility loads.');

$field = acf_get_field_type('jdev_link');
$check($field instanceof acf_field_link, 'Reusable ACF link field is registered.');
$url = home_url('/?p=1&ref=starter#section');
$stored = $field->update_value(['url' => $url, 'title' => 'Example', 'target' => '_blank'], 0, []);
$formatted = $field->format_value($stored, 0, []);
$check($formatted['url'] === $url && $formatted['target'] === '_blank', 'ACF link round-trip preserves query, fragment and target.');

$unsafeLink = $field->format_value(['url' => 'javascript:alert(1)', 'title' => 'Unsafe'], 0, []);
$check($unsafeLink === false, 'ACF link field rejects unsafe URL schemes.');

$originalGet = $_GET;
$limit = null;
$captureLimit = static function ($query) use (&$limit): void {
	if ($query->get('post_type') === apply_filters('inertia_theme/news/post_type', 'post')) {
		$limit = $query->get('posts_per_page');
	}
};
add_action('pre_get_posts', $captureLimit);
try {
	$_GET = ['number_of_posts' => 1000000, 'term' => ['invalid']];
	new InertiaTheme\Controller\NewsController()->getNews();
} finally {
	$_GET = $originalGet;
	remove_action('pre_get_posts', $captureLimit);
}
$check($limit === 100, 'Public news queries are capped at 100 and tolerate malformed term input.');

$controller = new InertiaTheme\Controller\GravityFormController();
$missingForm = $controller->getForm(0);
$check(is_wp_error($missingForm) && $missingForm->get_error_data()['status'] === 400, 'Invalid form IDs return a controlled error.');
foreach (GFAPI::get_forms() as $form) {
	$data = $controller->getForm((int) $form['id']);
	$check(is_array($data) && !isset($data['notifications']), 'Form ' . $form['id'] . ' loads without notification configuration.');
}
