<?php

namespace Template;

use EvoMark\InertiaWordpress\Inertia;
use EvoMark\InertiaWordpress\InertiaController;

class Archive extends InertiaController
{
    public function handle()
    {
        return $this->render("Archive", [
            'archive' => Inertia::getArchive()
        ]);
    }
}
