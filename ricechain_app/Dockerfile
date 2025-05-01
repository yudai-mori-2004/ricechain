FROM node:20.18.0

WORKDIR /app

ENV NEXT_TURBO=0

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 3000

CMD ["npm", "run", "dev"]
