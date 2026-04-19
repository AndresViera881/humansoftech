FROM node:20-slim

RUN apt-get update && apt-get install -y openssl ca-certificates && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY package*.json ./
RUN npm install --legacy-peer-deps

COPY prisma ./prisma
RUN npx prisma generate

COPY . .
RUN npm run build

RUN test -f dist/main.js || (echo "ERROR: dist/main.js not found" && exit 1)

EXPOSE 4000

CMD ["node", "dist/main.js"]
