<?php

namespace Inertia\RestApi;

use InertiaTheme\Controller\GravityFormController;
use WP_REST_Request;
use EvoWpRestRegistration\BaseRestController;

defined('ABSPATH') or exit();

class GetFormGet extends BaseRestController
{
	protected $path = 'get-form';
	protected $methods = 'GET';

	protected $rules = [
		'id' => ['required', 'integer'],
		'lang' => ['sometimes', 'string', 'max:10'],
	];

	public function authorise()
	{
		return true;
	}

	public function handler(WP_REST_Request $request)
	{
		$validated = $this->validated();
		$controller = new GravityFormController();

		return $controller->getForm(
			(int) ($validated['id'] ?? 0),
			(string) ($validated['lang'] ?? '')
		);
	}
}
