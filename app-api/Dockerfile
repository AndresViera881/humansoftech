FROM node:20-slim

RUN apt-get update && apt-get install -y openssl && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY package*.json ./
RUN npm install --legacy-peer-deps

COPY . .
RUN npx prisma generate
RUN npm run build

EXPOSE 4000

CMD ["/bin/sh", "-c", "npx prisma db push --accept-data-loss; echo 'Prisma done, starting NestJS...'; node dist/main.js"]
