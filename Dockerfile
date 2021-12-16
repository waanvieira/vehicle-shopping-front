# build environment
FROM node:12-alpine
WORKDIR /app
ENV PATH /app/node_modules/.bin:$PATH
COPY package.json /app/package.json
RUN npm install
RUN npm install react-scripts@3.0.1 -g
RUN npm update
COPY . /app
RUN npm run build
EXPOSE 3000
