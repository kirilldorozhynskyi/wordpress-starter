<?php

namespace InertiaTheme\Model;

use InertiaTheme\Controller\NewsController;
use InertiaTheme\RestRoute;

class News
{
	public function __construct()
	{
		add_action('init', [$this, 'registerPostType']);
		RestRoute::get('get-news', [new NewsController(), 'getNews']);
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
			// Keep excerpt separate; previous string merged it with page-attributes.
			'supports' => ['title', 'thumbnail', 'page-attributes', 'excerpt', 'revisions'],
			'rewrite' => [
				'slug' => array_key_exists('NEWS', PAGES) && get_post_status(PAGES['NEWS']) == 'publish' ? get_post(PAGES['NEWS'])->post_name : 'news',
			],
		]);
	}
}
