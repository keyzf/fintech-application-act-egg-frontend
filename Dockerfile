FROM hub-devops.cgws.com/richarvey/nginx-php-fpm:1.5.3

RUN rm -rf /var/www/html/*
COPY ./dist/ /var/www/html/
RUN mkdir -p /var/www/html/act/fintech-application-act-egg/
COPY ./dist/ /var/www/html/act/fintech-application-act-egg/
RUN chmod -R 777 /var/www/html/ 
RUN rm -rf /var/www/html/composer.lock 
COPY ./docker/default.conf /etc/nginx/sites-enabled/

CMD  /start.sh
