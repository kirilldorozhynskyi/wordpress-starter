<?php
namespace JDEV\Controller;

use Timber\Timber;
use WP_Query;

/**
 * Class SearchController
 *
 * @package JDEV
 */
class SearchController
{
	/**
	 * Get search results IDs from given search query
	 *
	 * @param $request
	 * @return mixed
	 */
	public function getResults($request)
	{
		$results = [];
		$searchQuery = $request->get_param('query');
		if ($searchQuery) {
			$resultsQuery = new WP_Query([
				's' => $searchQuery,
				'post_status' => 'publish',
				'posts_per_page' => -1,
				'suppress_filters' => false,
				'orderby' => 'date',
			]);
			foreach ($resultsQuery->posts as $post) {
				$results[] = [
					'uid' => $post->ID,
				];
			}
		}
		return $results;
	}

	/**
	 * Get search results content from given IDs
	 *
	 * @return mixed
	 */
	public function getResultsContent()
	{
		$results = [];
		foreach (explode(',', $_GET['uids']) as $id) {
			$post = Timber::get_post($id);
			$context = Timber::context();
			$context['result'] = [
				'uid' => $post->ID,
				'title' => $post->post_title,
				'publishDate' => $post->post_date,
				'postType' => $post->post_type,
				'link' => get_permalink($post),
			];
			$results[] = [
				'uid' => absint($id),
				'content' => Timber::compile('partials/search/result.twig', $context),
			];
		}
		return $results;
	}
}
