<?php

// WP Vite requires a local loader, but all its dependencies are already managed
// by the root Composer lockfile. Avoid a second, stale dependency graph.
$directory = dirname(__DIR__) . '/wp-content/plugins/wp-vite/vendor';
if (!is_dir(dirname($directory))) {
	throw new RuntimeException('Install the Composer-managed WP Vite plugin first.');
}
if (!is_dir($directory) && !mkdir($directory, 0755, true)) {
	throw new RuntimeException('Cannot create WP Vite autoload directory.');
}
$loader = <<<'PHP'
<?php
return require dirname(__DIR__, 4) . '/vendor/autoload.php';

PHP;
if (file_put_contents($directory . '/autoload.php', $loader) === false) {
	throw new RuntimeException('Cannot write WP Vite autoload bridge.');
}
