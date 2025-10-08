<?php

namespace Template;

use EvoMark\InertiaWordpress\InertiaController;

class Page extends InertiaController
{
    public function handle()
    {
        return $this->render("Home", []);
    }
}
