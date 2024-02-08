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
	private $maxUploadFileSize = 5000000; // 5MB in bytes

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
		return $_GET['id'] ? GFAPI::get_form($_GET['id']) : null;
	}

	/**
	 * Submit form
	 *
	 * @param $request
	 * @return string | array
	 */
	public function submitForm($request)
	{
		if ((bool) $request->get_param('honeypot') == true) {
			return 'BOT';
		}
		$id = $request->get_param('id');
		$form = GFAPI::get_form($id);
		$currentPage = $request->get_param('currentPage');
		$nextPage = $currentPage ? $currentPage + 1 : 0;
		$inputsArray = [];
		foreach ($form['fields'] as $field) {
			$inputsArray[] = 'input_' . $field['id'];
			foreach ($field['inputs'] as $input) {
				$inputsArray[] = 'input_' . str_replace('.', '_', $input['id']);
			}
		}
		$inputs = [];
		foreach ($inputsArray as $input) {
			$inputs[$input] = $request->get_param($input);
		}
		return GFAPI::submit_form($id, $inputs, null, $nextPage, $currentPage);
	}

	/**
	 * Set directory for file uploads
	 *
	 * @param $dir
	 * @return mixed
	 */
	public function setUploadDirectory($dir)
	{
		$dir['path'] = WP_CONTENT_DIR . '/uploads/gravity_forms';
		$dir['url'] = WP_CONTENT_URL . '/uploads/gravity_forms';
		return $dir;
	}

	/**
	 * Upload file
	 *
	 * @return mixed
	 */
	public function uploadFile()
	{
		if ($_FILES['file']['size'] > $this->maxUploadFileSize) {
			return false;
		}
		if (!function_exists('wp_handle_upload')) {
			require_once ABSPATH . 'wp-admin/includes/file.php';
		}
		add_filter('upload_dir', [$this, 'setUploadDirectory']);
		$upload = wp_handle_upload($_FILES['file'], ['test_form' => false]);
		remove_filter('upload_dir', [$this, 'setUploadDirectory']);
		return $upload;
	}
}
