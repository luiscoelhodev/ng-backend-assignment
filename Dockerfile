FROM node:18-alpine

WORKDIR /usr/app

COPY . .

RUN npm install

RUN npm run build

EXPOSE 3000

CMD ["npm", "run", "start:docker"]