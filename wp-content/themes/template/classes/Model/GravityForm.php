<?php

namespace JDEV\Model;

use JDEV\RestRoute;
use JDEV\Controller\GravityFormController;

use GFAPI;
use RGFormsModel;
use GF_Field_Consent;
use GF_Field_Email;
use GF_Field_Radio;
use GF_Field_Text;
use GF_Field_Textarea;

/**
 * Class GravityForm
 *
 * @package JDEV
 */
class GravityForm
{
	private $forms = [];

	public function __construct()
	{
		add_action('init', [$this, 'registerForms']);
		add_action('init', [$this, 'createOrUpdateForms']);
		add_action('init', [$this, 'modifyEditorCapabilities']);
		add_filter('gform_form_settings_menu', [$this, 'modifyFormSettingsMenu']);
		add_filter('gform_form_settings', [$this, 'modifyFormSettingsFields']);
		add_filter('gform_field_groups_form_editor', [$this, 'modifyFormEditorFields']);

		RestRoute::get('get-form', [new GravityFormController(), 'getForm']);
		RestRoute::post('submit-form', [new GravityFormController(), 'submitForm']);
		RestRoute::post('upload-file', [new GravityFormController(), 'uploadFile']);
	}

	/*
	 * Register forms with fields
	 */
	public function registerForms()
	{
		$defaultNotifications = [
			[
				'id' => 1,
				'name' => 'Admin Notification',
				'event' => 'form_submission',
				'from' => '',
				'fromName' => get_bloginfo('name'),
				'subject' => 'New entry - {form_title}',
				'message' => '{all_fields}',
				'toType' => 'email',
				'to' => '',
				'isActive' => true,
			],
			[
				'id' => 2,
				'name' => 'Client Notification',
				'event' => 'form_submission',
				'from' => '',
				'fromName' => get_bloginfo('name'),
				'subject' => 'New entry - {form_title}',
				'message' => '{all_fields}',
				'toType' => 'email',
				'to' => '',
				'isActive' => false,
			],
			[
				'id' => 3,
				'name' => 'User Notification',
				'event' => 'form_submission',
				'from' => '',
				'fromName' => get_bloginfo('name'),
				'subject' => 'New entry - {form_title}',
				'message' => '{all_fields}',
				'toType' => 'email',
				'to' => '',
				'isActive' => false,
			],
		];

		// Newsletter Form
		$this->forms[] = [
			'is_active' => true,
			'title' => 'Newsletter Form',
			'notifications' => $defaultNotifications,
			'confirmations' => [
				[
					'id' => 1,
					'name' => 'Confirmation',
					'type' => 'message',
					'message' =>
						'<h2 class="mb-half">' .
						__('Thank you for contacting us!', 'jdev') .
						'</h2><h3>' .
						__('We will contact you shortly.', 'jdev') .
						'</h3>',
					'url' => '',
					'pageId' => 0,
					'queryString' => '',
					'isDefault' => true,
				],
			],
			'button' => [
				'type' => 'text',
				'text' => __('Einreichen', 'jdev'),
			],
			'fields' => [
				new GF_Field_Radio([
					'id' => 1,
					'adminLabel' => 'title',
					'label' => __('Salutation', 'jdev'),
					'placeholder' => __('Salutation', 'jdev'),
					'isRequired' => true,
					'choices' => [['text' => __('Mister', 'jdev'), 'value' => 'mister'], ['text' => __('Woman', 'jdev'), 'value' => 'woman']],
				]),
				new GF_Field_Text([
					'id' => 2,
					'adminLabel' => 'first-name',
					'label' => __('First name', 'jdev'),
					'placeholder' => __('First name', 'jdev'),
					'isRequired' => true,
				]),
				new GF_Field_Text([
					'id' => 3,
					'adminLabel' => 'last-name',
					'label' => __('Last name', 'jdev'),
					'placeholder' => __('Last name', 'jdev'),
					'isRequired' => true,
				]),
				new GF_Field_Email([
					'id' => 4,
					'adminLabel' => 'email',
					'label' => __('E-Mail', 'jdev'),
					'placeholder' => __('E-Mail', 'jdev'),
					'allowsPrepopulate' => true,
					'inputName' => 'email',
					'isRequired' => true,
				]),
				new GF_Field_Consent([
					'id' => 5,
					'adminLabel' => 'data-protection',
					'label' => __('Data protection', 'jdev'),
					'checkboxLabel' =>
						__('I accept the', 'jdev') . '<a href="' . get_permalink(PAGES['PRIVACY_POLICY']) . '"> ' . __('Privacy Policy', 'jdev') . '</a>.',
					'isRequired' => true,
					'choices' => [['text' => __('Checked', 'jdev'), 'value' => 1]],
				]),
			],
		];

		// Contact Form
		$this->forms[] = [
			'is_active' => true,
			'title' => 'Contact Form',
			'notifications' => $defaultNotifications,
			'confirmations' => [
				[
					'id' => 1,
					'name' => 'Confirmation',
					'type' => 'message',
					'message' =>
						'<h2 class="mb-half">' .
						__('Thank you for contacting us!', 'jdev') .
						'</h2><h3>' .
						__('We will contact you shortly.', 'jdev') .
						'</h3>',
					'url' => '',
					'pageId' => 0,
					'queryString' => '',
					'isDefault' => true,
				],
			],
			'button' => [
				'type' => 'text',
				'text' => __('Submit', 'jdev'),
			],
			'fields' => [
				new GF_Field_Radio([
					'id' => 1,
					'adminLabel' => 'title',
					'label' => __('Salutation', 'jdev'),
					'placeholder' => __('Salutation', 'jdev'),
					'isRequired' => true,
					'choices' => [['text' => __('Mister', 'jdev'), 'value' => 'mister'], ['text' => __('Woman', 'jdev'), 'value' => 'woman']],
				]),
				new GF_Field_Text([
					'id' => 2,
					'adminLabel' => 'first-name',
					'label' => __('First name', 'jdev'),
					'placeholder' => __('First name', 'jdev'),
					'isRequired' => true,
				]),
				new GF_Field_Text([
					'id' => 3,
					'adminLabel' => 'last-name',
					'label' => __('Last name', 'jdev'),
					'placeholder' => __('NacLast namehname', 'jdev'),
					'isRequired' => true,
				]),
				new GF_Field_Email([
					'id' => 4,
					'adminLabel' => 'email',
					'label' => __('E-Mail', 'jdev'),
					'placeholder' => __('E-Mail', 'jdev'),
					'allowsPrepopulate' => true,
					'inputName' => 'email',
					'isRequired' => true,
				]),
				new GF_Field_Textarea([
					'id' => 5,
					'adminLabel' => 'message',
					'label' => __('News', 'jdev'),
					'placeholder' => __('News', 'jdev'),
					'isRequired' => true,
				]),
				new GF_Field_Consent([
					'id' => 6,
					'adminLabel' => 'data-protection',
					'label' => __('Datenschutz', 'jdev'),
					'checkboxLabel' =>
						__('I accept the', 'jdev') . '<a href="' . get_permalink(PAGES['PRIVACY_POLICY']) . '"> ' . __('Privacy Policy', 'jdev') . '</a>.',
					'isRequired' => true,
					'choices' => [['text' => __('Checked', 'jdev'), 'value' => 1]],
				]),
			],
		];
	}

	/*
	 * Create or if already exist then update forms
	 */
	public function createOrUpdateForms()
	{
		$defaultSettings = [
			'labelPlacement' => 'top_label',
			'subLabelPlacement' => 'below',
			'descriptionPlacement' => 'below',
			'useCurrentUserAsAuthor' => 0,
			'postAuthor' => 1,
			'enableAnimation' => false,
			'enableHoneypot' => false,
		];

		foreach ($this->forms as $form) {
			$this->createRequiredInputs($form);
			$formID = RGFormsModel::get_form_id($form['title']);
			if (GFAPI::get_form($formID)) {
				GFAPI::update_form(array_merge($defaultSettings, $form), $formID);
			} else {
				GFAPI::add_form(array_merge($defaultSettings, $form));
			}
		}
	}

	/*
	 * Modify editor's capabilities
	 */
	public function modifyEditorCapabilities()
	{
		$editor = get_role('editor');
		$editor->add_cap('gravityforms_edit_forms');
		$editor->add_cap('gravityforms_view_entries');
		$editor->add_cap('gravityforms_edit_entries');
		$editor->add_cap('gravityforms_delete_entries');
		$editor->add_cap('gravityforms_view_entry_notes');
		$editor->add_cap('gravityforms_edit_entry_notes');
		$editor->add_cap('gravityforms_export_entries');
		$editor->remove_cap('gravityforms_create_form');
		$editor->remove_cap('gravityforms_delete_forms');
	}

	/**
	 * Modify form settings menu items
	 *
	 * @param $items
	 * @return array
	 */
	public function modifyFormSettingsMenu($items)
	{
		if (array_key_exists('editor', wp_get_current_user()->roles)) {
			unset($items[30]); // notification
			unset($items[40]); // personal data
		}
		return $items;
	}

	/*
	 * Modify form settings > settings tab fields
	 *
	 * @param $settings
	 * @return array
	 */
	public function modifyFormSettingsFields($settingsItems)
	{
		unset($settingsItems['Form Button']['form_button_conditional']);
		unset($settingsItems['Form Layout']);
		unset($settingsItems['Save and Continue']);
		unset($settingsItems['Restrictions']);
		unset($settingsItems['Form Options']);
		return $settingsItems;
	}

	/**
	 * Modify form editor fields - allow none for editors
	 *
	 * @param $fields
	 * @return array
	 */
	public function modifyFormEditorFields($fields)
	{
		return array_key_exists('editor', wp_get_current_user()->roles) ? [] : $fields;
	}

	/*
	 * Create additional required inputs for checkboxes and consents fields
	 */
	public static function createRequiredInputs($form)
	{
		foreach ($form['fields'] as $field) {
			$id = $field['id'];
			$type = $field->get_input_type();
			switch ($type) {
				case 'consent':
					$field['inputs'] = [
						['id' => floatval($id . '.' . 1), 'label' => 'Consent', 'isHidden' => false],
						['id' => floatval($id . '.' . 2), 'label' => 'Text', 'isHidden' => true],
						['id' => floatval($id . '.' . 3), 'label' => 'Description', 'isHidden' => true],
					];
					break;
				case 'checkbox':
					$inputs = [];
					foreach ($field['choices'] as $key => $choice) {
						$inputs[] = [
							'id' => floatval($id . '.' . ++$key),
							'label' => $choice['text'],
						];
					}
					$field['inputs'] = $inputs;
					break;
			}
		}
	}
}
