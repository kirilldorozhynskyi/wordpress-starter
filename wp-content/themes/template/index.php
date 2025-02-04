<?php

use BoxyBird\Inertia\Inertia;

if (is_front_page()) {
	return Inertia::render('Index', []);
}

if (is_single()) {
	return Inertia::render('Single', []);
}

if (is_page()) {
	return Inertia::render('Page', []);
}

if (is_404()) {
	return Inertia::render('404', []);
}
