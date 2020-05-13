FROM node:12-stretch as builder

RUN mkdir -p /app
WORKDIR /app
COPY . /app
RUN npm install && npm run build

EXPOSE 8000

ENTRYPOINT [ "bash", "entrypoint.sh"]