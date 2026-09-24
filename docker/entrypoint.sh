#!/usr/bin/env bash
set -euo pipefail

SSR_TARGET="/var/www/html/wp-content/themes/inertia/resources/Private/.vite/ssr/ssr.mjs"
SSR_ENABLED="${INERTIA_SSR_ENABLED:-1}"
SSR_PORT="${INERTIA_SSR_PORT:-13714}"
APACHE_PID=""
SSR_PID=""

cleanup() {
	for child in "${APACHE_PID}" "${SSR_PID}"; do
		if [[ -n "${child}" ]] && kill -0 "${child}" 2>/dev/null; then
			kill "${child}" 2>/dev/null || true
		fi
	done
	wait 2>/dev/null || true
}
trap cleanup EXIT
trap 'exit 0' INT TERM QUIT

# Named volumes may be empty on the first deployment.
mkdir -p /var/www/html/wp-content/uploads
chown www-data:www-data /var/www/html/wp-content/uploads

if [[ "${SSR_ENABLED}" == "1" ]]; then
	[[ -f "${SSR_TARGET}" ]] || { echo "SSR bundle not found: ${SSR_TARGET}" >&2; exit 1; }
	echo "Starting Inertia SSR on internal port ${SSR_PORT}"
	PORT="${SSR_PORT}" NODE_ENV=production node "${SSR_TARGET}" &
	SSR_PID="$!"
fi

echo "Starting Apache"
apache2-foreground &
APACHE_PID="$!"

status=0
if [[ -n "${SSR_PID}" ]]; then
	wait -n "${APACHE_PID}" "${SSR_PID}" || status=$?
else
	wait "${APACHE_PID}" || status=$?
fi
# If either service dies, stop its sibling and let the container restart policy recover both.
echo "Service exited (status ${status}); stopping container." >&2
exit 1
