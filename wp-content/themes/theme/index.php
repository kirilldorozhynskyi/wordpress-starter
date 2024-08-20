<?php

use Timber\Timber;
use BoxyBird\Inertia\Inertia;

if (is_front_page()) {
	return Inertia::render('Index', [
		'page' => Timber::get_post(),
		'fields' => get_fields(),
	]);

	$context['page'] = Timber::get_post();
	$template = 'page';

	Timber::render(['templates/' . $template . '.twig', 'templates/page.twig'], $context);
}

// if (is_front_page()) {
// 	return Inertia::render('Index', [
// 		'page' => $page,
// 		'yoast' => [
// 			'title' => ($ogtitle = YoastSEO()->meta->for_current_page()->open_graph_title),
// 			'description' => ($odescription = YoastSEO()->meta->for_current_page()->open_graph_description),
// 		],
// 		'content' => getAcfContent(),
// 	]);
// }

// if (is_single()) {
// 	return Inertia::render('Single', [
// 		'content' => getAcfContent(),
// 		'page' => $page,
// 		'yoast' => [
// 			'title' => ($ogtitle = YoastSEO()->meta->for_current_page()->open_graph_title),
// 			'description' => ($odescription = YoastSEO()->meta->for_current_page()->open_graph_description),
// 		],
// 	]);
// }

// if (is_page()) {
// 	return Inertia::render('Page', [
// 		'content' => getAcfContent(),
// 		'page' => $page,
// 		'yoast' => [
// 			'title' => ($ogtitle = YoastSEO()->meta->for_current_page()->open_graph_title),
// 			'description' => ($odescription = YoastSEO()->meta->for_current_page()->open_graph_description),
// 		],
// 	]);
// }

// if (is_404()) {
// 	return Inertia::render('404', [
// 		'content' => '404 - Not Found',
// 		'page' => $page,
// 		'yoast' => [
// 			'title' => ($ogtitle = YoastSEO()->meta->for_current_page()->open_graph_title),
// 			'description' => ($odescription = YoastSEO()->meta->for_current_page()->open_graph_description),
// 		],
// 	]);
// }
