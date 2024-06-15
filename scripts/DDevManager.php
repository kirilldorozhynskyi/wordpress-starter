<?php

namespace JDEVINT;

use Composer\Script\Event;
use Symfony\Component\Console\Input\ArgvInput;
use Symfony\Component\Console\Output\ConsoleOutput;
use Symfony\Component\Console\Style\SymfonyStyle;
use Symfony\Component\Console\Question\ChoiceQuestion;

class DDevManager
{
	private static $projectName;
	private static $useDdev;

	public static function getProjectName()
	{
		$io = new SymfonyStyle(new ArgvInput(), new ConsoleOutput());
		$folderName = basename(dirname(__DIR__));
		$char = ['.', ' '];
		$defaultProjectName = str_replace($char, '', $folderName);

		self::$projectName = $io->ask('<info>Write your [<comment>ENV_DEVELOPMENT</comment>]</info> ', $defaultProjectName);

		return self::$projectName;
	}

	public static function addDDev(Event $event)
	{
		$io = new SymfonyStyle(new ArgvInput(), new ConsoleOutput());

		self::$useDdev = Tools::askConfirmation($io, '<info>Use ddev?</info> [<comment>Y,n</comment>]? ');

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

	public static function useProjectName()
	{
		return self::$projectName;
	}

	public static function useDdev()
	{
		return self::$useDdev;
	}
}
