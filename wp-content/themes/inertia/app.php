<?php
$globals = new \InertiaTheme\Globals();
$language = $globals->getSiteLanguage();
$seo = $globals->getSeoData();
?>

<!DOCTYPE html>
<html lang="<?php echo esc_attr($language); ?>">

<head>
	<meta charset="UTF-8">
	<meta name="viewport" content="width=device-width,initial-scale=1, shrink-to-fit=no" />
	<title inertia><?php echo esc_html($seo['title']); ?></title>
	<meta inertia name="description" content="<?php echo esc_attr($seo['description']); ?>" />
	<meta name="author" content="justDev">

    <?php inertia_head(); ?>
</head>

<body><?php
ob_start();
inertia_body();
echo trim(ob_get_clean());
?></body>

</html>
