<?php

namespace JDEVINT;

use Composer\Script\Event;

class Installer
{
	public static function create(Event $event)
	{
		DDevManager::addDDev($event);
		WorkspaceManager::addWorkspace($event);
		EnvManager::addEnv($event);
		SaltManager::addSalts($event);
	}

	public static function install(Event $event)
	{
		// EnvManager::addEnv($event);
		// SaltManager::addSalts($event);
		DDevManager::addDDev($event);
		WorkspaceManager::addWorkspace($event);
		EnvManager::addEnv($event);
		SaltManager::addSalts($event);
	}
}
