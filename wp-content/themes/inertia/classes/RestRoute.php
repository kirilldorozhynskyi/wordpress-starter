<?php

namespace InertiaTheme;

use WP_REST_Server;

class RestRoute
{
	private const PRIMARY_NAMESPACE = 'inertia/v1';
	private const LEGACY_NAMESPACE = 'jdev';

	public static function get(string $route, callable $callback, array $args = []): void
	{
		self::registerRoute(WP_REST_Server::READABLE, $route, $callback, $args);
	}

	public static function getWithWildcards(string $route, callable $callback, array $args = []): void
	{
		self::get(rtrim($route, '/') . '/(?P<extra_path>.*)', $callback, $args);
	}

	public static function post(string $route, callable $callback, array $args = []): void
	{
		self::registerRoute(WP_REST_Server::CREATABLE, $route, $callback, $args);
	}

	public static function edit(string $route, callable $callback, array $args = []): void
	{
		self::registerRoute(WP_REST_Server::EDITABLE, $route, $callback, $args);
	}

	public static function delete(string $route, callable $callback, array $args = []): void
	{
		self::registerRoute(WP_REST_Server::DELETABLE, $route, $callback, $args);
	}

	public static function registerRoute(string $methods, string $route, callable $callback, array $args = []): void
	{
		$normalized_route = preg_replace('/\{([a-zA-Z0-9_-]+)\}/', '(?P<$1>[^/]+)', trim($route, '/'));

		add_action('rest_api_init', static function () use ($methods, $normalized_route, $callback, $args) {
			$route_definition = [
				'methods' => $methods,
				'callback' => $callback,
				'permission_callback' => '__return_true',
				'args' => $args,
			];

			foreach (self::getNamespaces() as $namespace) {
				register_rest_route($namespace, '/' . $normalized_route, $route_definition);
			}
		});
	}

	private static function getNamespaces(): array
	{
		return array_values(array_unique([self::PRIMARY_NAMESPACE, self::LEGACY_NAMESPACE]));
	}
}
