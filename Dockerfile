FROM node:12-stretch AS builder
RUN npm install webpack -g
WORKDIR /app
ADD package.json package-lock.json /app/
RUN npm install
COPY . ./
RUN npm rebuild node-sass
RUN ./node_modules/.bin/webpack --mode production
EXPOSE 9000
CMD [ "bash", "entrypoint.sh"]
