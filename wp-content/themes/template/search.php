<?php

/**
 * Search page template
 * Template name: Search page template
 */

use Timber\Timber;

session_start();
$context = Timber::context();
$context['page'] = Timber::get_post();
$context['searchQuery'] = get_search_query() ?: $_SESSION['query'] ?? '';

Timber::render('templates/search.twig', $context);
