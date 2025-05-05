FROM node:18-alpine

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm install

COPY . .

# If you want to use .env variables at build time, copy from root
# COPY ../.env .env

RUN npm run build

# Use a lightweight static server to serve the build
RUN npm install -g serve
CMD ["serve", "-s", "dist", "-l", "3000"] 