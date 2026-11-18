<?php

// Keep Composer's installation intact so repeated installs remain reproducible.
$root = dirname(__DIR__);
$source = $root . '/vendor/wordpress-core';
if (!is_dir($source)) {
	fwrite(STDERR, "WordPress core is missing. Run composer reinstall roots/wordpress-no-content.\n");
	exit(1);
}

$files = new RecursiveIteratorIterator(new RecursiveDirectoryIterator($source, FilesystemIterator::SKIP_DOTS), RecursiveIteratorIterator::SELF_FIRST);
foreach ($files as $file) {
	$relative = substr($file->getPathname(), strlen($source) + 1);
	// Never replace site configuration or user-managed content.
	if ($relative === 'wp-config.php' || $relative === 'wp-content' || str_starts_with($relative, 'wp-content/')) {
		continue;
	}
	$destination = $root . '/' . $relative;
	if ($file->isDir()) {
		if (!is_dir($destination) && !mkdir($destination, 0755, true)) {
			throw new RuntimeException('Cannot create directory: ' . $destination);
		}
	} elseif (!copy($file->getPathname(), $destination)) {
		throw new RuntimeException('Cannot copy WordPress core file: ' . $relative);
	}
}

// Match WordPress's updater for retired files in the two core directories.
require $source . '/wp-admin/includes/update-core.php';
foreach ($_old_files as $relative) {
	if ((!str_starts_with($relative, 'wp-admin/') && !str_starts_with($relative, 'wp-includes/')) || file_exists($source . '/' . $relative)) {
		continue;
	}

	$destination = $root . '/' . $relative;
	if (!is_file($destination)) {
		continue;
	}

	$directory = realpath(dirname($destination));
	if ($directory === false || (!str_starts_with($directory . '/', $root . '/wp-admin/') && !str_starts_with($directory . '/', $root . '/wp-includes/'))) {
		continue;
	}

	if (!unlink($destination)) {
		throw new RuntimeException('Cannot remove obsolete WordPress core file: ' . $relative);
	}
}
