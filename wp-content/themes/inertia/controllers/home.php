<?php

namespace Inertia;

use EvoMark\InertiaWordpress\Helpers\Wordpress;
use EvoMark\InertiaWordpress\InertiaController;

class Home extends InertiaController
{
	public function handle()
	{
		$title = is_front_page() ? get_bloginfo('name') : single_post_title('', false);

		return $this->render('Archive', ['archive' => Wordpress::getArchiveData($title ?: __('Posts'))]);
	}
}
