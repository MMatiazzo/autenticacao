FROM node:18 AS builder

WORKDIR /app

COPY package*.json ./
COPY src/infrastructure/persistence/prisma/schema ./prisma/

RUN npm install

COPY . .

RUN npm run build

FROM node:18

COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma

EXPOSE 3335

CMD [  "npm", "run", "start:migrate:prod" ]