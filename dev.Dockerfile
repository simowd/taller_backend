FROM node:16.14 AS BUILD-STAGE

WORKDIR /usr/src/app

COPY --chown=node:node . .

#ENV somevar=var

RUN npm install

USER node

CMD npm run dev


