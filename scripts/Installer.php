<?php

namespace JDEVINT;

use Composer\Script\Event;

class Installer
{
	public static function create(Event $event): void
	{
		if (!$event->getIO()->isInteractive()) {
			return;
		}

		DDevManager::addDDev();
		WorkspaceManager::addWorkspace();
		EnvManager::addEnv();
		SaltManager::addSalts();
	}
}
