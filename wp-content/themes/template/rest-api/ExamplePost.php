<?php

namespace Template\RestApi;

use WP_REST_Request;
use EvoMark\InertiaWordpress\Inertia;
use EvoWpRestRegistration\BaseRestController;

defined('ABSPATH') or exit;

class ExamplePost extends BaseRestController
{
    protected $path = 'example';
    protected $methods = 'POST';

    protected $rules = [
        'name' => ['required', 'string', 'max:50']
    ];

    public function authorise()
    {
        return true;
    }

    public function handler(WP_REST_Request $request)
    {
        $validated = $this->validated();

        // Do stuff

        return Inertia::back();
    }
}
