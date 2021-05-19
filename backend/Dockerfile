FROM node:alpine
LABEL author="webchitect1@gmail.com"
WORKDIR /usr/src/app
RUN npm install pm2 -g
COPY ./package.json ./package.json
RUN yarn install --production
COPY ./dist ./dist
CMD ["pm2-runtime", "./dist/main.js"]