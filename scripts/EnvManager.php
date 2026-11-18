<?php

namespace JDEVINT;

use Symfony\Component\Console\Input\ArgvInput;
use Symfony\Component\Console\Output\ConsoleOutput;
use Symfony\Component\Console\Style\SymfonyStyle;
use Symfony\Component\Console\Question\ChoiceQuestion;

class EnvManager
{
	private static function getDBCredentials(SymfonyStyle $io)
	{
		$DB_NAME = $io->ask('<info>Write your [<comment>DB_NAME</comment>] (empty: db)</info> ', 'db');
		$DB_USER = $io->ask('<info>Write your [<comment>DB_USER</comment>] (empty: db)</info> ', 'db');
		$DB_PASSWORD = $io->askHidden('DB password (empty: db)') ?? 'db';
		$DB_HOST = $io->ask('<info>Write your [<comment>DB_HOST</comment>] (empty: db)</info> ', 'db');

		return [$DB_NAME, $DB_USER, $DB_PASSWORD, $DB_HOST];
	}

	public static function addEnv(): void
	{
		$io = new SymfonyStyle(new ArgvInput(), new ConsoleOutput());

		if (!Tools::askConfirmation($io, '<info>Generate .env file?</info> [<comment>Y,n</comment>?] ')) {
			return;
		}

		$envFile = dirname(__DIR__) . '/.env';
		if (file_exists($envFile)) {
			echo "Error: .env file exists.\n";

			if (!Tools::askConfirmation($io, '<info>Rewrite .env file?</info> [<comment>y,N</comment>] ', false)) {
				return;
			}
		}

		if (DDevManager::useDdev()) {
			[$DB_NAME, $DB_USER, $DB_PASSWORD, $DB_HOST] = ['db', 'db', 'db', 'db'];
			$WP_ENV = 'development';
			$ENV_DEVELOPMENT = 'https://' . DDevManager::useProjectName() . '.ddev.site';
		} else {
			[$DB_NAME, $DB_USER, $DB_PASSWORD, $DB_HOST] = self::getDBCredentials($io);

			$wpenvQuestion = new ChoiceQuestion(
				'<info>Write your [<comment>WP_ENV: development / staging / production</comment>]</info> ',
				['development', 'staging', 'production'],
				0,
			);
			$wpenvQuestion->setErrorMessage('Option %s is invalid.');
			$WP_ENV = $io->askQuestion($wpenvQuestion);

			$ENV_DEVELOPMENT = $io->ask('Development URL', DDevManager::useProjectName() . '.test', self::normalizeUrl(...));
		}

		$ENV_STAGING = $io->ask('Staging URL (optional)', '', self::normalizeUrl(...));
		$ENV_PRODUCTION = $io->ask('Production URL (optional)', '', self::normalizeUrl(...));

		$APP_URL = '${ENV_DEVELOPMENT}';
		$dbName = self::quoteEnvValue($DB_NAME);
		$dbUser = self::quoteEnvValue($DB_USER);
		$dbPassword = self::quoteEnvValue($DB_PASSWORD);
		$dbHost = self::quoteEnvValue($DB_HOST);

		$envContent = <<<EOL
		DB_NAME={$dbName}
		DB_USER={$dbUser}
		DB_PASSWORD={$dbPassword}
		DB_HOST={$dbHost}
		DB_PREFIX='qkH6Xk_'

		WP_ENV='{$WP_ENV}'

		ENV_DEVELOPMENT='{$ENV_DEVELOPMENT}'
		ENV_STAGING='{$ENV_STAGING}'
		ENV_PRODUCTION='{$ENV_PRODUCTION}'

		APP_URL={$APP_URL}


		EOL;

		if (file_put_contents($envFile, $envContent, LOCK_EX) === false) {
			throw new \RuntimeException('Cannot write .env.');
		}
	}

	private static function quoteEnvValue(string $value): string
	{
		return '"' . addcslashes($value, "\\\"\$") . '"';
	}

	private static function normalizeUrl(?string $value): string
	{
		$value = trim($value ?? '');
		if ($value === '') {
			return '';
		}

		$url = preg_match('/^https?:\/\//i', $value) ? $value : 'https://' . $value;
		if (!filter_var($url, FILTER_VALIDATE_URL) || strpbrk($url, "'\\") !== false) {
			throw new \InvalidArgumentException('Enter a valid HTTP or HTTPS URL.');
		}

		return $url;
	}
}
