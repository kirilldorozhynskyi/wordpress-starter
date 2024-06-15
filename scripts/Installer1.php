<?php

namespace JDEVINT;

use Composer\Script\Event;
use Symfony\Component\Console\Input\ArgvInput;
use Symfony\Component\Console\Output\ConsoleOutput;
use Symfony\Component\Console\Style\SymfonyStyle;
use Symfony\Component\Console\Question\ChoiceQuestion;
use Symfony\Component\Yaml\Yaml;

class Installer
{
	private static $projectName;
	private static $ddevName;
	private static $useDdev;

	public static $KEYS = ['AUTH_KEY', 'SECURE_AUTH_KEY', 'LOGGED_IN_KEY', 'NONCE_KEY', 'AUTH_SALT', 'SECURE_AUTH_SALT', 'LOGGED_IN_SALT', 'NONCE_SALT'];

	private static function askConfirmation(SymfonyStyle $symfonyStyle, $questionText, $default = true)
	{
		$question = new ChoiceQuestion($questionText, ['yes', 'no'], $default ? 0 : 1);
		$question->setErrorMessage('Option %s is invalid.');
		return $symfonyStyle->askQuestion($question) === 'yes';
	}

	private static function getProjectName()
	{
		$io = new SymfonyStyle(new ArgvInput(), new ConsoleOutput());
		$folderName = basename(dirname(__DIR__));
		$char = ['.', ' '];
		$defaultProjectName = str_replace($char, '', $folderName);

		$projectName = $io->ask('<info>Please enter the project name default:</info> ', $defaultProjectName);

		return $projectName;
	}

	public static function addDDev(Event $event)
	{
		$io = new SymfonyStyle(new ArgvInput(), new ConsoleOutput());

		self::$useDdev = self::askConfirmation($io, '<info>Use ddev?</info> [<comment>Y,n</comment>]? ');

		if (self::$useDdev) {
			self::$projectName = self::getProjectName();

			$configPath = dirname(__DIR__) . '/.ddev/config.yaml';
			if (file_exists($configPath)) {
				$configContent = file_get_contents($configPath);
				$updatedContent = str_replace('wordpress-starter', self::$projectName, $configContent);
				file_put_contents($configPath, $updatedContent);
			} else {
				echo "Error: .ddev/config.yaml file not found.\n";
			}
		}
	}

	public static function addWorkspace(Event $event)
	{
		$newWorkspacePath = dirname(__DIR__) . '/' . self::$projectName . '.code-workspace';

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
		echo 'Created ' . self::$projectName . '.code-workspace file with the specified content.' . "\n";
	}

	private static function generateSalt($length = 64)
	{
		$chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
		$chars .= '!@#$%^&*()';
		$chars .= '-_ []{}<>~`+=,.;:/?|';

		$salt = '';
		for ($i = 0; $i < $length; $i++) {
			$salt .= substr($chars, rand(0, strlen($chars) - 1), 1);
		}

		return $salt;
	}

	private static function getDBCredentials(SymfonyStyle $io)
	{
		$DB_NAME = $io->ask('<info>Write your [<comment>DB_NAME</comment>] (empty: db)</info> ', 'db');
		$DB_USER = $io->ask('<info>Write your [<comment>DB_USER</comment>] (empty: db)</info> ', 'db');
		$DB_PASSWORD = $io->ask('<info>Write your [<comment>DB_PASSWORD</comment>] (empty: db)</info> ', 'db');
		$DB_HOST = $io->ask('<info>Write your [<comment>DB_HOST</comment>] (empty: db)</info> ', 'db');

		return [$DB_NAME, $DB_USER, $DB_PASSWORD, $DB_HOST];
	}

	public static function addEnv(Event $event)
	{
		$io = new SymfonyStyle(new ArgvInput(), new ConsoleOutput());

		if (!self::askConfirmation($io, '<info>Generate .env file?</info> [<comment>Y,n</comment>? ')) {
			return;
		}

		$envFile = dirname(__DIR__) . '/.env';
		if (file_exists($envFile)) {
			echo "Error: .env file exists.\n";

			if (!self::askConfirmation($io, '<info>Rewrite .env file?</info> [<comment>Y,n</comment>? ')) {
				return;
			}
		}

		if (self::$projectName) {
			self::$ddevName = 'https://' . self::$projectName . '.ddev.site';
		} else {
			$configPath = dirname(__DIR__) . '/.ddev/config.yaml';
			if (file_exists($configPath)) {
				$configContent = file_get_contents($configPath);
				$config = Yaml::parse($configContent);
				self::$ddevName = "https://{$config['name']}.ddev.site";
			}
		}

		if (self::$useDdev) {
			[$DB_NAME, $DB_USER, $DB_PASSWORD, $DB_HOST] = ['db', 'db', 'db', 'db'];
			$WP_ENV = 'development';
			$ENV_DEVELOPMENT = self::$ddevName;
		} else {
			self::$useDdev = self::askConfirmation($io, '<info>Use ddev? Mode: "development"</info> [<comment>Y,n</comment>]? ');

			if (self::$useDdev) {
				[$DB_NAME, $DB_USER, $DB_PASSWORD, $DB_HOST, $WP_ENV] = ['db', 'db', 'db', 'db', 'development'];
				$ENV_DEVELOPMENT = self::$ddevName;
			} else {
				[$DB_NAME, $DB_USER, $DB_PASSWORD, $DB_HOST] = self::getDBCredentials($io);
				$wpenvQuestion = new ChoiceQuestion(
					'<info>Write your [<comment>WP_ENV: development / staging / production</comment>]</info> ',
					['development', 'staging', 'production'],
					0,
				);
				$wpenvQuestion->setErrorMessage('Option %s is invalid.');

				$WP_ENV = $io->askQuestion($wpenvQuestion);

				$ENV_DEVELOPMENT = $io->ask('<info>Write your [<comment>ENV_DEVELOPMENT</comment>]</info> ', self::$ddevName);
			}
		}

		$ENV_STAGING = $io->ask('<info>Write your [<comment>ENV_STAGING</comment>]</info> ', '#');
		if (!preg_match('/^https?:\/\//', $ENV_STAGING)) {
			$ENV_STAGING = "https://{$ENV_STAGING}";
		}

		$ENV_PRODUCTION = $io->ask('<info>Write your [<comment>ENV_PRODUCTION</comment>]</info> ', '#');
		if (!preg_match('/^https?:\/\//', $ENV_PRODUCTION)) {
			$ENV_PRODUCTION = "https://{$ENV_PRODUCTION}";
		}

		$APP_URL = '${ENV_DEVELOPMENT}';

		$envContent = <<<EOL
		DB_NAME='{$DB_NAME}'
		DB_USER='{$DB_USER}'
		DB_PASSWORD='{$DB_PASSWORD}'
		DB_HOST='{$DB_HOST}'
		DB_PREFIX='qkH6Xk_'

		WP_ENV='{$WP_ENV}'

		ENV_DEVELOPMENT='{$ENV_DEVELOPMENT}'
		ENV_STAGING='{$ENV_STAGING}'
		ENV_PRODUCTION='{$ENV_PRODUCTION}'

		APP_URL={$APP_URL}


		EOL;

		file_put_contents($envFile, $envContent);
	}

	public static function addSalts(Event $event)
	{
		$io = new SymfonyStyle(new ArgvInput(), new ConsoleOutput());

		if (!self::askConfirmation($io, 'Generate salts and append to .env file?</info> [<comment>Y,n</comment>? ')) {
			return;
		}

		$salts = array_map(function ($key) {
			$salt = str_replace("$", 'black', self::generateSalt());
			return sprintf("%s='%s'", $key, $salt);
		}, self::$KEYS);

		$envFile = dirname(__DIR__) . '/.env';

		if (file_exists($envFile)) {
			file_put_contents($envFile, implode("\n", $salts), FILE_APPEND | LOCK_EX);
		}
	}

	public static function create(Event $event)
	{
		self::addDDev($event);
		self::addWorkspace($event);
		self::addEnv($event);
		self::addSalts($event);
	}

	public static function install(Event $event)
	{
		// self::addEnv($event);
		// self::addSalts($event);

		self::addDDev($event);
		self::addWorkspace($event);
		self::addEnv($event);
		self::addSalts($event);
	}
}
