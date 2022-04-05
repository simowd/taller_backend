FROM node:16.14 AS BUILD-STAGE

WORKDIR /usr/src/app

COPY --chown=node:node . .

#ENV somevar=var
RUN mkdir /usr/src/public/
RUN mkdir /usr/src/public/images/
RUN mkdir /usr/src/public/files/

COPY docker/backend_setup.sh /entrypoint.sh
RUN chmod 0755 /entrypoint.sh
ENTRYPOINT ["/entrypoint.sh"]

RUN npm install

USER node

CMD npm run dev


