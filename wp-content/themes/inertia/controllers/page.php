<?php

namespace Inertia;

use EvoMark\InertiaWordpress\InertiaController;

class Page extends InertiaController
{
	public function handle()
	{
		if (post_password_required()) {
			return $this->render('Protected', ['passwordForm' => get_the_password_form()]);
		}

		return $this->render('Home', [
			'pageTitle' => wp_specialchars_decode(get_the_title()),
			'pageContent' => fn() => apply_filters('the_content', get_the_content()),
		]);
	}
}
