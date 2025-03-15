
<?php
$globals = new \JDEV\Globals();
$language = $globals->getSiteLanguage();
$seo = $globals->getSeoData();
?>

<!DOCTYPE html>
<html lang="<?php echo $language; ?>">

<head>
    <meta charset="UTF-8">
	<meta name="viewport" content="width=device-width,initial-scale=1, shrink-to-fit=no" />
	<title inertia><?php echo $seo['title']; ?></title>
	<meta inertia name="description" content="<?php echo $seo['description']; ?>" />
	<meta name="author" content="justDev">

    <?php wp_head(); ?>

	<meta name="theme-color" content="<?php get_fields('options')['general_theme_color'] ? get_fields('options')['general_theme_color'] : ''; ?>" />
	<link rel="icon" type="image/png" href="<?php echo get_template_directory_uri(); ?>/resources/Public/Favicons/favicon-96x96.png" sizes="96x96" />
	<link rel="icon" type="image/svg+xml" href="<?php echo get_template_directory_uri(); ?>/resources/Public/Favicons/favicon.svg" />
	<link rel="shortcut icon" href="<?php echo get_template_directory_uri(); ?>/resources/Public/Favicons/favicon.ico" />
	<link rel="apple-touch-icon" sizes="180x180" href="<?php echo get_template_directory_uri(); ?>/resources/Public/Favicons/apple-touch-icon.png" />
	<meta name="apple-mobile-web-app-title" content="Compasspool" />
	<link rel="manifest" href="<?php echo get_template_directory_uri(); ?>/resources/Public/Favicons/site.webmanifest" />
</head>

<body>
    <?php
    bb_inject_inertia();
    wp_footer();
    ?>
</body>

</html>

