FROM php:8.3-fpm

# Устанавливаем системные зависимости
RUN apt-get update && apt-get install -y \
    git \
    curl \
    libpng-dev \
    libonig-dev \
    libxml2-dev \
    zip \
    unzip \
    supervisor \
    libmagickwand-dev

# Очищаем кэш apt
RUN apt-get clean && rm -rf /var/lib/apt/lists/*

# Устанавливаем расширения PHP
RUN docker-php-ext-install pdo_mysql mbstring exif pcntl bcmath gd

# Устанавливаем composer
RUN curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer

# Устанавливаем Redis
RUN pecl install redis && docker-php-ext-enable redis

# Устанавливаем Imagick
RUN pecl install imagick && docker-php-ext-enable imagick

WORKDIR /var/www/html

# Копируем исходный код приложения
COPY . /var/www/html

# Устанавливаем зависимости composer
RUN composer install

# Публикуем JWT конфигурацию
RUN php artisan vendor:publish --provider="PHPOpenSourceSaver\JWTAuth\Providers\LaravelServiceProvider"

# Копируем supervisor конфигурацию
COPY ./docker/supervisor/api.conf /etc/supervisor/conf.d/supervisord.conf

EXPOSE 8000
EXPOSE 9000

# Запуск supervisor, который будет управлять процессами
CMD ["supervisord", "-c", "/etc/supervisor/conf.d/supervisord.conf"]



#Если содавать базовый образ Dockerfile

#FROM tasty_php:latest
#WORKDIR /var/www/html
#COPY src /var/www/html
#RUN composer install
#RUN php artisan vendor:publish --provider="PHPOpenSourceSaver\JWTAuth\Providers\LaravelServiceProvider"
#COPY docker/supervisor/api.conf /etc/supervisor/conf.d/supervisord.conf
#EXPOSE 8000
#EXPOSE 9000
#CMD ["supervisord", "-c", "/etc/supervisor/conf.d/supervisord.conf"]
