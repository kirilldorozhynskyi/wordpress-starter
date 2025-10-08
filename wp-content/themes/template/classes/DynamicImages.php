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

	public function getImage($request)
	{
		$imageID = $request->get_param('id');

		if (!$imageID) {
			die('Missing image ID');
		}

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

		if ($image_url) {
			$image_content = @file_get_contents($image_url);
			if ($image_content === false) {
				die('Error getting image content');
			}

			$mime_type = $webp ? 'image/webp' : 'image/jpeg';
			header('Content-Type: ' . $mime_type);
			header('Content-Length: ' . strlen($image_content));

			echo $image_content;
			exit();
		} else {
			die('Image URL not found');
		}
	}
}
