FROM node:20

WORKDIR /usr/app
COPY ./package*.json .
RUN yarn
COPY . .
RUN yarn build

CMD [ "npm", "start"]
