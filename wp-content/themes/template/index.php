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
	// Woocommerce Single Product
	case class_exists('WooCommerce') && is_singular('product'):
		$context['page'] = $post;
		$product = wc_get_product($context['post']->ID);
		$context['product'] = $product;
		$context['preFooter'] = true;

		// Get related products
		$related_limit = wc_get_loop_prop('columns');
		$related_ids = wc_get_related_products($context['post']->id, $related_limit);
		$context['related_products'] = Timber::get_posts($related_ids);

		// Restore the context and loop back to the main query loop.
		wp_reset_postdata();
		$template = 'woo/single-product';
		break;

	case class_exists('WooCommerce') && is_shop():
		$context['preFooter'] = true;
		$template = 'woo/archive';

		break;

	// case is_product_category():
	// 	// $context['products'] = Timber::get_posts();

	// 	// $args = [
	// 	// 	'limit' => 1,
	// 	// 	'page' => 1,
	// 	// ];

	// 	// $products = wc_get_products($arg);

	// 	$args = [
	// 		'paginate' => true,
	// 	];

	// 	$results = wc_get_products($args);
	// 	// echo $results->total . ' products found\n';
	// 	// echo 'Page 1 of ' . $results->max_num_pages . '\n';
	// 	// echo 'First product id is: ' . $results->products[0]->get_id() . '\n';
	// 	$context['woo'] = $results;

	// 	$template = 'woo/archive';
	// 	break;

	// case class_exists('WooCommerce') && is_account_page():
	// 	$context['page'] = $post;
	// 	$template = 'woo/account';
	// 	$context['preFooter'] = true;
	// 	break;

	// case class_exists('WooCommerce') && is_cart():
	// 	$context['page'] = $post;
	// 	$template = 'woo/cart';
	// 	$context['preFooter'] = true;
	// 	break;

	// case class_exists('WooCommerce') && is_checkout():
	// 	$context['page'] = $post;
	// 	$template = 'woo/checkout';
	// 	$context['preFooter'] = true;
	// 	break;
	// // End Woocommerce Single Product

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
		$template = 'page';
		break;
}

Timber::render(['templates/' . $template . '.twig', 'templates/page.twig'], $context);
