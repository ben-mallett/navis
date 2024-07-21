FROM node:18-alpine

WORKDIR /app

COPY package.json package-lock.json  pnpm-lock.yaml ./

RUN npm install -g pnpm ts-node typescript

RUN pnpm install

COPY . .

RUN npx prisma generate

RUN pnpm run build

EXPOSE 3000

CMD ["pnpm", "start"]