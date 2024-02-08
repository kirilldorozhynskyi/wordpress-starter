<?php

acf_add_options_page([
	'menu_slug' => 'theme_settings',
	'menu_title' => 'Theme Settings',
	'page_title' => 'Theme Settings',
	'capability' => 'edit_theme_options',
]);

return [
	'active' => true,
	'key' => 'theme_settings',
	'name' => 'theme_settings',
	'title' => 'Theme Settings',
	'style' => 'seamless',
	'menu_order' => 0,
	'location' => [
		[
			[
				'param' => 'options_page',
				'operator' => '==',
				'value' => 'theme_settings',
			],
		],
	],
	'hide_on_screen' => [
		0 => 'author',
		1 => 'categories',
		2 => 'comments',
		3 => 'discussion',
		4 => 'featured_image',
		5 => 'format',
		6 => 'send-trackbacks',
		7 => 'slug',
		8 => 'tags',
		9 => 'the_content',
	],
	'fields' => [
		[
			'key' => 'general',
			'label' => 'General',
			'type' => 'tab',
			'wpml_cf_preferences' => 3,
		],
		[
			'key' => 'general_gtm',
			'name' => 'general_gtm',
			'label' => 'GTM ID',
			'type' => 'text',
			'wpml_cf_preferences' => 3,
		],
		[
			'key' => 'general_logo',
			'name' => 'general_logo',
			'label' => 'Site logo',
			'type' => 'image',
			'return_format' => 'array',
			'required' => true,
			'wpml_cf_preferences' => 3,
			'wrapper' => [
				'width' => 25,
			],
		],
		[
			'key' => 'general_scroll_to_top',
			'name' => 'general_scroll_to_top',
			'label' => 'Scroll to top',
			'type' => 'true_false',
			'ui' => 1,
			'default_value' => 1,
			'message' => 'Show scroll to top button?',
			'wpml_cf_preferences' => 3,
			'wrapper' => [
				'width' => 25,
			],
		],
		[
			'key' => 'general_search',
			'name' => 'general_search',
			'label' => 'Search',
			'type' => 'true_false',
			'ui' => 1,
			'default_value' => 1,
			'message' => 'Add search to header?',
			'wpml_cf_preferences' => 3,
			'wrapper' => [
				'width' => 25,
			],
		],
		[
			'key' => 'footer',
			'label' => 'Footer',
			'type' => 'tab',
			'wpml_cf_preferences' => 3,
		],
		[
			'key' => 'footer_company_info_show',
			'name' => 'footer_company_info_show',
			'label' => 'Show company info?',
			'type' => 'true_false',
			'ui' => 1,
			'default_value' => 0,
			'wpml_cf_preferences' => 3,
		],
		[
			'key' => 'footer_company_info',
			'name' => 'footer_company_info',
			'label' => 'Company info',
			'type' => 'textarea',
			'rows' => 4,
			'wpml_cf_preferences' => 3,
			'conditional_logic' => [
				[
					[
						'field' => 'footer_company_info_show',
						'operator' => '==',
						'value' => '1',
					],
				],
			],
		],
		[
			'key' => 'footer_company_address',
			'name' => 'footer_company_address',
			'label' => 'Company address',
			'type' => 'text',
			'wpml_cf_preferences' => 3,
			'conditional_logic' => [
				[
					[
						'field' => 'footer_company_info_show',
						'operator' => '==',
						'value' => '1',
					],
				],
			],
		],
		[
			'key' => 'footer_company_phone',
			'name' => 'footer_company_phone',
			'label' => 'Company phone',
			'type' => 'text',
			'wpml_cf_preferences' => 3,
			'conditional_logic' => [
				[
					[
						'field' => 'footer_company_info_show',
						'operator' => '==',
						'value' => '1',
					],
				],
			],
		],
		[
			'key' => 'footer_company_email',
			'name' => 'footer_company_email',
			'label' => 'Company email',
			'type' => 'email',
			'wpml_cf_preferences' => 3,
			'conditional_logic' => [
				[
					[
						'field' => 'footer_company_info_show',
						'operator' => '==',
						'value' => '1',
					],
				],
			],
		],
		[
			'key' => 'footer_social_sites_show',
			'name' => 'footer_social_sites_show',
			'label' => 'Show social sites?',
			'type' => 'true_false',
			'ui' => 1,
			'default_value' => 0,
			'wpml_cf_preferences' => 3,
		],
		[
			'key' => 'footer_social_sites',
			'name' => 'footer_social_sites',
			'label' => 'Social sites',
			'type' => 'repeater',
			'layout' => 'block',
			'button_label' => 'Add Social site',
			'wpml_cf_preferences' => 3,
			'sub_fields' => [
				[
					'key' => 'footer_social_sites_icon',
					'name' => 'icon',
					'label' => 'Icon',
					'type' => 'select',
					'instructions' => '',
					'required' => 0,
					'conditional_logic' => 0,
					'wrapper' => [
						'width' => '50',
						'class' => '',
						'id' => '',
					],
					'choices' => [
						'facebook' => 'Facebook',
						'instagram' => 'Instagram',
						'tiktok' => 'TikTok',
						'youtube' => 'YouTube',
					],
					'default_value' => false,
					'return_format' => 'value',
					'multiple' => 0,
					'allow_null' => 0,
					'ui' => 0,
					'ajax' => 0,
					'placeholder' => '',
					'wpml_cf_preferences' => 3,
				],
				[
					'key' => 'footer_social_sites_link',
					'name' => 'link',
					'label' => 'Link',
					'type' => 'link',
					'return_format' => 'array',
					'wpml_cf_preferences' => 3,
					'required' => true,
					'wrapper' => [
						'width' => 50,
					],
				],
			],
			'conditional_logic' => [
				[
					[
						'field' => 'footer_social_sites_show',
						'operator' => '==',
						'value' => '1',
					],
				],
			],
		],
		[
			'key' => 'footer_newsletter_show',
			'name' => 'footer_newsletter_show',
			'label' => 'Show newsletter form?',
			'type' => 'true_false',
			'ui' => 1,
			'default_value' => 0,
			'wpml_cf_preferences' => 3,
		],
		[
			'key' => 'footer_newsletter_text',
			'name' => 'footer_newsletter_text',
			'label' => 'Text',
			'type' => 'wysiwyg',
			'toolbar' => 'full',
			'media_upload' => 0,
			'wpml_cf_preferences' => 3,
			'conditional_logic' => [
				[
					[
						'field' => 'footer_newsletter_show',
						'operator' => '==',
						'value' => '1',
					],
				],
			],
		],
		[
			'key' => 'footer_newsletter_link',
			'name' => 'footer_newsletter_link',
			'label' => 'Link to newsletter form',
			'type' => 'link',
			'return_type' => 'array',
			'required' => true,
			'wpml_cf_preferences' => 3,
			'conditional_logic' => [
				[
					[
						'field' => 'footer_newsletter_show',
						'operator' => '==',
						'value' => '1',
					],
				],
			],
		],
		[
			'key' => 'footer_recent_posts_show',
			'name' => 'footer_recent_posts_show',
			'label' => 'Show recent news posts?',
			'type' => 'true_false',
			'ui' => 1,
			'default_value' => 0,
			'wpml_cf_preferences' => 3,
		],
		[
			'key' => 'footer_copyright_text',
			'name' => 'footer_copyright_text',
			'label' => 'Copyright text',
			'type' => 'wysiwyg',
			'toolbar' => 'basic',
			'media_upload' => 0,
			'wpml_cf_preferences' => 3,
		],
		[
			'key' => 'cookies_info_box',
			'label' => 'Cookies info box',
			'type' => 'tab',
			'wpml_cf_preferences' => 3,
		],
		[
			'key' => 'cookies_info_box_show',
			'name' => 'cookies_info_box_show',
			'label' => 'Show cookies',
			'type' => 'true_false',
			'ui' => 1,
			'default_value' => 1,
			'wpml_cf_preferences' => 3,
			'wrapper' => [
				'width' => 25,
			],
		],
		[
			'key' => 'cookies_info_box_title',
			'name' => 'cookies_info_box_title',
			'label' => 'Title',
			'type' => 'textarea',
			'rows' => 1,
			'new_lines' => 'br',
			'wpml_cf_preferences' => 3,
			'required' => true,
			'conditional_logic' => [
				[
					[
						'field' => 'cookies_info_box_show',
						'operator' => '==',
						'value' => '1',
					],
				],
			],
		],
		[
			'key' => 'cookies_info_box_text',
			'name' => 'cookies_info_box_text',
			'label' => 'Text',
			'type' => 'wysiwyg',
			'toolbar' => 'basic',
			'media_upload' => 0,
			'wpml_cf_preferences' => 3,
			'required' => true,
			'conditional_logic' => [
				[
					[
						'field' => 'cookies_info_box_show',
						'operator' => '==',
						'value' => '1',
					],
				],
			],
		],
		[
			'key' => 'cookies_info_box_accept',
			'name' => 'cookies_info_box_accept',
			'label' => 'Accept text',
			'type' => 'text',
			'wpml_cf_preferences' => 3,
			'wrapper' => [
				'width' => 50,
			],
			'required' => true,
			'conditional_logic' => [
				[
					[
						'field' => 'cookies_info_box_show',
						'operator' => '==',
						'value' => '1',
					],
				],
			],
		],
		[
			'key' => 'cookies_info_box_accept_all',
			'name' => 'cookies_info_box_accept_all',
			'label' => 'Accept all text',
			'type' => 'text',
			'wpml_cf_preferences' => 3,
			'wrapper' => [
				'width' => 50,
			],
			'required' => true,
			'conditional_logic' => [
				[
					[
						'field' => 'cookies_info_box_show',
						'operator' => '==',
						'value' => '1',
					],
				],
			],
		],
		[
			'key' => 'cookies_info_box_cookie_usage_title',
			'name' => 'cookies_info_box_cookie_usage_title',
			'label' => 'Cookie usage title',
			'type' => 'text',
			'wpml_cf_preferences' => 3,
			'required' => true,
			'conditional_logic' => [
				[
					[
						'field' => 'cookies_info_box_show',
						'operator' => '==',
						'value' => '1',
					],
				],
			],
		],
		[
			'key' => 'cookies_info_box_cookie_usage_text',
			'name' => 'cookies_info_box_cookie_usage_text',
			'label' => 'Cookie usage text',
			'type' => 'wysiwyg',
			'toolbar' => 'basic',
			'media_upload' => 0,
			'wpml_cf_preferences' => 3,
			'required' => true,
			'conditional_logic' => [
				[
					[
						'field' => 'cookies_info_box_show',
						'operator' => '==',
						'value' => '1',
					],
				],
			],
		],
		[
			'key' => 'cookies_info_box_cookie_categories_essential_title',
			'name' => 'cookies_info_box_cookie_categories_essential_title',
			'label' => 'Cookie categories - essential title',
			'type' => 'text',
			'wpml_cf_preferences' => 3,
			'required' => true,
			'conditional_logic' => [
				[
					[
						'field' => 'cookies_info_box_show',
						'operator' => '==',
						'value' => '1',
					],
				],
			],
		],
		[
			'key' => 'cookies_info_box_cookie_categories_essential_text',
			'name' => 'cookies_info_box_cookie_categories_essential_text',
			'label' => 'Cookie categories - essential text',
			'type' => 'wysiwyg',
			'toolbar' => 'basic',
			'media_upload' => 0,
			'wpml_cf_preferences' => 3,
			'required' => true,
			'conditional_logic' => [
				[
					[
						'field' => 'cookies_info_box_show',
						'operator' => '==',
						'value' => '1',
					],
				],
			],
		],
		[
			'key' => 'cookies_info_box_cookie_categories_functional_title',
			'name' => 'cookies_info_box_cookie_categories_functional_title',
			'label' => 'Cookie categories - functional title',
			'type' => 'text',
			'wpml_cf_preferences' => 3,
			'required' => true,
			'conditional_logic' => [
				[
					[
						'field' => 'cookies_info_box_show',
						'operator' => '==',
						'value' => '1',
					],
				],
			],
		],
		[
			'key' => 'cookies_info_box_cookie_categories_functional_text',
			'name' => 'cookies_info_box_cookie_categories_functional_text',
			'label' => 'Cookie categories - functional text',
			'type' => 'wysiwyg',
			'toolbar' => 'basic',
			'media_upload' => 0,
			'wpml_cf_preferences' => 3,
			'required' => true,
			'conditional_logic' => [
				[
					[
						'field' => 'cookies_info_box_show',
						'operator' => '==',
						'value' => '1',
					],
				],
			],
		],
		[
			'key' => 'cookies_info_box_cookie_categories_analytical_title',
			'name' => 'cookies_info_box_cookie_categories_analytical_title',
			'label' => 'Cookie categories - analytical title',
			'type' => 'text',
			'wpml_cf_preferences' => 3,
			'required' => true,
			'conditional_logic' => [
				[
					[
						'field' => 'cookies_info_box_show',
						'operator' => '==',
						'value' => '1',
					],
				],
			],
		],
		[
			'key' => 'cookies_info_box_cookie_categories_analytical_text',
			'name' => 'cookies_info_box_cookie_categories_analytical_text',
			'label' => 'Cookie categories - analytical text',
			'type' => 'wysiwyg',
			'toolbar' => 'basic',
			'media_upload' => 0,
			'wpml_cf_preferences' => 3,
			'required' => true,
			'conditional_logic' => [
				[
					[
						'field' => 'cookies_info_box_show',
						'operator' => '==',
						'value' => '1',
					],
				],
			],
		],
		[
			'key' => 'cookies_info_box_cookie_categories_social_media_title',
			'name' => 'cookies_info_box_cookie_categories_social_media_title',
			'label' => 'Cookie categories - social media title',
			'type' => 'text',
			'wpml_cf_preferences' => 3,
			'required' => true,
			'conditional_logic' => [
				[
					[
						'field' => 'cookies_info_box_show',
						'operator' => '==',
						'value' => '1',
					],
				],
			],
		],
		[
			'key' => 'cookies_info_box_cookie_categories_social_media_text',
			'name' => 'cookies_info_box_cookie_categories_social_media_text',
			'label' => 'Cookie categories - social media text',
			'type' => 'wysiwyg',
			'toolbar' => 'basic',
			'media_upload' => 0,
			'wpml_cf_preferences' => 3,
			'required' => true,
			'conditional_logic' => [
				[
					[
						'field' => 'cookies_info_box_show',
						'operator' => '==',
						'value' => '1',
					],
				],
			],
		],
		[
			'key' => 'page_not_found',
			'label' => 'Page not found (404)',
			'type' => 'tab',
			'wpml_cf_preferences' => 3,
		],
		[
			'key' => 'page_not_found_text',
			'name' => 'page_not_found_text',
			'label' => 'Text',
			'type' => 'wysiwyg',
			'toolbar' => 'full',
			'media_upload' => 0,
			'wpml_cf_preferences' => 3,
		],
	],
];
