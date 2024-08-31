<?php

use Timber\Timber;
use BoxyBird\Inertia\Inertia;

if (function_exists('WPSEO_FILE')) {
	var_dump(function_exists('WPSEO_FILE'));
	$yoast_meta = YoastSEO()->meta->for_current_page();
	$ogtitle = $yoast_meta->open_graph_title;
	$description = $yoast_meta->open_graph_description;
} else {
	$ogtitle = get_the_title();
	$description = get_bloginfo('description');
}

if (is_front_page()) {
	return Inertia::render('Index', [
		'fields' => get_fields(),
		'seo' => [
			'title' => $ogtitle,
			'description' => $description,
		],
	]);
}

if (is_single()) {
	return Inertia::render('Single', [
		'fields' => get_fields(),
		'seo' => [
			'title' => $ogtitle,
			'description' => $description,
		],
	]);
}

if (is_page()) {
	return Inertia::render('Page', [
		'seo' => [
			'title' => $ogtitle,
			'description' => $description,
		],
	]);
}

if (is_404()) {
	return Inertia::render('404', [
		'content' => '404 - Not Found',
		'seo' => [
			'title' => $ogtitle,
			'description' => $description,
		],
	]);
}
