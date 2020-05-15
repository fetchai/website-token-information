FROM node:12-stretch

RUN mkdir -p /app
WORKDIR /app

COPY . ./

RUN npm install
RUN npm rebuild node-sass

RUN apt-get update && apt-get install -y vim net-tools
# RUN npm install && npm run build

EXPOSE 8000

CMD [ "bash", "entrypoint.sh"]