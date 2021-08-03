FROM node:14
WORKDIR /
COPY package.json ./
COPY tsconfig.json ./
COPY ./swagger.json ./
COPY src ./src
COPY .env ./
RUN ls -a
RUN npm install
RUN npm run build

## this is stage two , where the app actually runs
FROM node:14
WORKDIR /
COPY package.json ./
COPY ./swagger.json ./
COPY .env ./
RUN npm install --only=production
COPY --from=0 /build ./
EXPOSE 4000
RUN ls -a
CMD ["node", "./src/index.js"]