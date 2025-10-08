<?php

use EvoWpRestRegistration\RestApi;

require_once ABSPATH . '/vendor/autoload.php';

// Initialize theme
new JDEV\ThemeSetup();

new RestApi([
	'namespace' => 'Template\\RestApi\\',
	'version' => 1,
	'directory' => __DIR__ . '/rest-api',
	'base_url' => 'template',
]);

register_nav_menus([
	'header-menu' => __('Header Menu'),
]);
