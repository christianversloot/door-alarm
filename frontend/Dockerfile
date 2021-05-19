FROM node:alpine
LABEL author="webchitect1@gmail.com"
WORKDIR /usr/src/app
RUN npm install http-server -g
COPY ./dist ./dist
CMD ["http-server", "-c-1", "dist/frontend/."]