FROM node:16.14 AS BUILD-STAGE

WORKDIR /usr/src/app

COPY --chown=node:node . .

RUN mkdir /usr/src/public/
RUN mkdir /usr/src/public/images/
RUN mkdir /usr/src/public/files/

COPY docker/backend_setup.sh /entrypoint.sh
RUN chmod 0755 /entrypoint.sh
ENTRYPOINT ["/entrypoint.sh"]

ENV MYSQL_URI="mysql://admin:abc123@localhost:3306/taller"
ENV PORT="8080"
ENV TEST_MYSQL_URI="mysql://admin:abc123@localhost:3306/testing"
ENV SECRET="millavesupersecretasecretisima"
ENV AZURE_STORAGE_CONNECTION_STRING="DefaultEndpointsProtocol=http;AccountName=devstoreaccount1;AccountKey=Eby8vdM02xNOcqFlqUwJPLlmEtlCDXJ1OUzFT50uSRZ6IFsuFq2UVErCz4I6tq/K1SZFPTOtr/KBHBeksoGMGw==;BlobEndpoint=http://localhost:10000/devstoreaccount1;QueueEndpoint=http://localhost:10001/devstoreaccount1;"
ENV REDIS_HOST="localhost"

RUN npm ci

#build the project
RUN npm run build

USER node

CMD npm start


