<?php
$globals = new \JDEV\Globals();
$language = $globals->getSiteLanguage();
$seo = $globals->getSeoData();
?>

<!DOCTYPE html>
<html lang="<?php echo $language; ?>">

<head>
	<title inertia><?php echo $seo['title']; ?></title>
	<meta inertia name="description" content="<?php echo $seo['description']; ?>" />
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
	<meta name="author" content="justDev">

    <?php inertia_head(); ?>
</head>

<body>
    <?php inertia_body(); ?>
</body>

</html>
