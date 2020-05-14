FROM node:12-stretch as builder

RUN mkdir -p /app
WORKDIR /app

COPY package*.json ./

# RUN npm install
RUN npm ci --only=production

COPY . /app

RUN npm install

# RUN npm install && npm run build

EXPOSE 8000

CMD [ "bash", "entrypoint.sh"]