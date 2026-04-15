<?php

namespace InertiaTheme;

use InertiaTheme\Controller\AcfController;
use InertiaTheme\Controller\NewsController;

class ACFContent
{
	public static function getAcfContent(?int $id = null): array
	{
		if (!function_exists('get_fields')) {
			return [];
		}

		$fields = $id ? get_fields($id) : get_fields();

		if (!is_array($fields)) {
			$fields = [];
		}

		$fields = self::enrichImagesWithAcf($fields);
		$fields = self::processFlexibleContent($fields, $id);

		return (array) apply_filters('inertia_theme/acf_content/fields', $fields, $id);
	}

	private static function processFlexibleContent(array $fields, ?int $id): array
	{
		if (empty($fields['flexible_content']) || !is_array($fields['flexible_content'])) {
			return $fields;
		}

		$layout_handlers = apply_filters('inertia_theme/acf_content/layout_handlers', [
			'all_news' => [NewsController::class, 'handleAllNews'],
		]);

		foreach ($fields['flexible_content'] as &$section) {
			$layout = $section['acf_fc_layout'] ?? null;
			$handler = $layout ? $layout_handlers[$layout] ?? null : null;

			if (!is_callable($handler)) {
				continue;
			}

			$processed = call_user_func($handler, $section, $fields, $id);

			if (is_array($processed)) {
				$section = $processed;
			}
		}

		unset($section);

		return $fields;
	}

	private static function enrichImagesWithAcf(array $fields): array
	{
		foreach ($fields as $key => $value) {
			if (!is_array($value)) {
				continue;
			}

			if (isset($value['id'], $value['url']) && is_numeric($value['id']) && function_exists('get_fields')) {
				$image_acf = get_fields((int) $value['id']);

				if (is_array($image_acf)) {
					$fields[$key]['acf'] = $image_acf;
				}

				continue;
			}

			$fields[$key] = self::enrichImagesWithAcf($value);
		}

		return $fields;
	}
}
