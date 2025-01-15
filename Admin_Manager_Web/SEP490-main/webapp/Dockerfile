FROM node:20-alpine as build
WORKDIR /app
COPY ./package*.json ./
RUN npm i
COPY . .
RUN npm run build --verbose

FROM nginx:1.21.6-alpine
EXPOSE 3000
COPY --from=build /app/dist /usr/share/nginx/html
COPY ./nginx/default.conf /etc/nginx/conf.d/default.conf
COPY ./nginx/env.sh /docker-entrypoint.d/env.sh
RUN chmod +x /docker-entrypoint.d/env.sh
