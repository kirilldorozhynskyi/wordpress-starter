#!/usr/bin/env bash
set -euo pipefail

SSR_TARGET="/var/www/html/wp-content/themes/inertia/resources/Private/.vite/ssr/ssr.mjs"
SSR_ENABLED="${INERTIA_SSR_ENABLED:-1}"
SSR_PORT="${INERTIA_SSR_PORT:-13714}"

APACHE_PID=""
SSR_PID=""

cleanup() {
	if [[ -n "${APACHE_PID}" ]] && kill -0 "${APACHE_PID}" 2>/dev/null; then
		kill "${APACHE_PID}" 2>/dev/null || true
	fi

	if [[ -n "${SSR_PID}" ]] && kill -0 "${SSR_PID}" 2>/dev/null; then
		kill "${SSR_PID}" 2>/dev/null || true
	fi

	wait 2>/dev/null || true
}

trap cleanup INT TERM QUIT

if [[ "${SSR_ENABLED}" == "1" ]]; then
	if [[ ! -f "${SSR_TARGET}" ]]; then
		echo "SSR bundle not found at ${SSR_TARGET}" >&2
		exit 1
	fi

	echo "Starting Inertia SSR on port ${SSR_PORT}"
	PORT="${SSR_PORT}" NODE_ENV=production node "${SSR_TARGET}" &
	SSR_PID="$!"
else
	echo "Inertia SSR is disabled"
fi

echo "Starting Apache"
apache2-foreground &
APACHE_PID="$!"

if [[ -n "${SSR_PID}" ]]; then
	wait -n "${APACHE_PID}" "${SSR_PID}"
else
	wait "${APACHE_PID}"
fi

cleanup
