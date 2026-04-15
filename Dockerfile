FROM node:20-bookworm-slim AS node_runtime

FROM php:8.2-apache-bookworm

# Runtime-only image:
# - frontend assets are built locally and committed to git
# - SSR bundle is built locally and committed to git
# - Composer dependencies are installed before docker build

COPY --from=node_runtime /usr/local/ /usr/local/

RUN apt-get update \
	&& apt-get install -y --no-install-recommends \
		bash \
		libfreetype6-dev \
		libicu-dev \
		libjpeg62-turbo-dev \
		libpng-dev \
		libwebp-dev \
		libzip-dev \
		unzip \
	&& docker-php-ext-configure gd --with-freetype --with-jpeg --with-webp \
	&& docker-php-ext-install -j"$(nproc)" \
		exif \
		gd \
		intl \
		mysqli \
		opcache \
		zip \
	&& a2enmod expires headers rewrite \
	&& rm -rf /var/lib/apt/lists/*

RUN { \
		echo 'memory_limit=256M'; \
		echo 'upload_max_filesize=64M'; \
		echo 'post_max_size=64M'; \
		echo 'max_execution_time=120'; \
		echo 'opcache.enable=1'; \
		echo 'opcache.enable_cli=1'; \
		echo 'opcache.validate_timestamps=0'; \
		echo 'opcache.memory_consumption=192'; \
		echo 'opcache.max_accelerated_files=20000'; \
	} > /usr/local/etc/php/conf.d/runtime.ini

WORKDIR /var/www/html

COPY . /var/www/html
COPY docker/entrypoint.sh /usr/local/bin/container-entrypoint

RUN chmod +x /usr/local/bin/container-entrypoint

RUN test -f /var/www/html/vendor/autoload.php \
	|| (echo 'vendor/ is missing. Install Composer dependencies before docker build.' >&2 && exit 1)

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
