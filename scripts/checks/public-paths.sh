#!/bin/sh
set -eu

base=${1:?Pass the WordPress site base URL}
base=${base%/}

status() {
	curl --silent --show-error --max-time 15 --output /dev/null --write-out '%{http_code}' "$base$1"
}

for path in \
	/AGENTS.md /.env /.env.template /.git/config /.codegraph/codegraph.db /.wp-mcp/ \
	/.agents/skills/jd-wordpress-starter/SKILL.md /%2eenv.template \
	/composer.json /composer.lock /package.json /package-lock.json /codegraph.json \
	/vite.config.ts /Dockerfile /hot /wp-config.php /docker/dokploy.env.example \
	/vendor/composer/installed.json /server/apache/site.conf.example /server/nginx/site.conf.example /docs/dokploy.md /tests/frontend/forms.test.mjs \
	/wp-content/mu-plugins/jd-support/ /wp-content/mu-plugins/jd-support/jd-support.php \
	/wp-content/mu-plugins/jd-support/src/Services/AdminService.php \
	/wp-content/themes/inertia/app.php /wp-content/themes/inertia/acf-json/ \
	/wp-content/themes/inertia/resources/Private/js/main.ts \
	/wp-content/themes/inertia/resources/Private/.vite/ssr/ssr.mjs \
	/wp-content/themes/inertia/resources/Public/Build/manifest.json \
	/wp-content/themes/inertia/resources/Public/Build/assets/main.js.map \
	/wp-content/uploads/wordpress-private-test.php/anything; do
	code=$(status "$path")
	case "$code" in
		404) ;;
		*) printf >&2 '%s returned %s, expected 404\n' "$path" "$code"; exit 1 ;;
	esac
done

if ! curl --silent --show-error --max-time 15 "$base/AGENTS.md?rest_route=/" | grep -Eq '"component"[[:space:]]*:[[:space:]]*"Error"'; then
	printf >&2 'Private paths must render the WordPress Error page.\n'
	exit 1
fi

for path in / /wp-content/themes/inertia/resources/Public/Images/logo.svg \
	/wp-content/mu-plugins/jd-support/images/jd_white.svg \
	/wp-content/mu-plugins/jd-support/assets/admin/environment-notice.css \
	/wp-content/mu-plugins/jd-support/assets/admin/environment-notice.js; do
	code=$(status "$path")
	case "$code" in
		200) ;;
		*) printf >&2 '%s returned %s, expected 200\n' "$path" "$code"; exit 1 ;;
	esac
done

printf 'Private paths are blocked and the page and required static assets are public.\n'
