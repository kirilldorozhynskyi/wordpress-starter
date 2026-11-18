<?php

namespace JDEVINT;

use Symfony\Component\Console\Input\ArgvInput;
use Symfony\Component\Console\Output\ConsoleOutput;
use Symfony\Component\Console\Style\SymfonyStyle;

class SaltManager
{
	private const KEYS = ['AUTH_KEY', 'SECURE_AUTH_KEY', 'LOGGED_IN_KEY', 'NONCE_KEY', 'AUTH_SALT', 'SECURE_AUTH_SALT', 'LOGGED_IN_SALT', 'NONCE_SALT'];

	private static function generateSalt(int $length = 64): string
	{
		return substr(bin2hex(random_bytes((int) ceil($length / 2))), 0, $length);
	}

	public static function addSalts(): void
	{
		$io = new SymfonyStyle(new ArgvInput(), new ConsoleOutput());

		$envFile = dirname(__DIR__) . '/.env';
		if (!is_file($envFile) || !Tools::askConfirmation($io, 'Generate missing salts in .env? [yes, no] ')) {
			return;
		}

		$salts = array_map(function ($key) {
			$salt = self::generateSalt();
			return sprintf("%s='%s'", $key, $salt);
		}, self::KEYS);

		$content = file_get_contents($envFile);
		if ($content === false) {
			throw new \RuntimeException('Cannot read .env.');
		}

		foreach ($salts as $salt) {
			$key = strstr($salt, '=', true);
			if (!preg_match('/^\s*(?:export\s+)?' . preg_quote($key, '/') . '\s*=/m', $content)) {
				$content = rtrim($content) . "\n" . $salt . "\n";
			}
		}

		if (file_put_contents($envFile, $content, LOCK_EX) === false) {
			throw new \RuntimeException('Cannot update salts in .env.');
		}
	}
}
