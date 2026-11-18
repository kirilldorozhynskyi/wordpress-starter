<?php

namespace Inertia;

use EvoMark\InertiaWordpress\Helpers\Wordpress;
use EvoMark\InertiaWordpress\InertiaController;

class Search extends InertiaController
{
	public function handle()
	{
		$title = sprintf(__('Search results for “%s”'), get_search_query(false));

		return $this->render('Archive', ['archive' => Wordpress::getArchiveData($title)]);
	}
}
