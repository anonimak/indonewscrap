FROM node:alpine

WORKDIR /app

COPY package.json /app

RUN npm install

COPY .env.example .env

COPY . /app

CMD ["npm", "run", "dev"]

EXPOSE 8000