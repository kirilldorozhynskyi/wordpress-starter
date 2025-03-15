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
			'supports' => ['title', 'thumbnail', 'page-attributes', 'revisions'],
			'rewrite' => [
				'slug' => array_key_exists('NEWS', PAGES) && get_post_status(PAGES['NEWS']) == 'publish' ? get_post(PAGES['NEWS'])->post_name : 'news',
			],
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
			'show_in_rest' => true,
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
}
