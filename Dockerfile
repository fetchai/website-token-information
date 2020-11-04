FROM node:12-stretch
RUN npm install webpack -g
WORKDIR /app
COPY . ./
RUN npm install
RUN npm rebuild node-sass

EXPOSE 8000

CMD [ "bash", "entrypoint.sh"]