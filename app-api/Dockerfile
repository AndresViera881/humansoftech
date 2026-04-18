FROM node:20-alpine

RUN apk add --no-cache openssl

WORKDIR /app

COPY package*.json ./
RUN npm install --legacy-peer-deps

COPY . .
RUN npx prisma generate
RUN npm run build

EXPOSE 4000

CMD ["/bin/sh", "-c", "npx prisma db push --accept-data-loss && echo 'Starting NestJS...' && node dist/main.js 2>&1; echo 'Process exited with code' $?"]
