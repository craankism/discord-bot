FROM node:22-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --omit=dev

COPY . .

USER node

CMD ["sh", "-c", "node deploy-commands.js && node index.js"]
