<?php

/*

Úpravy pre Bitbucket:
1.	Kontrola vetvy: Keď Bitbucket pošle webhook, v jeho JSON odpovedi môžeš nájsť vetvu, do ktorej bol push. Tento skript kontroluje, či push prebieha do hlavnej vetvy (tu “main”, môže byť aj “master” alebo iná vetva, ktorú používaš).
2.	Overenie požiadavky: Bitbucket nevyžaduje rovnaký spôsob overovania ako GitHub. Skript len skontroluje, či požiadavka je POST, obsahuje správnu vetvu, a potom spustí git pull.
3.	Logovanie: Výstup z príkazu git pull sa voliteľne zapisuje do log súboru, aby si mal prehľad o nasadeniach.
4.	Jednoduché nasadenie: Ak všetko prebehne správne, skript vráti odpoveď “Deployed successfully”.

Nastavenie Webhooku na Bitbucket:
1.	Prejdi do Settings svojho Bitbucket repozitára.
2.	Klikni na Webhooks a pridaj nový webhook.
3.	Nastav URL na cestu k tvojmu PHP skriptu (https://yourdomain.com/git-deploy.php).
4.	Zvoľ si eventy, napríklad “Push”, a ulož.

*/

// require_once dirname( __FILE__ ) . '/wp-config.php';

run();

function run()
{
	if ($_ENV['DEPLOY_ENABLED'] == false) {
		die('Deploy Forbidden');
	}

	$projectDir = dirname(__FILE__);
	$branch = $_ENV['DEPLOY_BRANCH'];

	if (isset($_SERVER['REQUEST_METHOD']) && $_SERVER['REQUEST_METHOD'] !== 'POST') {
		http_response_code(405);
		die('Method Not Allowed');
		exit();
	}

	$payload = file_get_contents('php://input');
	$data = json_decode($payload, true);

	if (!isset($data['push']['changes'][0]['new']['name']) || $data['push']['changes'][0]['new']['name'] !== $branch) {
		save_log('Not the correct branch ' . $branch . '', 0);
		http_response_code(400);
		die('Not the correct branch ' . $branch);
		exit();
	}

	$output = [];
	exec("cd {$projectDir} && git pull origin {$branch} 2>&1", $output, $exitCode);
	$output = implode("\n", $output);

	if ($exitCode !== 0) {
		save_log("Git pull error:\n" . $output, 0);
		http_response_code(500);
		die('Deployment failed. See logs for details.');
	} else {
		save_log("Deployed successfully:\n" . $output, 1);
		echo 'Deployed successfully';
	}
}

function save_log($message = '', $status = 0)
{
	$logFile = dirname(__FILE__) . '/wp-content/deploy.log';
	$date = date('Y-m-d H:i:s');
	file_put_contents($logFile, $date . ' - ' . str_replace('<br>', '\n\n', $message), FILE_APPEND);
}
