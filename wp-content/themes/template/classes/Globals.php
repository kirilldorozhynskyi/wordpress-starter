<?php

namespace JDEV;

use Timber\Site;

/**
 * Class Global
 *
 * @package JDEV
 */
class Globals
{
	/**
	 * Get Timber language and fix it to ISO 639-1 standard to prevent SEO warnings
	 *
	 * @param $fallbackLanguage
	 * @return string
	 */
	public static function getSiteLanguage(): string
	{
		$site = new Site();
		$siteLanguage = strtolower($site->language);
		return $siteLanguage ? explode('_', $siteLanguage)[0] : 'de';
	}

	/**
	 * Gets SEO data from Yoast SEO
	 *
	 * @return array
	 */
	public static function getSeoData(): array
	{
		if (!function_exists('YoastSEO')) {
			return [
				'title' => get_the_title(),
				'description' => get_bloginfo('description') ?? wp_trim_words(get_the_excerpt(), 20),
			];
		}
		$yoast_meta = YoastSEO()->meta->for_current_page();

		return [
			'title' => $yoast_meta->open_graph_title ?? get_the_title(),
			'description' => $yoast_meta->open_graph_description ?? (get_bloginfo('description') ?? wp_trim_words(get_the_excerpt(), 20)),
		];
	}
}
