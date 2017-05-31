FROM silintl/php-web:latest
MAINTAINER Chris Hubbard <chris_hubbard@sil.org>

ENV REFRESHED_AT 2017-05-24

COPY dockerbuild/vhost.conf /etc/apache2/sites-enabled/

RUN mkdir -p /data

COPY . /data/

WORKDIR /data
RUN chown -R www-data:www-data /data

EXPOSE 80
CMD ["apache2ctl", "-D", "FOREGROUND"]
