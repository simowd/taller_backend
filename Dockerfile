FROM node:16.14 AS BUILD-STAGE

WORKDIR /usr/src/app

COPY --chown=node:node . .

#ENV somevar=var

RUN npm ci

#build the project
RUN npm run tsc

USER node

CMD npm start


