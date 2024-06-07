<?php

namespace JDEVINT;

use Composer\Script\Event;
use Symfony\Component\Console\Input\ArgvInput;
use Symfony\Component\Console\Output\ConsoleOutput;
use Symfony\Component\Console\Style\SymfonyStyle;
use Symfony\Component\Console\Question\ChoiceQuestion;
use Symfony\Component\Yaml\Yaml;

class EnvManager
{
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

		if (!DDevManager::useDdev()) {
			DDevManager::addDDev($event);
		}

		if (!Tools::askConfirmation($io, '<info>Generate .env file?</info> [<comment>Y,n</comment>? ')) {
			return;
		}

		$envFile = dirname(__DIR__) . '/.env';
		if (file_exists($envFile)) {
			echo "Error: .env file exists.\n";

			if (!Tools::askConfirmation($io, '<info>Rewrite .env file?</info> [<comment>Y,n</comment>? ')) {
				return;
			}
		}

		if (DDevManager::useDdev()) {
			[$DB_NAME, $DB_USER, $DB_PASSWORD, $DB_HOST] = ['db', 'db', 'db', 'db'];
			$WP_ENV = 'development';
			$ENV_DEVELOPMENT = DDevManager::useProjectName();
		} else {
			[$DB_NAME, $DB_USER, $DB_PASSWORD, $DB_HOST] = self::getDBCredentials($io);

			$wpenvQuestion = new ChoiceQuestion(
				'<info>Write your [<comment>WP_ENV: development / staging / production</comment>]</info> ',
				['development', 'staging', 'production'],
				0,
			);
			$wpenvQuestion->setErrorMessage('Option %s is invalid.');
			$WP_ENV = $io->askQuestion($wpenvQuestion);

			$ENV_DEVELOPMENT = $io->ask('<info>Write your [<comment>ENV_DEVELOPMENT</comment>]</info> ', DDevManager::useProjectName());

			if (!preg_match('/^https?:\/\//', $ENV_DEVELOPMENT)) {
				$ENV_DEVELOPMENT = "https://{$ENV_DEVELOPMENT}";
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
}
