# FROM silintl/php-web:latest
# MAINTAINER Chris Hubbard <chris_hubbard@sil.org>

# ENV REFRESHED_AT 2017-05-24

# COPY dockerbuild/vhost.conf /etc/apache2/sites-enabled/

# RUN mkdir -p /data

# COPY . /data/

# WORKDIR /data
# RUN chown -R www-data:www-data /data

# EXPOSE 80
# CMD ["apache2ctl", "-D", "FOREGROUND"]

FROM php:7.4-apache
RUN a2enmod rewrite

RUN sed -ri -e 's!DirectoryIndex index.php index.html!DirectoryIndex index.md index.php index.html!g' -e 's!</FilesMatch>!</FilesMatch>\n\n<FilesMatch \\.md$>\n\tSetHandler text/html\n</FilesMatch>!g' /etc/apache2/conf-available/docker-php.conf
