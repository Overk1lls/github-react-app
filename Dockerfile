FROM node:16 as Production

WORKDIR /usr/src/github-react-app

COPY package*.json ./

RUN npm ci --only=production

COPY . .

CMD [ "node", "./build/src/index.js" ]