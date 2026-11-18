# syntax=docker/dockerfile:1.7
FROM node:26-bookworm-slim AS node_runtime

FROM node_runtime AS frontend
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY config.ts tsconfig.json vite.config.ts ./
COPY wp-content/themes/inertia/ wp-content/themes/inertia/
ARG VITE_CDN_BASE=""
RUN --mount=type=secret,id=primeui_license \
	if [ -f /run/secrets/primeui_license ]; then \
		export VITE_PRIMEUI_LICENSE="$(cat /run/secrets/primeui_license)"; \
	fi \
	&& npm run build

FROM php:8.5-apache-bookworm AS php_base

COPY --from=ghcr.io/mlocati/php-extension-installer:2 /usr/bin/install-php-extensions /usr/local/bin/
RUN install-php-extensions exif gd intl mysqli zip \
	&& a2enmod expires headers rewrite
COPY docker/php/custom.ini /usr/local/etc/php/conf.d/custom.ini
COPY docker/apache/override.conf server/apache/private-paths.conf /etc/apache2/conf-available/
RUN a2enconf override private-paths
WORKDIR /var/www/html

# Build credentials remain in this stage and are never copied to the runtime image.
FROM php_base AS dependencies
COPY --from=composer:2 /usr/bin/composer /usr/local/bin/composer
ENV COMPOSER_ALLOW_SUPERUSER=1
RUN apt-get update && apt-get install -y --no-install-recommends git unzip \
	&& git config --global url."https://github.com/".insteadOf git@github.com: \
	&& rm -rf /var/lib/apt/lists/*
COPY . .
RUN --mount=type=secret,id=composer_auth,required=true \
	export COMPOSER_AUTH="$(cat /run/secrets/composer_auth)" \
	&& composer install --no-interaction --no-dev --optimize-autoloader --no-scripts \
	&& php scripts/sync-wordpress-core.php \
	&& php scripts/prepare-wp-vite.php
FROM php_base AS runtime
RUN apt-get update && apt-get install -y --no-install-recommends libatomic1 \
	&& rm -rf /var/lib/apt/lists/*
COPY --from=node_runtime /usr/local/bin/node /usr/local/bin/node
COPY --from=dependencies --chown=www-data:www-data /var/www/html /var/www/html
COPY --from=frontend --chown=www-data:www-data /app/wp-content/themes/inertia/resources/Public/Build/ wp-content/themes/inertia/resources/Public/Build/
COPY --from=frontend --chown=www-data:www-data /app/wp-content/themes/inertia/resources/Private/.vite/ssr/ wp-content/themes/inertia/resources/Private/.vite/ssr/
COPY docker/entrypoint.sh /usr/local/bin/container-entrypoint
COPY docker/healthcheck.php /usr/local/bin/wordpress-healthcheck
RUN chmod +x /usr/local/bin/container-entrypoint \
	&& mkdir -p wp-content/uploads wp-content/cache wp-content/upgrade \
		wp-content/themes/inertia/.inertia \
	&& chown -R www-data:www-data wp-content
ENV WP_ENV=production INERTIA_SSR_ENABLED=1 INERTIA_SSR_PORT=13714
STOPSIGNAL SIGTERM
EXPOSE 80
HEALTHCHECK --interval=30s --timeout=5s --start-period=30s --retries=3 CMD ["php", "/usr/local/bin/wordpress-healthcheck"]
ENTRYPOINT ["/usr/local/bin/container-entrypoint"]
