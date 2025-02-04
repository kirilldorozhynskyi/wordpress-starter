
<?php
if (function_exists('WPSEO_FILE')) {
	var_dump(function_exists('WPSEO_FILE'));
	$yoast_meta = YoastSEO()->meta->for_current_page();
	$ogtitle = $yoast_meta->open_graph_title;
	$description = $yoast_meta->open_graph_description;
} else {
	$ogtitle = get_the_title();
	$description = get_bloginfo('description');
}
$base = new \JDEV\Base();

use JDEV\Vite;

// Call the method through the instance
$language = $base->getSiteLanguage();
?>

<!DOCTYPE html>
<html lang="<?php echo $language; ?>">

<head>
    <meta charset="UTF-8">
	<meta name="viewport" content="width=device-width,initial-scale=1, shrink-to-fit=no" />
	<title inertia><?php echo $ogtitle; ?></title>
	<meta inertia name="description" content="<?php echo $description; ?>" />
	<meta name="author" content="justDev">

    <?php wp_head(); ?>

</head>

<body>
    <?php
    bb_inject_inertia();
    wp_footer();
    ?>
</body>

</html>

