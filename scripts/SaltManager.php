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
		$chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
		$chars .= '!@#$%^&*()';
		$chars .= '-_ []{}<>~`+=,.;:/?|';

		$salt = '';
		for ($i = 0; $i < $length; $i++) {
			$salt .= substr($chars, rand(0, strlen($chars) - 1), 1);
		}

		return $salt;
	}

	public static function addSalts(Event $event)
	{
		$io = new SymfonyStyle(new ArgvInput(), new ConsoleOutput());

		if (!Tools::askConfirmation($io, 'Generate salts and append to .env file?</info> [<comment>Y,n</comment>? ')) {
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
}
