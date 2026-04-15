<?php

namespace Inertia;

use EvoMark\InertiaWordpress\Inertia;
use EvoMark\InertiaWordpress\InertiaController;

class Single extends InertiaController
{
	public function handle()
	{
		return $this->render('Post', [
			'post' => Inertia::getPost(),
		]);
	}
}
