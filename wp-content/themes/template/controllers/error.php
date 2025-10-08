<?php

namespace Template;

use EvoMark\InertiaWordpress\InertiaController;

class Error extends InertiaController
{
    public function handle()
    {
        return $this->render("Error");
    }
}
