# syntax=docker/dockerfile:1.7
FROM node:24-bookworm-slim AS node_runtime
FROM php:8.5-apache-bookworm AS php_base

COPY --from=ghcr.io/mlocati/php-extension-installer:2 /usr/bin/install-php-extensions /usr/local/bin/
RUN install-php-extensions exif gd intl mysqli zip \
	&& a2enmod expires headers rewrite
COPY docker/php/custom.ini /usr/local/etc/php/conf.d/custom.ini
COPY docker/apache/override.conf /etc/apache2/conf-available/override.conf
RUN a2enconf override
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
RUN test -f wp-content/themes/inertia/resources/Public/Build/manifest.json \
	&& test -f wp-content/themes/inertia/resources/Private/.vite/ssr/ssr.mjs

FROM php_base AS runtime
COPY --from=node_runtime /usr/local/bin/node /usr/local/bin/node
COPY --from=dependencies --chown=www-data:www-data /var/www/html /var/www/html
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
