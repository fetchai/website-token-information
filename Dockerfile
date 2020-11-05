FROM node:12-stretch
RUN npm install webpack -g
WORKDIR /app
ADD package.json package-lock.json /app/
RUN npm install
COPY . ./
RUN npm rebuild node-sass

EXPOSE 9000

CMD [ "bash", "entrypoint.sh"]