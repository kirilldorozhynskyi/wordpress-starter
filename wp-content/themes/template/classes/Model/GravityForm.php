<?php

namespace JDEV\Model;

use JDEV\RestRoute;
use JDEV\Controller\GravityFormController;

/**
 * Class GravityForm
 *
 * @package JDEV
 */
class GravityForm
{
	public function __construct()
	{
		RestRoute::get('get-form', [new GravityFormController(), 'getForm']);
		RestRoute::post('submit-form', [new GravityFormController(), 'submitForm']);
		RestRoute::post('upload-file', [new GravityFormController(), 'uploadFile']);
	}
}
