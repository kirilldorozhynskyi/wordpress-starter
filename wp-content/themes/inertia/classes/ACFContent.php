<?php

namespace InertiaTheme;

use InertiaTheme\Controller\NewsController;

class ACFContent
{
	public static function getAcfContent(?int $id = null): array
	{
		if (!function_exists('get_fields')) {
			return [];
		}

		$id ??= get_queried_object_id();
		if (!$id || post_password_required($id)) {
			return [];
		}

		$fields = get_fields($id);

		if (!is_array($fields)) {
			$fields = [];
		}

		$publicFields = apply_filters('inertia_theme/public_acf_fields', ['flexible_content'], $id);
		$fields = self::processFlexibleContent(array_intersect_key($fields, array_flip($publicFields)), $id);

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

		$layoutFields = apply_filters(
			'inertia_theme/public_acf_layout_fields',
			[
				'page_hero' => ['text', 'image', 'image_mobile', 'video', 'button', 'add_to_submenu', 'title_nav'],
				'contact' => [],
				'cta' => ['title', 'text'],
			],
			$id,
		);

		$sections = [];
		foreach ($fields['flexible_content'] as $section) {
			$layout = $section['acf_fc_layout'] ?? '';
			if (!isset($layoutFields[$layout])) {
				continue;
			}

			$section = array_intersect_key($section, array_flip([...$layoutFields[$layout], 'acf_fc_layout', 'key']));
			$handler = $layout_handlers[$layout] ?? null;
			$processed = is_callable($handler) ? $handler($section, $fields, $id) : $section;
			$sections[] = is_array($processed) ? $processed : $section;
		}

		$fields['flexible_content'] = $sections;
		return $fields;
	}
}
