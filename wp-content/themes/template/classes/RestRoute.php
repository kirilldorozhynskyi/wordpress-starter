<?php

namespace JDEV;

use WP_REST_Server;

class RestRoute
{
	public static function registerRoute($methods, $route, $callback, $args = [])
	{
		$route = str_replace('{', '(?P<', $route);
		$route = str_replace('}', '>\S+)', $route);

		add_action('rest_api_init', function () use ($methods, $route, $callback, $args) {
			register_rest_route('jdev', $route, [
				'methods' => $methods,
				'callback' => $callback,
				'permission_callback' => '__return_true', // Настройте, если требуется проверка прав
				'args' => $args,
			]);
		});
	}

	public static function get($route, $callback, $args = [])
	{
		self::registerRoute(WP_REST_Server::READABLE, $route, $callback, $args);
	}

	public static function getWithWildcards($route, $callback, $args = [])
	{
		$route .= '(?P<extra_path>.*)'; // Захват всего после /get-image/
		self::get($route, $callback, $args);
	}

	public static function post($route, $callback, $args = [])
	{
		self::registerRoute(WP_REST_Server::CREATABLE, $route, $callback, $args);
	}

	public static function edit($route, $callback, $args = [])
	{
		self::registerRoute(WP_REST_Server::EDITABLE, $route, $callback, $args);
	}

	public static function delete($route, $callback, $args = [])
	{
		self::registerRoute(WP_REST_Server::DELETABLE, $route, $callback, $args);
	}
}
