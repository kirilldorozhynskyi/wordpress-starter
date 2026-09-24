<?php

$context = stream_context_create(['http' => ['timeout' => 2]]);
if (trim((string) @file_get_contents('http://127.0.0.1/healthz', false, $context)) !== 'ok') {
	exit(1);
}
if ((getenv('INERTIA_SSR_ENABLED') === false ? '1' : getenv('INERTIA_SSR_ENABLED')) === '1') {
	$port = (int) (getenv('INERTIA_SSR_PORT') ?: 13714);
	$health = json_decode((string) @file_get_contents("http://127.0.0.1:{$port}/health", false, $context), true);
	if (($health['status'] ?? null) !== 'OK') {
		exit(1);
	}
}
