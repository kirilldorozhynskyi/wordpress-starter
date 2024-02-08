<?php
namespace JDEV\Model;

use JDEV\RestRoute;
use JDEV\Controller\SearchController;

/**
 * Class Search
 *
 * @package JDEV
 */
class Search
{
	public function __construct()
	{
		add_action('template_redirect', [$this, 'redirectSearchPage']);

		RestRoute::post('get-search-results', [new SearchController(), 'getResults']);
		RestRoute::get('get-search-results-content', [new SearchController(), 'getResultsContent']);
	}

	/**
	 * Redirect default search results page to custom one
	 */
	public function redirectSearchPage()
	{
		if (is_search()) {
			if (array_key_exists('SEARCH', PAGES) && get_post_status(PAGES['SEARCH']) == 'publish') {
				session_start();
				$_SESSION['query'] = get_search_query();
				wp_safe_redirect(get_permalink(PAGES['SEARCH']));
			} else {
				wp_safe_redirect(home_url());
			}
			exit();
		}
	}
}
