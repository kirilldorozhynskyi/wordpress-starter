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
			'required' => false,
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
			'key' => 'general_background_color',
			'name' => 'general_background_color',
			'label' => 'Background color',
			'type' => 'color_picker',
			'wpml_cf_preferences' => 3,
			'wrapper' => [
				'width' => 25,
			],
		],
		[
			'key' => 'general_theme_color',
			'name' => 'general_theme_color',
			'label' => 'Theme color',
			'type' => 'color_picker',
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
			'default_value' => __('Cookie-Settings', 'jdev'),
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
			'default_value' => __(
				'We use <strong>necessary cookies</strong> to make our website work and are installed automatically. They enable security, accessibility and network management. As we want to improve your experience with our website, we would like to set <strong>functional, analytical and social media cookies</strong> which measure how you use our site and enable more personalized content, and provide social media features. Therefore we share information about your use of our website with our partners. They may combine this information with other data that you have provided to them or that they have collected as part of your use of the services. Some of our partner services are located in the USA, which is regarded by the European Court of Justice as a country without an adequate level of data protection. There is a possibility and risk that your personal data will be processed by US authorities for control and surveillance, leaving you without effective remedies against it. With you clicking on "Accept all cookies", you agree that cookies on our website can be used by us as well as third party providers (also in the USA) and that data can be transferred (Art 49. GDPR) unless other suitable guarantees are exceptionally not available. Your consent is voluntary and can be revoked at any time. You can configure cookies under settings.

			Detailed information can be found in our <a href="https://wordpress-starter.ddev.site/privacy-policy/">Privacy Statement – Cookies</a>.',
				'jdev',
			),
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
			'default_value' => __('Confirm selection', 'jdev'),
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
			'default_value' => __('Accept all', 'jdev'),
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
			'default_value' => __('How do we use Cookies:', 'jdev'),
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
			'default_value' => __(
				'Cookies are pieces of information that a website transfers to your device when you access any website. Cookies allow our website to recognize your device and store information about your preferences or past actions. This information can be connected to you, your settings, your device or they take care, that a website you visit functions in line with your expectations. Information provided to us by cookies do not reveal your identity directly, but can enable you better user experience. You can say “no” to some cookies. Please review details on each cookies bellow and decide which you prefer in settings. Disabling cookies might influence use of our website or services on your device.',
				'jdev',
			),
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
			'default_value' => __('Neceassary cookies', 'jdev'),
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
			'default_value' => __(
				'We use necessary cookies to make our website work: for security, accessibility and network management. They are installed automatically. For this purpose we do not need your consent as these cookies do not process personal data. You have the possibility to change your cookie settings in your browser at any time, but the website might then not work properly.',
				'jdev',
			),
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
			'default_value' => __('Functional cookies', 'jdev'),
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
			'default_value' => __(
				'Functional cookies allow us to improve website performance and customization based on your choices that you make on the website. They are set by us or by our contractual partners who provide their services on our websites with our permission (e.g. website satisfaction survey service). If you do not accept these cookies, some or all of the website\'s features may not work.',
				'jdev',
			),
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
			'default_value' => __('Analytical cookies', 'jdev'),
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
			'default_value' => __(
				'We use Google analytics to helps us understand how you use our website. It helps us to make decisions about general improvements to the functionality and content of the website. The cookies collect information in a way that does not directly identify you.',
				'jdev',
			),
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
			'default_value' => __('Social Media Cookies', 'jdev'),
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
			'default_value' => __(
				'These cookies are set by a number of social network providers that we have added to our website. These cookies enable you to share content with your friends and networks. When you “surf the internet” these cookies track your browser and build a profile of your interests. In doing so, they influence the content and messages you see on the websites you visit. If you refuse the use of these cookies, content sharing tools may not be available to you.',
				'jdev',
			),
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
