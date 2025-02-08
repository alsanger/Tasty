# Используем PHP с Apache
FROM php:8.2-apache

# Устанавливаем необходимые зависимости
RUN apt-get update && apt-get install -y \
    libpq-dev \
    libzip-dev \
    zip \
    unzip \
    git && \
    docker-php-ext-install pdo pdo_mysql

# Устанавливаем Composer
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

# Устанавливаем зависимости Laravel
WORKDIR /var/www/html
COPY auth-service /var/www/html
RUN composer install --no-dev --optimize-autoloader

# Настраиваем права доступа
RUN chown -R www-data:www-data /var/www/html \
    && a2enmod rewrite

# Указываем порт
EXPOSE 80
