FROM node:14
WORKDIR /
COPY package.json ./
COPY tsconfig.json ./
COPY src ./src
COPY .env ./
RUN ls -a
RUN npm install
RUN npm run build

## this is stage two , where the app actually runs
FROM node:14
WORKDIR /
COPY package.json ./
COPY .env ./
RUN npm install --only=production
COPY --from=0 ./build .
RUN npm install pm2 -g
EXPOSE 4000
CMD ["node","index.js"]