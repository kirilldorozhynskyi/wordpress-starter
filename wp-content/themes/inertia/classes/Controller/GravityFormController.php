<?php

namespace InertiaTheme\Controller;

use GFAPI;
use WP_Error;

class GravityFormController
{
	private ?bool $canUseWpmlStrings = null;

	public function getForm(int $formId, string $lang = ''): array|WP_Error
	{
		if ($formId <= 0) {
			return new WP_Error('gravity_form_invalid_id', __('Invalid form id.', 'jdev'), ['status' => 400]);
		}

		if (!class_exists(GFAPI::class)) {
			return new WP_Error('gravity_form_api_unavailable', __('Gravity Forms API is not available.', 'jdev'), ['status' => 503]);
		}

		if ($lang) {
			do_action('wpml_switch_language', $lang);
		}

		$form = GFAPI::get_form($formId);

		if (!$form || !is_array($form)) {
			return new WP_Error('gravity_form_not_found', __('Gravity form was not found.', 'jdev'), ['status' => 404]);
		}

		unset($form['notifications'], $form['date_created']);

		if (!empty($form['fields']) && is_array($form['fields'])) {
			foreach ($form['fields'] as &$field) {
				$field = $this->normalizeField($field, $lang);
			}
			unset($field);
		}

		return $form;
	}

	private function normalizeField(mixed $field, string $lang): array
	{
		if (is_object($field) && method_exists($field, 'to_array')) {
			$field = $field->to_array();
		} elseif (is_object($field)) {
			$field = (array) $field;
		}

		if (!is_array($field)) {
			return [];
		}

		$field = $this->removeInternalFieldProperties($field);

		$field['key'] = 'input_' . ($field['id'] ?? '');

		if (($field['type'] ?? null) === 'consent' && !empty($field['inputs'][0]['id'])) {
			$field['key'] = 'input_' . $field['inputs'][0]['id'];
		}

		if (in_array($field['type'] ?? '', ['checkbox', 'multi_choice'], true) && !empty($field['choices'])) {
			foreach ($field['choices'] as $index => &$choice) {
				$choice['key'] = 'input_' . $field['id'] . '_' . ($index + 1);
				if (isset($choice['text']) && is_string($choice['text'])) {
					$choice['text'] = $this->translateString($choice['text'], $lang);
				}
				if (isset($choice['value']) && is_string($choice['value'])) {
					$choice['value'] = $this->translateString($choice['value'], $lang);
				}
			}
			unset($choice);
		}

		foreach (['label', 'placeholder', 'checkboxLabel', 'content', 'text'] as $key) {
			if (isset($field[$key]) && is_string($field[$key])) {
				$field[$key] = $this->translateString($field[$key], $lang);
			}
		}

		return $field;
	}

	private function translateString(string $original, string $lang): string
	{
		global $wpdb;

		if (!$lang || !isset($wpdb->prefix) || !$this->canUseWpmlStrings()) {
			return $original;
		}

		$strings_table = $wpdb->prefix . 'icl_strings';
		$translations_table = $wpdb->prefix . 'icl_string_translations';

		$string_id = $wpdb->get_var($wpdb->prepare("SELECT id FROM {$strings_table} WHERE value = %s", $original));

		if (!$string_id) {
			return $original;
		}

		$translation = $wpdb->get_var(
			$wpdb->prepare("SELECT value FROM {$translations_table} WHERE string_id = %d AND language = %s AND status = 10", $string_id, $lang),
		);

		return is_string($translation) && $translation !== '' ? $translation : $original;
	}

	private function removeInternalFieldProperties(array $field): array
	{
		$normalized = [];

		foreach ($field as $key => $value) {
			if (is_string($key) && str_contains($key, "\0")) {
				continue;
			}

			$normalized[$key] = $value;
		}

		return $normalized;
	}

	private function canUseWpmlStrings(): bool
	{
		global $wpdb;

		if ($this->canUseWpmlStrings !== null) {
			return $this->canUseWpmlStrings;
		}

		if (!defined('ICL_SITEPRESS_VERSION') || !isset($wpdb->prefix)) {
			$this->canUseWpmlStrings = false;

			return $this->canUseWpmlStrings;
		}

		$stringsTable = $wpdb->prefix . 'icl_strings';
		$translationsTable = $wpdb->prefix . 'icl_string_translations';

		$hasStringsTable = $wpdb->get_var($wpdb->prepare('SHOW TABLES LIKE %s', $stringsTable)) === $stringsTable;
		$hasTranslationsTable = $wpdb->get_var($wpdb->prepare('SHOW TABLES LIKE %s', $translationsTable)) === $translationsTable;

		$this->canUseWpmlStrings = $hasStringsTable && $hasTranslationsTable;

		return $this->canUseWpmlStrings;
	}
}
