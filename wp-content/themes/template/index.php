<?php

use Timber\Timber;
use BoxyBird\Inertia\Inertia;

$yoast_meta = YoastSEO()->meta->for_current_page();
$ogtitle = $yoast_meta->open_graph_title;
$description = $yoast_meta->open_graph_description;

$seo = [
	'title' => $ogtitle,
	'description' => $description,
];

if (is_front_page()) {
	return Inertia::render('Index', [
		'fields' => get_fields(),
		'seo' => $seo,
	]);
}

if (is_single()) {
	return Inertia::render('Single', [
		'fields' => get_fields(),
		'seo' => $seo,
	]);
}

if (is_page()) {
	return Inertia::render('Page', ['seo' => $seo]);
}

if (is_404()) {
	return Inertia::render('404', ['seo' => $seo]);
}
