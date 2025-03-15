<?php
namespace JDEV;

/**
 * Class ACFContent
 *
 * @package JDEV
 */
class ACFContent
{
	// Static list of section handlers
	private static $sections = [];

	/**
	 * Receives and processes content from ACF
	 *
	 * @return array
	 */
	public static function getAcfContent(): array
	{
		$fields = get_fields();
		if (empty($fields) || !is_array($fields)) {
			return [];
		}

		if (empty($fields['flexible_content']) || !is_array($fields['flexible_content'])) {
			return $fields;
		}

		foreach ($fields['flexible_content'] as &$section) {
			$layout = $section['acf_fc_layout'] ?? null;

			if ($layout && isset(self::$sections[$layout])) {
				[$class, $method] = self::$sections[$layout];

				if (is_callable([$class, $method])) {
					$class::$method($section);
				}
			}
		}

		return $fields;
	}
}
