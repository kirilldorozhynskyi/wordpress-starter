<?php

/**
 * Plugin Name: Inertia WordPress PUC Compatibility
 * Description: Provides backwards-compatible aliases for the Plugin Update Checker library used by Inertia WordPress.
 * Author: Internal tooling
 */

if (!defined('ABSPATH')) {
	exit();
}

add_action(
	'plugins_loaded',
	static function (): void {
		$legacyClass = 'YahnisElsts\\PluginUpdateChecker\\v5p5\\Vcs\\Api';
		$githubClass = \YahnisElsts\PluginUpdateChecker\v5\PucFactory::getLatestClassVersion('GitHubApi');
		$currentClass = $githubClass ? get_parent_class($githubClass) : false;

		if (class_exists($legacyClass, false)) {
			return;
		}

		if (!$currentClass || !class_exists($currentClass)) {
			return;
		}

		class_alias($currentClass, $legacyClass);
	},
	0,
);
