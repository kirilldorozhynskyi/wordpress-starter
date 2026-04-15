<?php

namespace InertiaTheme\Controller;

class NewsController
{
	public function getNews(): array
	{
		$offset = max(0, absint($_GET['offset'] ?? 0));
		$term_slug = sanitize_title($_GET['term'] ?? '');
		$posts_per_page = max(1, absint($_GET['number_of_posts'] ?? 3));

		return self::queryPosts($posts_per_page, $offset, $term_slug ?: null);
	}

	public static function handleAllNews(array &$section): void
	{
		$term_slug = sanitize_title($_GET['term'] ?? '');
		$posts_per_page = max(1, absint($section['number_of_posts'] ?? 3));
		$data = self::queryPosts($posts_per_page, 0, $term_slug ?: null);

		$section['news'] = $data['news'];
		$section['total_posts'] = $data['total_posts'];
		$section['number_of_posts'] = $posts_per_page;
		$section['terms'] = self::getTerms();
	}

	public static function getNext(int|array $exclude): ?array
	{
		$exclude_ids = array_map('absint', (array) $exclude);
		$query = new \WP_Query([
			'post_type' => self::getPostType(),
			'post_status' => 'publish',
			'posts_per_page' => 1,
			'fields' => 'ids',
			'post__not_in' => $exclude_ids,
			'suppress_filters' => false,
		]);

		if (!$query->have_posts()) {
			return null;
		}

		return self::getContent((int) $query->posts[0]);
	}

	public static function getContent(int $id): array
	{
		return [
			'id' => $id,
			'url' => get_permalink($id),
			'date' => get_the_date('d. F Y', $id),
			'title' => get_the_title($id),
			'text' => get_the_excerpt($id),
			'thumbnail' => self::getThumbnail($id),
		];
	}

	public static function getThumbnail(int $id): ?array
	{
		$thumbnail_id = get_post_thumbnail_id($id);

		if (!$thumbnail_id) {
			return null;
		}

		if (function_exists('acf_get_attachment')) {
			$attachment = acf_get_attachment($thumbnail_id);
			if (is_array($attachment)) {
				return $attachment;
			}
		}

		$url = wp_get_attachment_image_url($thumbnail_id, 'full');

		if (!$url) {
			return null;
		}

		return [
			'id' => $thumbnail_id,
			'url' => $url,
			'alt' => get_post_meta($thumbnail_id, '_wp_attachment_image_alt', true),
		];
	}

	private static function queryPosts(int $posts_per_page, int $offset = 0, ?string $term_slug = null): array
	{
		$query_args = [
			'post_type' => self::getPostType(),
			'post_status' => 'publish',
			'posts_per_page' => $posts_per_page,
			'fields' => 'ids',
			'suppress_filters' => false,
			'offset' => $offset,
		];

		if ($term_slug) {
			$term = get_term_by('slug', $term_slug, self::getTaxonomy());

			if ($term && !is_wp_error($term)) {
				$query_args['tax_query'] = [
					[
						'taxonomy' => self::getTaxonomy(),
						'field' => 'term_id',
						'terms' => [(int) $term->term_id],
					],
				];
			}
		}

		$query = new \WP_Query($query_args);

		if (!$query->have_posts()) {
			return [
				'news' => [],
				'total_posts' => 0,
			];
		}

		return [
			'news' => array_map([self::class, 'getContent'], array_map('intval', $query->posts)),
			'total_posts' => (int) $query->found_posts,
		];
	}

	private static function getTerms(): array
	{
		$terms = get_terms([
			'taxonomy' => self::getTaxonomy(),
			'hide_empty' => true,
		]);

		return is_wp_error($terms) ? [] : array_values((array) $terms);
	}

	private static function getPostType(): string
	{
		return apply_filters('inertia_theme/news/post_type', 'post');
	}

	private static function getTaxonomy(): string
	{
		return apply_filters('inertia_theme/news/taxonomy', 'category');
	}
}
