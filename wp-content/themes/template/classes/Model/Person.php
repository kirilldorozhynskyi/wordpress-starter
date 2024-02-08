<?php
namespace JDEV\Model;

/**
 * Class Person
 *
 * @package JDEV
 */
class Person
{
	public function __construct()
	{
		add_action('init', [$this, 'registerPostType']);
	}

	/*
	 * Register custom post type
	 */
	public function registerPostType()
	{
		register_post_type('person', [
			'public' => false,
			'show_ui' => true,
			'menu_icon' => 'dashicons-groups',
			'labels' => [
				'name' => 'Persons',
				'singular_name' => 'Person',
			],
			'supports' => ['title', 'excerpt', 'page-attributes', 'revisions'],
		]);
	}
}
