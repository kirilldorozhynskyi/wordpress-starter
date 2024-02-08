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
		]);
		foreach ($posts as $post) {
			$categories = wp_get_post_terms($post->ID, 'news-category', ['fields' => 'ids']);
			$news[] = [
				'uid' => $post->ID,
				'categories' => $categories,
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
		foreach (explode(',', $_GET['uids']) as $id) {
			$context = News::createContext($id);
			$news[] = [
				'uid' => absint($id),
				'content' => Timber::compile('partials/posts/news/teaser.twig', $context),
			];
		}
		return $news;
	}
}
