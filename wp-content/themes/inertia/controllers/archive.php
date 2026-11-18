<?php

namespace Inertia;

use EvoMark\InertiaWordpress\Inertia;
use EvoMark\InertiaWordpress\InertiaController;

class Archive extends InertiaController
{
	public function handle()
	{
		$archive = Inertia::getArchive();
		$archive->title = wp_specialchars_decode(wp_strip_all_tags($archive->title));

		return $this->render('Archive', [
			'archive' => $archive,
		]);
	}
}
