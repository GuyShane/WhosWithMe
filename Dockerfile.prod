FROM node:12-alpine as builder

RUN apk --no-cache add python make g++
COPY package*.json ./
RUN npm install
COPY gulpfile.js ./
RUN npm run build

FROM node:12-alpine

WORKDIR /usr/src/app

COPY --from=builder node_modules node_modules
COPY . .

EXPOSE 3000

CMD ["npm", "start"]
