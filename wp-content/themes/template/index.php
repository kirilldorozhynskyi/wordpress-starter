<?php

/**
 * The main template file.
 * We use this file as a router for Twig's templating system.
 */

use Timber\Timber;
// use JDEV\Model\News;

$context = Timber::context();
$post = Timber::get_post();

switch (true) {
	case post_password_required():
		$context['page'] = $post;
		$template = 'password';
		break;

	// Front page
	case is_front_page():
		$context['page'] = $post;
		$template = 'home';
		break;

	// Classic pages
	case is_page():
		$context['page'] = $post;
		$template = 'page';
		break;

	// Archive pages
	case is_archive():
		$context['archive'] = Timber::get_term(get_queried_object());
		$template = 'archive';
		break;

	// // Post type News
	// case is_singular('news'):
	// 	$context = News::createContext($post);
	// 	$template = 'news';
	// 	break;

	// 404 - Page not found
	case is_404():
		$context['page'] = $post;
		$template = '404';
		break;

	// Default
	default:
		$context['page'] = $post;
		$template = 'default';
		break;
}

Timber::render(['templates/' . $template . '.twig', 'templates/default.twig'], $context);
