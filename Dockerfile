FROM node:24-bookworm-slim AS node_runtime

FROM php:8.5-apache-bookworm

# Runtime-only image:
# - frontend assets are built locally and committed to git
# - SSR bundle is built locally and committed to git
# - Composer dependencies are installed before docker build

COPY --from=node_runtime /usr/local/ /usr/local/

ADD https://github.com/mlocati/docker-php-extension-installer/releases/latest/download/install-php-extensions /usr/local/bin/

RUN chmod +x /usr/local/bin/install-php-extensions \
	&& install-php-extensions \
		exif \
		gd \
		intl \
		mysqli \
		opcache \
		zip \
	&& apt-get update && apt-get install -y --no-install-recommends bash unzip \
	&& a2enmod expires headers rewrite \
	&& rm -rf /var/lib/apt/lists/*

COPY docker/php/custom.ini /usr/local/etc/php/conf.d/custom.ini
COPY docker/apache/override.conf /etc/apache2/conf-available/override.conf

RUN a2enconf override

WORKDIR /var/www/html

COPY . /var/www/html
COPY docker/entrypoint.sh /usr/local/bin/container-entrypoint

RUN chmod +x /usr/local/bin/container-entrypoint

COPY --from=composer:latest /usr/bin/composer /usr/local/bin/composer

RUN apt-get update && apt-get install -y --no-install-recommends git unzip \
	&& git config --global url."https://github.com/".insteadOf git@github.com: \
	&& rm -rf /var/lib/apt/lists/*

RUN --mount=type=secret,id=composer_auth \
	COMPOSER_AUTH="$(cat /run/secrets/composer_auth)" \
	composer install --no-interaction --no-dev --optimize-autoloader

RUN test -f /var/www/html/wp-content/themes/inertia/resources/Public/Build/manifest.json \
	|| (echo 'Frontend build is missing. Run the local FE build and commit the generated assets before docker build.' >&2 && exit 1)

RUN test -f /var/www/html/wp-content/themes/inertia/resources/Private/.vite/ssr/ssr.mjs \
	|| (echo 'SSR build is missing. Run the local SSR build and commit the generated ssr.mjs before docker build.' >&2 && exit 1)

RUN mkdir -p \
		/var/www/html/wp-content/uploads \
		/var/www/html/wp-content/cache \
		/var/www/html/wp-content/upgrade \
	&& chown -R www-data:www-data /var/www/html

VOLUME ["/var/www/html/wp-content/uploads"]

EXPOSE 80 13714

ENTRYPOINT ["/usr/local/bin/container-entrypoint"]
