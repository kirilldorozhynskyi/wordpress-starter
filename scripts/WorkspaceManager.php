<?php

namespace JDEVINT;

use Composer\Script\Event;

class WorkspaceManager
{
	public static function addWorkspace(Event $event)
	{
		$newWorkspacePath = dirname(__DIR__) . '/' . DDevManager::useProjectName() . '.code-workspace';

		$workspaceContent = <<<EOL
		{
		    "folders": [
		        {
		            "path": "."
		        }
		    ],
		    "settings": {
		        "psi-header.changes-tracking": {
		            "isActive": false
		        },
				"npm.exclude": "**/@(vendor|node_modules|bower_components|dist|static|wp-content)/**",
		        "files.exclude": {
		            "vendor": false,
		            "node_modules": false,
		            ".browserslistrc": true,
		            ".editorconfig": true,
		            ".eslintrc.js": true,
		            "babel.config.js": true,
		            "license.txt": true,
		            "readme.html": true,
		            "wp-admin/": false,
		            "wp-includes/": true,
		            "index.php": true,
		            "wp-activate.php": true,
		            "wp-blog-header.php": true,
		            "wp-comments-post.php": true,
		            "wp-config-ddev.php": false,
		            "wp-config-sample.php": true,
		            "wp-config.php": true,
		            "wp-cron.php": true,
		            "wp-links-opml.php": true,
		            "wp-load.php": true,
		            "wp-login.php": true,
		            "wp-mail.php": true,
		            "wp-settings.php": true,
		            "wp-signup.php": true,
		            "wp-trackback.php": true,
		            "xmlrpc.php": true,
		            "robots.txt": false,
		            "liesmich.html": true,
		            "composer.lock": true
		        }
		    }
		}
		EOL;

		file_put_contents($newWorkspacePath, $workspaceContent);
		echo 'Created ' . DDevManager::useProjectName() . '.code-workspace file with the specified content.' . "\n";
	}
}
