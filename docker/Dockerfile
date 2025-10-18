FROM php:8.2-fpm-alpine

RUN docker-php-ext-install pdo pdo_mysql mbstring exif pcntl bcmath gd xml zip

COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

WORKDIR /var/www/html

RUN chown -R www-data:www-data /var/www/html

USER www-data

EXPOSE 9000

CMD ["php-fpm"]