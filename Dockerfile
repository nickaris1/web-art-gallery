FROM node:16

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install
COPY . .
EXPOSE 8080
RUN npm install -g nodemon
CMD [ "npm", "start" ]


