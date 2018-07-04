FROM node:9
MAINTAINER Yitong Wu

WORKDIR /app

RUN npm i npm@latest -g

COPY ./oj-client ./oj-client

RUN cd oj-client && npm install && npm audit fix && npm install -g @angular/cli@latest
RUN cd oj-client && ng build

COPY ./oj-server ./oj-server

RUN cd oj-server && npm install && npm audit fix

CMD cd oj-server && npm start
