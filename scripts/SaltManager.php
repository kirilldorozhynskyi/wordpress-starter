<?php

namespace JDEVINT;

use Composer\Script\Event;
use Symfony\Component\Console\Input\ArgvInput;
use Symfony\Component\Console\Output\ConsoleOutput;
use Symfony\Component\Console\Style\SymfonyStyle;

class SaltManager
{
	public static $KEYS = ['AUTH_KEY', 'SECURE_AUTH_KEY', 'LOGGED_IN_KEY', 'NONCE_KEY', 'AUTH_SALT', 'SECURE_AUTH_SALT', 'LOGGED_IN_SALT', 'NONCE_SALT'];

	private static function generateSalt($length = 64)
	{
		return substr(bin2hex(random_bytes((int) ceil($length / 2))), 0, $length);
	}

	public static function addSalts(Event $event)
	{
		$io = new SymfonyStyle(new ArgvInput(), new ConsoleOutput());

		if (!Tools::askConfirmation($io, 'Generate salts and append to .env file?</info> [<comment>Y,n</comment>? ')) {
			return;
		}

		$salts = array_map(function ($key) {
			$salt = self::generateSalt();
			return sprintf("%s='%s'", $key, $salt);
		}, self::$KEYS);

		$envFile = dirname(__DIR__) . '/.env';

		if (file_exists($envFile)) {
			$content = file_get_contents($envFile);
			foreach ($salts as $salt) {
				$key = strstr($salt, '=', true);
				$pattern = '/^' . preg_quote($key, '/') . '=.*$/m';
				$content = preg_match($pattern, $content) ? preg_replace($pattern, $salt, $content) : rtrim($content) . "\n" . $salt . "\n";
			}
			file_put_contents($envFile, rtrim($content) . "\n", LOCK_EX);
		}
	}
}
