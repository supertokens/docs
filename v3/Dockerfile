FROM node:18-alpine

WORKDIR /app

COPY package*.json ./

RUN npm ci 

COPY . .

RUN npm run build

EXPOSE 80

CMD ["npm", "run", "serve", "--", "--build", "--port", "80", "--host", "0.0.0.0"]

