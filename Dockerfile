FROM node:19
ENV NODE_OPTIONS --openssl-legacy-provider
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app
COPY package.json /usr/src/app
RUN npm install
COPY . /usr/src/app
EXPOSE 4200
CMD ["npm","start"]
