<?php
/**
 * Configuration overrides for WP_ENV === 'staging'
 */

use Roots\WPConfig\Config;
use function Env\env;

Config::define('SAVEQUERIES', false);
Config::define('WP_DEBUG', env('WP_DEBUG') ?? false);
Config::define('WP_DEBUG_DISPLAY', env('WP_DEBUG_DISPLAY') ?? false);
Config::define('WP_DEBUG_LOG', env('WP_DEBUG_LOG') ?? false);
Config::define('WP_DISABLE_FATAL_ERROR_HANDLER', true);
Config::define('SCRIPT_DEBUG', false);
Config::define('DISALLOW_INDEXING', true);

ini_set('display_errors', '0');

// Enable plugin and theme updates and installation from the admin
Config::define('DISALLOW_FILE_MODS', true);
// Disable the plugin and theme file editor in the admin
Config::define('DISALLOW_FILE_EDIT', true);
