<?php

namespace JDEVINT;

use Symfony\Component\Console\Input\ArgvInput;
use Symfony\Component\Console\Output\ConsoleOutput;
use Symfony\Component\Console\Style\SymfonyStyle;

class DDevManager
{
	private static string $projectName;
	private static bool $useDdev;

	public static function addDDev(): void
	{
		$io = new SymfonyStyle(new ArgvInput(), new ConsoleOutput());
		$defaultName = strtolower(basename(dirname(__DIR__)));
		$defaultName = trim(preg_replace('/[^a-z0-9]+/', '-', $defaultName), '-');
		self::$useDdev = Tools::askConfirmation($io, 'Use DDEV? [yes, no] ', true);

		self::$projectName = $io->ask('Project slug', $defaultName ?: 'wordpress-site', static function (string $slug): string {
			if (!preg_match('/^[a-z0-9][a-z0-9-]{0,61}[a-z0-9]$|^[a-z0-9]$/D', $slug)) {
				throw new \InvalidArgumentException('Use up to 63 lowercase letters, digits or hyphens, with no leading or trailing hyphen.');
			}
			return $slug;
		});

		if (!self::$useDdev) {
			return;
		}

		$configPath = dirname(__DIR__) . '/.ddev/config.yaml';
		$config = file_get_contents($configPath);
		if ($config === false) {
			throw new \RuntimeException('Cannot read .ddev/config.yaml.');
		}

		$config = preg_replace('/^name:[^\r\n]*/m', 'name: ' . self::$projectName, $config, 1, $updated);
		if ($updated !== 1 || file_put_contents($configPath, $config, LOCK_EX) === false) {
			throw new \RuntimeException('Cannot update the project name in .ddev/config.yaml.');
		}
	}

	public static function useProjectName(): string
	{
		return self::$projectName;
	}

	public static function useDdev(): bool
	{
		return self::$useDdev;
	}
}
