<?php
\InertiaTheme\InertiaRequest::sendPageHeaders();

$language = \InertiaTheme\Globals::getSiteLanguage();
remove_action('wp_head', 'rel_canonical');
?>

<!DOCTYPE html>
<html lang="<?php echo esc_attr($language); ?>">

<head>
	<meta charset="UTF-8">
	<meta name="viewport" content="width=device-width,initial-scale=1, shrink-to-fit=no" />
	<?php echo implode("\n\t", \InertiaTheme\Globals::getSeoHead()); ?>

    <?php inertia_head(); ?>
</head>

<body><?php
ob_start();
inertia_body();
echo trim(ob_get_clean());
?></body>

</html>
