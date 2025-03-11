<?php

namespace JDEV\Controller;

use GFAPI;

/**
 * Class GravityFormController
 *
 * @package JDEV
 */
class GravityFormController
{
	/**
	 * Get form by ID
	 *
	 * @return mixed
	 */
	public function getForm()
	{
		if (isset($_GET['lang'])) {
			do_action('wpml_switch_language', $_GET['lang']);
		}

		if (isset($_GET['id'])) {
			$form = GFAPI::get_form($_GET['id']);
			if ($form) {
				if (isset($form['notifications'])) {
					unset($form['notifications']);
				}

				if (isset($form['date_created'])) {
					unset($form['date_created']);
				}

				if (isset($form['fields']) && is_array($form['fields'])) {
					foreach ($form['fields'] as &$field) {
						$field['key'] = 'input_' . $field['id'];

						if (isset($field['choices']) && is_array($field['choices']) && $field['type'] != 'radio') {
							if ($field['type'] != 'radio' && $field['type'] != 'checkbox') {
								foreach ($field['choices'] as $choiceIndex => &$choice) {
									$field['key'] = 'input_' . $field['id'] . '_1';
								}
							}
						}
					}
				}

				return $form;
			}
		}

		return null;
	}
}
