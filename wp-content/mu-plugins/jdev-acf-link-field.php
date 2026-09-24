<?php
/**
 * Plugin Name: jDEV ACF Link Field
 * Description: Adds an ACF field type that behaves like Link and normalizes internal page links.
 */

if (!defined('ABSPATH')) {
	exit();
}

add_action('acf/include_field_types', static function (): void {
	if (!function_exists('acf_register_field_type')) {
		return;
	}

	if (!class_exists('acf_field_link')) {
		$linkFieldPath = defined('ACF_PATH') ? ACF_PATH . 'includes/fields/class-acf-field-link.php' : '';

		if (!$linkFieldPath || !file_exists($linkFieldPath)) {
			return;
		}

		require_once $linkFieldPath;
	}

	if (class_exists('JDEV_ACF_Field_Link')) {
		return;
	}

	class JDEV_ACF_Field_Link extends acf_field_link
	{
		public function initialize(): void
		{
			parent::initialize();

			$this->name = 'jdev_link';
			$this->label = __('jDEV Link', 'jdev');
			$this->description = __('ACF Link with internal page title fallback.', 'jdev');
			$this->defaults = [];
		}

		public function render_field_settings($field): void
		{
			// Always return the Link Array shape used by the Vue Button/Linker components.
		}

		public function get_link($value = ''): array
		{
			$link = parent::get_link($this->normalizeLegacyValue($value));

			if (!empty($link['url']) && empty($link['title'])) {
				$link['title'] = $this->getTitleFromUrl($link['url']) ?: $link['url'];
			}

			return [
				'title' => sanitize_text_field((string) ($link['title'] ?? '')),
				'url' => esc_url_raw((string) ($link['url'] ?? '')),
				'target' => ($link['target'] ?? '') === '_blank' ? '_blank' : '',
			];
		}

		public function format_value($value, $post_id, $field)
		{
			if (empty($value)) {
				return false;
			}

			$link = $this->get_link($value);

			return !empty($link['url']) ? $link : false;
		}

		public function update_value($value, $post_id, $field)
		{
			if (empty($value)) {
				return '';
			}

			$link = $this->get_link($value);

			if (empty($link['url'])) {
				return '';
			}

			return $this->getStorageValue($link);
		}

		public function validate_value($valid, $value, $field, $input)
		{
			if (empty($field['required'])) {
				return $valid;
			}

			$link = $this->get_link($value);

			return !empty($link['url']) ? $valid : __('Please select a page or enter a custom URL.', 'jdev');
		}

		private function normalizeLegacyValue($value)
		{
			if (!is_array($value) || empty($value['type'])) {
				return $value;
			}

			if ($value['type'] === 'page' && !empty($value['page_id'])) {
				$pageId = (int) $value['page_id'];
				$postType = get_post_type($pageId) ?: 'page';
				$translatedPageId = apply_filters('wpml_object_id', $pageId, $postType, true);
				$url = get_permalink($translatedPageId);
				$hash = !empty($value['hash']) ? '#' . ltrim((string) $value['hash'], '#') : '';

				return [
					'title' => !empty($value['title']) ? (string) $value['title'] : get_the_title($translatedPageId),
					'url' => $url ? $url . $hash : '',
					'target' => !empty($value['target']) && $value['target'] === '_blank' ? '_blank' : '',
				];
			}

			return [
				'title' => (string) ($value['title'] ?? ''),
				'url' => (string) ($value['url'] ?? ''),
				'target' => !empty($value['target']) && $value['target'] === '_blank' ? '_blank' : '',
			];
		}

		private function getStorageValue(array $link): array
		{
			// Keep query-bearing links intact (including plain WordPress permalinks).
			$postId = wp_parse_url($link['url'], PHP_URL_QUERY) === null ? $this->getPostIdFromUrl($link['url']) : 0;
			$target = $link['target'] === '_blank' ? '_blank' : '';
			$title = trim((string) $link['title']);

			if ($postId) {
				return [
					'type' => 'page',
					'page_id' => $postId,
					'title' => $title ?: get_the_title($postId),
					'target' => $target,
					'hash' => $this->getUrlHash($link['url']),
				];
			}

			return [
				'type' => 'custom',
				'url' => (string) $link['url'],
				'title' => $title ?: (string) $link['url'],
				'target' => $target,
			];
		}

		private function getTitleFromUrl(string $url): string
		{
			$postId = $this->getPostIdFromUrl($url);

			if (!$postId) {
				return '';
			}

			return (string) get_the_title($postId);
		}

		private function getPostIdFromUrl(string $url): int
		{
			$urlParts = wp_parse_url($url);

			if (!$urlParts || empty($urlParts['host'])) {
				return 0;
			}

			$homeParts = wp_parse_url(home_url('/'));

			if (!$homeParts || empty($homeParts['host']) || strtolower($urlParts['host']) !== strtolower($homeParts['host'])) {
				return 0;
			}

			$urlWithoutHash = strtok($url, '#') ?: $url;
			$urlWithoutQuery = strtok($urlWithoutHash, '?') ?: $urlWithoutHash;

			return (int) url_to_postid($urlWithoutQuery);
		}

		private function getUrlHash(string $url): string
		{
			$fragment = wp_parse_url($url, PHP_URL_FRAGMENT);

			return $fragment ? (string) $fragment : '';
		}
	}

	acf_register_field_type('JDEV_ACF_Field_Link');
});

add_action('acf/input/admin_enqueue_scripts', static function (): void {
	$script = <<<'JS'
			(function ($) {
				if (!window.acf || !acf.Field || !acf.wpLink) {
					return;
				}

				var JdevLinkField = acf.Field.extend({
					type: 'jdev_link',
					events: {
						'click a[data-name="add"]': 'onClickEdit',
						'click a[data-name="edit"]': 'onClickEdit',
						'click a[data-name="remove"]': 'onClickRemove',
						'change .link-node': 'onChange'
					},
					$control: function () {
						return this.$('.acf-link');
					},
					$node: function () {
						return this.$('.link-node');
					},
					getValue: function () {
						var $node = this.$node();

						return !!$node.attr('href') && {
							title: $node.text(),
							url: $node.attr('href'),
							target: $node.attr('target')
						};
					},
					setValue: function (value) {
						value = acf.parseArgs(value, {
							title: '',
							url: '',
							target: ''
						});

						var $control = this.$control();
						var $node = this.$node();

						$control.removeClass('-value -external');
						if (value.url) $control.addClass('-value');
						if (value.target === '_blank') $control.addClass('-external');

						this.$('.link-title').text(value.title);
						this.$('.link-url').attr('href', value.url).text(value.url);
						$node.text(value.title);
						$node.attr('href', value.url);
						$node.attr('target', value.target);
						this.$('.input-title').val(value.title);
						this.$('.input-target').val(value.target);
						this.$('.input-url').val(value.url).trigger('change');
					},
					onClickEdit: function (e) {
						e.preventDefault();
						acf.wpLink.open(this.$node());
					},
					onClickRemove: function (e) {
						e.preventDefault();
						this.setValue(false);
					},
					onChange: function () {
						this.setValue(this.getValue());
					}
				});

				acf.registerFieldType(JdevLinkField);
			})(jQuery);

	JS;

	wp_add_inline_script('acf-input', $script, 'after');
});
