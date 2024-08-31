<?php

namespace JDEV;

use JDEV\RestRoute;
use Timber\Timber;

class DynamicImages
{
	public function __construct()
	{
		RestRoute::getWithWildcards('get-image', [$this, 'getImage']);
	}

	public static function get_image_id_by_filename($filename)
	{
		global $wpdb;

		// Remove file extension from filename if needed
		$filename_no_ext = pathinfo($filename, PATHINFO_FILENAME);

		// Prepare SQL query
		$query = $wpdb->prepare(
			"SELECT ID FROM $wpdb->posts
            WHERE post_type = 'attachment'
            AND post_title LIKE %s",
			'%' . $wpdb->esc_like($filename_no_ext) . '%',
		);

		// Get the image ID
		$image_id = $wpdb->get_var($query);

		return $image_id;
	}

	public function getImage($request)
	{
		$filename = $request->get_param('extra_path');
		$extra_path = ltrim($filename, '/');
		$imageID = self::get_image_id_by_filename($filename);
		$width = $request->get_param('w') ?? null;
		$height = $request->get_param('h') ?? null;
		$webp = $request->get_param('webp') ?? false;

		$context = [
			'image' => $imageID,
			'width' => $width,
			'height' => $height,
			'webp' => $webp,
		];

		$image_url = esc_url(Timber::compile('components/_img.twig', $context));
		// $image_url = esc_url(Timber::compile(plugin_dir_path(__FILE__) . 'components/_img.twig', $context));

		if ($image_url) {
			$image_content = @file_get_contents($image_url);
			if ($image_content === false) {
				die('Error getting image');
			}

			header('Content-type: image/jpeg');
			header('Content-Length: ' . strlen($image_content));
			header('Content-Disposition: inline; filename="' . $filename . '"');

			echo $image_content;
		} else {
			return false;
		}
	}
}
