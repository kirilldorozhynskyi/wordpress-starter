<?php

namespace Inertia;

use EvoMark\InertiaWordpress\Inertia;
use EvoMark\InertiaWordpress\InertiaController;

class Single extends InertiaController
{
	public function handle()
	{
		if (post_password_required()) {
			return $this->render('Protected', ['passwordForm' => get_the_password_form()]);
		}

		return $this->render('Post', [
			'post' => Inertia::getPost(),
		]);
	}
}
