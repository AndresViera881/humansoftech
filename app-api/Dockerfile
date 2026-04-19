FROM node:20-alpine

RUN apk add --no-cache openssl

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
