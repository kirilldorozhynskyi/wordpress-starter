<?php

namespace JDEVINT;

use Composer\Script\Event;
use Symfony\Component\Console\Input\ArgvInput;
use Symfony\Component\Console\Output\ConsoleOutput;
use Symfony\Component\Console\Style\SymfonyStyle;
use Symfony\Component\Console\Question\ChoiceQuestion;
use Symfony\Component\Yaml\Yaml;

class Tools
{
	public static function askConfirmation(SymfonyStyle $symfonyStyle, $questionText, $default = true)
	{
		$question = new ChoiceQuestion($questionText, ['yes', 'no'], $default ? 0 : 1);
		$question->setErrorMessage('Option %s is invalid.');
		return $symfonyStyle->askQuestion($question) === 'yes';
	}
}
