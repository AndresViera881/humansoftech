FROM node:20-alpine

RUN apk add --no-cache openssl

WORKDIR /app

COPY package*.json ./
RUN npm install --legacy-peer-deps

COPY . .
RUN npx prisma generate
RUN npm run build
RUN ls -la dist/main.js

EXPOSE 4000

CMD ["node", "dist/main.js"]
