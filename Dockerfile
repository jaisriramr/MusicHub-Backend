FROM node:18.17.1-alpine3.17
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install 
COPY . .
RUN npm run build
CMD ["node", "dist/main.js"]