<?php

/**
 * Theme Functions
 * Main entry point for theme initialization
 */

// Load autoloader
require_once ABSPATH . '/vendor/autoload.php';

// Initialize theme
new JDEV\ThemeSetup();

// Define constants
define('PAGES', [
	'HOME' => 3,
	'NEWS' => 4,
]);
