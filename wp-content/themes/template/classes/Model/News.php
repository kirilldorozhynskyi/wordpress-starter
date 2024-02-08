<?php
namespace JDEV\Model;

use JDEV\RestRoute;
use JDEV\Controller\NewsController;

use Timber\Timber;
use Twig\Environment;
use Twig\TwigFunction;

/**
 * Class News
 *
 * @package JDEV
 */
class News
{
	public function __construct()
	{
		add_action('init', [$this, 'registerPostType']);
		add_action('init', [$this, 'registerTaxonomies']);
		add_action('save_post_news', [$this, 'setParentPage'], 10, 1);
		add_filter('timber/twig', [$this, 'addToTwig']);

		RestRoute::get('get-news', [new NewsController(), 'getNews']);
		RestRoute::get('get-news-contents', [new NewsController(), 'getNewsContents']);
	}

	/**
	 * Register post type
	 */
	public function registerPostType()
	{
		register_post_type('news', [
			'public' => true,
			'show_ui' => true,
			'menu_icon' => 'dashicons-align-left',
			'labels' => [
				'name' => 'News',
				'singular_name' => 'Single News',
			],
			'supports' => ['title', 'excerpt', 'page-attributes', 'revisions'],
			'rewrite' => [
				'slug' => array_key_exists('NEWS', PAGES) && get_post_status(PAGES['NEWS']) == 'publish' ? get_post(PAGES['NEWS'])->post_name : 'news',
			],
			'taxonomies' => ['news-category'],
		]);
	}

	/**
	 * Register taxonomies
	 */
	public function registerTaxonomies()
	{
		register_taxonomy('news-category', 'news', [
			'public' => false,
			'show_ui' => true,
			'show_admin_column' => true,
			'hierarchical' => true,
			'labels' => [
				'name' => 'News Categories',
				'singular_name' => 'News Category',
			],
		]);
	}

	/**
	 * Set meta data - parent page ID
	 *
	 * @param $id
	 */
	public function setParentPage($id)
	{
		if (array_key_exists('NEWS', PAGES) && get_post_status(PAGES['NEWS']) == 'publish') {
			update_post_meta($id, 'meta_post_parent', PAGES['NEWS']);
		}
	}

	/**
	 * Add to Twig's environment
	 *
	 * @param $twig
	 * @return Environment
	 */
	public function addToTwig($twig)
	{
		$twig->addFunction(new TwigFunction('getNewsTaxonomies', [$this, 'getNewsTaxonomies']));
		$twig->addFunction(new TwigFunction('getSingleNews', [$this, 'getSingleNews']));
		$twig->addFunction(new TwigFunction('getLatestNews', [$this, 'getLatestNews']));
		return $twig;
	}

	/**
	 * Get post type taxonomies
	 *
	 * @param $empty
	 * @return array
	 */
	public function getNewsTaxonomies($taxonomy, $order = 'date', $empty = false)
	{
		$taxonomies = [];
		$terms = get_terms([
			'taxonomy' => $taxonomy,
			'orderby' => $order,
			'hide_empty' => $empty,
		]);
		foreach ($terms as $term) {
			$taxonomies[] = [
				'id' => $term->term_id,
				'parent' => $term->parent,
				'count' => $term->count,
				'slug' => $term->slug,
				'name' => $term->name,
				'description' => $term->description,
			];
			if (get_fields($term)) {
				foreach (get_fields($term) as $name => $value) {
					$taxonomies[$term->term_id][$name] = $value;
				}
			}
		}
		return $taxonomies;
	}

	/**
	 * Get single post type - id, data and teaser content
	 *
	 * @param $id
	 * @return array
	 */
	public function getSingleNews($id = null)
	{
		$id = $id ?: get_post()->ID;
		$context = $this->createContext($id);
		return [
			'id' => $id,
			'data' => $context['news'],
			'content' => Timber::compile('partials/posts/news/teaser.twig', $context),
		];
	}

	/**
	 * Get given number of posts from given categories, with featured posts first, fulfilled with latest posts if needed
	 *
	 * @param $count
	 * @param $featured
	 * @param $categories
	 * @param $amendWithLatest
	 * @return array
	 */
	public function getLatestNews($count, $featured = false, $amendWithLatest = false, $categories = false)
	{
		$posts = [];
		$count = absint($count);
		// featured posts
		if (is_array($featured) && count($featured)) {
			$featuredPosts = get_posts([
				'post_type' => 'news',
				'post_status' => 'publish',
				'posts_per_page' => $count,
				'suppress_filters' => false,
				'orderby' => 'date',
				'fields' => 'ids',
				'post__in' => $featured,
			]);
			if (count($featuredPosts)) {
				array_push($posts, ...$featuredPosts);
				$count -= count($featuredPosts);
			}
		}
		// amend with latest
		if ($count && $amendWithLatest) {
			// latest posts from categories
			if (is_array($categories) && count($categories)) {
				$categoriesPosts = get_posts([
					'post_type' => 'news',
					'post_status' => 'publish',
					'posts_per_page' => $count,
					'suppress_filters' => false,
					'orderby' => 'date',
					'fields' => 'ids',
					'post__not_in' => $posts,
					'tax_query' => [
						[
							'taxonomy' => 'news-category',
							'field' => 'term_id',
							'terms' => $categories,
						],
					],
				]);
				if (count($categoriesPosts)) {
					array_push($posts, ...$categoriesPosts);
					$count -= count($categoriesPosts);
				}
			}
			// other latest posts
			if ($count) {
				$latestPosts = get_posts([
					'post_type' => 'news',
					'post_status' => 'publish',
					'posts_per_page' => $count,
					'suppress_filters' => false,
					'orderby' => 'date',
					'fields' => 'ids',
					'post__not_in' => $posts,
				]);
				if (count($latestPosts)) {
					array_push($posts, ...$latestPosts);
				}
			}
		}
		// Create post objects
		$news = [];
		foreach ($posts as $id) {
			$context = $this->createContext($id);
			$news[] = [
				'id' => $id,
				'data' => $context['news'],
				'content' => Timber::compile('partials/posts/news/teaser.twig', $context),
			];
		}
		return $news;
	}

	/*
	 * Create Timber's context with generated data
	 *
	 * @param $id
	 * @return array
	 */
	public static function createContext($id = null)
	{
		$id = $id ?: get_post()->ID;
		$post = Timber::get_post($id);
		$context = Timber::context();
		$context['news'] = [
			'uid' => $post->ID,
			'title' => $post->post_title,
			'publishDate' => $post->post_date,
			'link' => get_permalink($post),
			'categories' => get_the_terms($post, 'news-category'),
		];
		if (get_fields($id)) {
			foreach (get_fields($id) as $name => $value) {
				$context['news'][$name] = $value;
			}
		}
		return $context;
	}
}
