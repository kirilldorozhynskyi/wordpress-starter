
<?php
$yoast_meta = YoastSEO()->meta->for_current_page();

$ogtitle = $yoast_meta->open_graph_title;
$description = !empty($yoast_meta->open_graph_description)
	? $yoast_meta->open_graph_description
	: (get_bloginfo('description') ?:
	wp_trim_words(get_the_excerpt(), 20));
$base = new \JDEV\Base();

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

