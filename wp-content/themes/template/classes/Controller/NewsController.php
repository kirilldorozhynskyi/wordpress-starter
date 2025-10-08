<?php

namespace JDEV\Controller;

use JDEV\Model\News;
use Timber\Timber;

/**
 * Class NewsController
 *
 * @package JDEV
 */
class NewsController
{
	/**
	 * Get news IDs and categories
	 *
	 * @return array
	 */
	public function getNews()
	{
		$news = [];
		$posts = get_posts([
			'post_type' => 'news',
			'post_status' => 'publish',
			'posts_per_page' => -1,
			'suppress_filters' => false,
			'orderby' => 'date',
			'post__not_in' => [],
		]);
		foreach ($posts as $post) {
			$news[] = [
				'uid' => $post->ID,
			];
		}
		return $news;
	}

	/**
	 * Get news contents from given news IDs
	 *
	 * @return array
	 */
	public function getNewsContents()
	{
		$news = [];
		$i = 0;
		foreach (explode(',', $_GET['uids']) as $id) {
			$content = [];
			if (get_fields($id)) {
				foreach (get_fields($id) as $name => $value) {
					$content[$name] = $value;
				}
			}
			$post = Timber::get_post($id);

			$news[] = [
				'uid' => absint($id),
				'url' => get_permalink($id),
				'title' => get_the_title($id),
				'reading' =>
					(string) YoastSEO()->meta->for_post($id)->estimated_reading_time_minutes < 1
						? '1'
						: (string) YoastSEO()->meta->for_post($id)->estimated_reading_time_minutes . ' min',
				'thumbnail' => [
					'normal' => wp_get_attachment_image_src($post->thumbnail->id, 'news')[0],
					'retina' => wp_get_attachment_image_src($post->thumbnail->id, 'news2x')[0],
				],
			];
			$i++;
		}
		return $news;
	}
}
