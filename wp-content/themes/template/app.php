
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

</head>

<body>
    <?php
    bb_inject_inertia();
    wp_footer();
    ?>
</body>

</html>

