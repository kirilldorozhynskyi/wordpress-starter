<?php

namespace InertiaTheme;

use Timber\Site;
use Yoast\WP\SEO\Integrations\Front_End_Integration;

/**
 * Class Global
 *
 * @package InertiaTheme
 */
class Globals
{
	public static function getSiteLanguage(): string
	{
		$language = Languages::current();
		if ($language !== null) {
			return str_replace('_', '-', $language);
		}

		$site = new Site();
		$siteLanguage = strtolower($site->language);
		return $siteLanguage ? explode('_', $siteLanguage)[0] : 'de';
	}

	/** @return list<string> */
	public static function getSeoHead(): array
	{
		static $head;

		if ($head !== null) {
			return $head;
		}

		$title = wp_get_document_title();
		$head = ['<title data-inertia="">' . esc_html($title) . '</title>'];

		if (function_exists('YoastSEO')) {
			return $head = [...$head, ...self::getYoastHead()];
		}

		$canonical = self::getCanonicalUrl();

		if ($canonical === '') {
			return $head;
		}

		$head[] = '<link data-inertia="canonical" rel="canonical" href="' . esc_url($canonical) . '">';
		$description = self::getDescription();
		if ($description !== '') {
			$head[] = '<meta data-inertia="description" name="description" content="' . esc_attr($description) . '">';
		}

		$siteName = get_bloginfo('name');
		$openGraph = [
			'og:title' => $title,
			'og:description' => $description,
			'og:url' => $canonical,
			'og:type' => is_singular('post') ? 'article' : 'website',
			'og:site_name' => $siteName,
			'og:image' => (is_singular() ? get_the_post_thumbnail_url(get_queried_object_id(), 'full') : false) ?: get_site_icon_url(512),
		];
		foreach (array_filter($openGraph) as $property => $content) {
			$head[] = '<meta data-inertia="' . $property . '" property="' . $property . '" content="' . esc_attr($content) . '">';
		}

		if (is_front_page() && !is_paged() && $siteName !== '') {
			$schema = wp_json_encode(
				['@context' => 'https://schema.org', '@type' => 'WebSite', 'name' => $siteName, 'url' => $canonical],
				JSON_HEX_TAG | JSON_HEX_AMP | JSON_HEX_APOS | JSON_HEX_QUOT,
			);
			if ($schema !== false) {
				$head[] = '<script data-inertia="website-schema" type="application/ld+json">' . $schema . '</script>';
			}
		}

		return $head;
	}

	/** @return list<string> */
	private static function getYoastHead(): array
	{
		$yoast = YoastSEO();
		$presentHead = [$yoast->classes->get(Front_End_Integration::class), 'present_head'];
		$priority = has_action('wpseo_head', $presentHead);
		if ($priority !== false) {
			remove_action('wpseo_head', $presentHead, $priority);
		}

		$html = $yoast->meta->for_current_page()->get_head()->html;
		$document = \Dom\HTMLDocument::createFromString('<!DOCTYPE html><head>' . $html . '</head>', LIBXML_NOERROR, 'UTF-8');
		$tags = [];
		foreach ($document->querySelector('head')->children as $element) {
			$tag = $element->localName;
			$isMeta = $tag === 'meta' && strtolower($element->getAttribute('name') ?? '') !== 'robots';
			$isSchema = $tag === 'script' && $element->getAttribute('type') === 'application/ld+json';
			if (!$isMeta && $tag !== 'link' && !$isSchema) {
				continue;
			}

			$element->setAttribute('data-inertia', 'yoast-' . count($tags));
			$tags[] = $document->saveHtml($element);
		}

		return $tags;
	}

	private static function getCanonicalUrl(): string
	{
		if (is_404() || is_search() || is_preview()) {
			return '';
		}

		if (is_singular()) {
			return wp_get_canonical_url(get_queried_object_id()) ?: '';
		}

		if (!is_home() && !is_archive()) {
			return '';
		}

		global $wp;
		$url = get_pagenum_link(max(1, (int) get_query_var('paged')), false);
		wp_parse_str((string) wp_parse_url($url, PHP_URL_QUERY), $query);
		$routeKeys = [
			'author',
			'author_name',
			'cat',
			'category_name',
			'tag',
			'tag_id',
			'taxonomy',
			'term',
			'post_type',
			'm',
			'year',
			'monthnum',
			'day',
			'page_id',
			'paged',
		];
		foreach (get_taxonomies([], 'objects') as $taxonomy) {
			if ($taxonomy->query_var) {
				$routeKeys[] = $taxonomy->query_var;
			}
		}

		$trackingKeys = array_diff(array_keys($query), array_intersect($routeKeys, array_keys($wp->query_vars)));
		$language = Languages::current();
		if ($language !== null && is_string($query['lang'] ?? null) && strcasecmp($query['lang'], $language) === 0) {
			$trackingKeys = array_diff($trackingKeys, ['lang']);
		}
		return remove_query_arg($trackingKeys, $url);
	}

	private static function getDescription(): string
	{
		$description = match (true) {
			is_singular() && !post_password_required() => get_the_excerpt(get_queried_object_id()),
			is_category(), is_tag(), is_tax() => term_description(),
			is_post_type_archive() => get_the_post_type_description(),
			default => '',
		};

		return wp_trim_words(wp_strip_all_tags($description) ?: get_bloginfo('description'), 30);
	}
}
