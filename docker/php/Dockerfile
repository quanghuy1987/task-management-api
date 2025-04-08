FROM php:8.3-fpm

WORKDIR /var/www/html

# Get latest Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

RUN apt-get update && apt-get install -y \
    git \
    nano \
    curl \
    libjpeg-dev \
    libfreetype6-dev \
    libjpeg62-turbo-dev \
    libmcrypt-dev \
    libgd-dev \
    jpegoptim optipng pngquant gifsicle \
    libonig-dev \
    libxml2-dev \
    zip \
    unzip \
    libmagickwand-dev

RUN pecl install xdebug-3.3.0 \
    && docker-php-ext-enable xdebug
RUN pecl install redis && docker-php-ext-enable redis 
RUN docker-php-ext-install ftp && docker-php-ext-enable ftp

RUN apt-get install -y \
        libzip-dev \
        default-mysql-client \
        redis-tools \
        && docker-php-ext-install zip \
        && docker-php-ext-configure intl \
        && docker-php-ext-install intl
        
RUN git clone https://github.com/Imagick/imagick.git --depth 1 /tmp/imagick && \
    cd /tmp/imagick && \
    git fetch origin master && \
    git checkout master && \
    cd /tmp/imagick && \
    phpize && \
    ./configure && \
    make && \
    make install && \
    rm -fr /tmp/imagick && \
    docker-php-ext-enable imagick 

# Clear cache
RUN apt-get clean && rm -rf /var/lib/apt/lists/*

# Install PHP extensions
RUN docker-php-ext-configure gd --enable-gd --with-freetype --with-jpeg
RUN docker-php-ext-install -j$(nproc) mysqli pdo_mysql mbstring exif pcntl bcmath gd

RUN touch /var/log/xdebug.log && chmod 666 /var/log/xdebug.log
