<?php

// Run with ddev wp eval-file scripts/checks/wpml-compatibility.php.
use InertiaTheme\ACFConfig;
use InertiaTheme\Controller\GravityFormController;
use InertiaTheme\Globals;
use InertiaTheme\InertiaShare;
use InertiaTheme\Languages;

if (!defined('WP_CLI') || !WP_CLI) {
	exit(1);
}

if (defined('ICL_SITEPRESS_VERSION') || has_filter('wpml_current_language')) {
	WP_CLI::log('Skipping simulated WPML checks because the plugin is active.');
	return;
}

$check = static function (bool $condition, string $message): void {
	if (!$condition) {
		WP_CLI::error($message);
	}
};

$check(Languages::current() === null, 'Expected a clean WordPress locale fallback.');
$check(acf_get_options_page('theme_settings_default')['post_id'] === 'theme_settings', 'Default options storage changed.');
$check(apply_filters('acf/update_field', ['wpml_cf_preferences' => 2])['wpml_cf_preferences'] === 2, 'An explicit translation preference was overwritten.');

$languageStack = ['en'];
add_filter('wpml_setting', static fn($value, $key) => $key === 'active_languages' ? ['en', 'sk', 'de'] : $value, 10, 2);
add_filter('wpml_current_language', static function () use (&$languageStack): string {
	return end($languageStack);
});
add_action('wpml_switch_language', static function (?string $language) use (&$languageStack): void {
	if ($language === null) {
		array_pop($languageStack);
	} else {
		$languageStack[] = $language;
	}
});

$config = new ACFConfig();
$config->register();
$check(acf_get_options_page('theme_settings_sk')['post_id'] === 'theme_settings_sk', 'Existing localized options storage changed.');
foreach (['theme_settings_default', 'theme_settings_sk'] as $page) {
	$groups = acf_get_field_groups(['options_page' => $page]);
	$check(in_array('group_theme_settings', array_column($groups, 'key'), true), "Theme settings fields are missing on {$page}.");
}

$values = ['theme_settings' => 'Default CTA', 'theme_settings_sk' => 'Slovak CTA', 'theme_settings_de' => null];
add_filter(
	'acf/pre_load_meta',
	static function ($meta, $postId) use ($values) {
		if (!array_key_exists($postId, $values)) {
			return $meta;
		}
		return $values[$postId] === null ? [] : ['cta_text' => $values[$postId], '_cta_text' => 'field_691c8b464b40d'];
	},
	10,
	2,
);
add_filter(
	'acf/pre_load_metadata',
	static function ($value, $postId, $field, $hidden) use ($values) {
		if ($field !== 'cta_text' || !isset($values[$postId])) {
			return $value;
		}
		return $hidden ? 'field_691c8b464b40d' : $values[$postId];
	},
	10,
	4,
);
add_filter('inertia_theme/public_acf_options', static fn() => ['theme_settings_default' => ['cta_text'], 'theme_settings_sk' => ['cta_text']]);

$share = new InertiaShare();
do_action('wpml_switch_language', 'sk');
$options = $share->filterAcfShare(['options' => ['theme_settings_default' => ['unlisted' => 'Private']]])['options'];
$check(str_contains($options->theme_settings_default['cta_text'] ?? '', 'Slovak CTA'), 'Legacy option alias did not resolve the stored translation.');
$check(str_contains($options->theme_settings_sk['cta_text'] ?? '', 'Slovak CTA'), 'Localized option slug did not resolve the stored translation.');
$check(array_keys($options->theme_settings_default) === ['cta_text'], 'The public options allowlist changed.');
$check(Globals::getSiteLanguage() === 'sk', 'The HTML language did not follow the WPML hook.');
do_action('wpml_switch_language', null);

do_action('wpml_switch_language', 'de');
$options = $share->filterAcfShare([])['options'];
$check(str_contains($options->theme_settings_default['cta_text'] ?? '', 'Default CTA'), 'Missing translation did not fall back to the original settings.');
do_action('wpml_switch_language', null);

$check(Languages::switchForRequest('all') === null && Languages::switchForRequest('unknown') === null, 'A non-active language was accepted.');

$formLanguage = null;
add_filter('gform_pre_render', static function ($form) use (&$formLanguage) {
	$formLanguage = Languages::current();
	$form['button']['text'] = 'Translated submit label';
	return $form;
});
$form = new GravityFormController()->getForm(1, 'sk');
$check(
	is_array($form) && $form['button']['text'] === 'Translated submit label' && $formLanguage === 'sk',
	'Form definition did not use the requested language.',
);
$check(Languages::current() === 'en', 'Loading the form leaked its language scope.');

$request = new WP_REST_Request('POST', '/gf/v2/forms/1/submissions');
$request->set_query_params(['lang' => 'sk']);
apply_filters('rest_request_before_callbacks', null, [], $request);
$check(Languages::current() === 'sk', 'REST submission did not switch language.');
apply_filters('rest_request_after_callbacks', new WP_Error('invalid_form'), [], $request);
$check($languageStack === ['en'], 'REST validation failure leaked its language scope.');

define('ICL_SITEPRESS_VERSION', '4.8.0');
$switches = [];
add_action('wpml_switch_language', static function ($language) use (&$switches): void {
	$switches[] = $language;
});
Languages::switchForRequest('sk')?->__invoke();
$check($switches === ['sk', 'en'], 'Legacy WPML did not restore the previous language by code.');

WP_CLI::success('Simulated WPML passed for ACF storage, language fallback, and Gravity Forms.');
