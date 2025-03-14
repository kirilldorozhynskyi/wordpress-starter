<?php
/**
 * Your base production configuration goes in this file. Environment-specific
 * overrides go in their respective config/environments/{{WP_ENV}}.php file.
 *
 * A good default policy is to deviate from the production config as little as
 * possible. Try to define as much of your configuration in this file as you
 * can.
 */

use Roots\WPConfig\Config;
use function Env\env;

/**
 * Directory containing all of the site's files
 *
 * @var string
 */
$root_dir = dirname(__DIR__);

/**
 * Document Root
 *
 * @var string
 */
$webroot_dir = $root_dir;

/**
 * Use Dotenv to set required environment variables and load .env file in root
 * .env.local will override .env if it exists
 */

$env_path = null;

if (file_exists($root_dir . '/.env')) {
	$env_path = $root_dir . '/.env';
} elseif (file_exists($root_dir . '/../.env')) {
	$env_path = realpath($root_dir . '/../.env');
}

if ($env_path) {
	$dotenv = Dotenv\Dotenv::createUnsafeImmutable(dirname($env_path));
	$dotenv->load();
} else {
	throw new Exception('.env is missing or contains an error. Please check it.');
}

/**
 * Set up our global environment constant and load its config first
 * Default: production
 */
define('WP_ENV', env('WP_ENV') ?: 'production');

/**
 * Environments
 */
$envs = [
	'development' => env('ENV_DEVELOPMENT'),
	'staging' => env('ENV_STAGING'),
	'production' => env('ENV_PRODUCTION'),
	'container1' => env('AWS_CONTAINER1'),
	'container2' => env('AWS_CONTAINER2'),
];
define('ENVIRONMENTS', serialize($envs));

/**
 * URLs
 */
switch (WP_ENV) {
	case 'staging':
		if ($_SERVER['HTTP_HOST'] === $envs['container1']) {
			$WP_HOME = 'https://' . $envs['container1'];
		} elseif ($_SERVER['HTTP_HOST'] === $envs['container2']) {
			$WP_HOME = 'https://' . $envs['container2'];
		} else {
			$WP_HOME = $envs['staging'];
		}
		break;
	case 'production':
		if ($_SERVER['HTTP_HOST'] === $envs['container1']) {
			$WP_HOME = 'https://' . $envs['container1'];
		} elseif ($_SERVER['HTTP_HOST'] === $envs['container2']) {
			$WP_HOME = 'https://' . $envs['container2'];
		} else {
			$WP_HOME = $envs['production'];
		}
		break;
	default:
		$WP_HOME = $envs['development'];
}

$WP_SITEURL = $WP_HOME;

Config::define('WP_HOME', $WP_HOME);
Config::define('WP_SITEURL', $WP_SITEURL);

/**
 * Custom Content Directory
 */
Config::define('CONTENT_DIR', '/wp-content');
Config::define('WP_CONTENT_DIR', $webroot_dir . Config::get('CONTENT_DIR'));
Config::define('WP_CONTENT_URL', Config::get('WP_HOME') . Config::get('CONTENT_DIR'));
Config::define('WEB_ROOT', $root_dir);

/**
 * DB settings
 */
Config::define('DB_NAME', env('DB_NAME'));
Config::define('DB_USER', env('DB_USER'));
Config::define('DB_PASSWORD', env('DB_PASSWORD'));
Config::define('DB_HOST', env('DB_HOST') ?: 'localhost');
Config::define('DB_CHARSET', 'utf8mb4');
Config::define('DB_COLLATE', '');
$table_prefix = env('DB_PREFIX') ?: 'wp_';

if (env('DATABASE_URL')) {
	$dsn = (object) parse_url(env('DATABASE_URL'));

	Config::define('DB_NAME', substr($dsn->path, 1));
	Config::define('DB_USER', $dsn->user);
	Config::define('DB_PASSWORD', isset($dsn->pass) ? $dsn->pass : null);
	Config::define('DB_HOST', isset($dsn->port) ? "{$dsn->host}:{$dsn->port}" : $dsn->host);
}

/**
 * Authentication Unique Keys and Salts
 */
Config::define('AUTH_KEY', env('AUTH_KEY'));
Config::define('SECURE_AUTH_KEY', env('SECURE_AUTH_KEY'));
Config::define('LOGGED_IN_KEY', env('LOGGED_IN_KEY'));
Config::define('NONCE_KEY', env('NONCE_KEY'));
Config::define('AUTH_SALT', env('AUTH_SALT'));
Config::define('SECURE_AUTH_SALT', env('SECURE_AUTH_SALT'));
Config::define('LOGGED_IN_SALT', env('LOGGED_IN_SALT'));
Config::define('NONCE_SALT', env('NONCE_SALT'));

/**
 * Custom Settings
 */
Config::define('AUTOMATIC_UPDATER_DISABLED', true);
Config::define('DISABLE_WP_CRON', env('DISABLE_WP_CRON') ?: false);
// Disable the plugin and theme file editor in the admin
Config::define('DISALLOW_FILE_EDIT', true);
// Disable plugin and theme updates and installation from the admin
Config::define('DISALLOW_FILE_MODS', true);
// Limit the number of post revisions that Wordpress stores (true (default WP): store every revision)
Config::define('WP_POST_REVISIONS', env('WP_POST_REVISIONS') ?: true);

// Set default theme
Config::define('WP_DEFAULT_THEME', 'template');

/**
 * Debugging Settings
 */
Config::define('WP_DEBUG_DISPLAY', false);
Config::define('WP_DEBUG_LOG', false);
Config::define('SCRIPT_DEBUG', false);
ini_set('display_errors', '0');

/**
 * Allow WordPress to detect HTTPS when used behind a reverse proxy or a load balancer
 * See https://codex.wordpress.org/Function_Reference/is_ssl#Notes
 */
if (isset($_SERVER['HTTP_X_FORWARDED_PROTO']) && $_SERVER['HTTP_X_FORWARDED_PROTO'] === 'https') {
	$_SERVER['HTTPS'] = 'on';
}

$env_config = __DIR__ . '/environments/' . WP_ENV . '.php';

if (file_exists($env_config)) {
	require_once $env_config;
}

Config::apply();

/**
 * Bootstrap WordPress
 */
if (!defined('ABSPATH')) {
	define('ABSPATH', $webroot_dir . '/');
}
