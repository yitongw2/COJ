FROM nginx
MAINTAINER Yitong Wu

COPY nginx.conf /etc/nginx/nginx.conf

RUN cat /etc/nginx/nginx.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
