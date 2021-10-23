FROM node:14.17-slim as build
WORKDIR /usr/local/app
COPY . .
RUN npm install
RUN npm run build

FROM nginx
WORKDIR /usr/share/nginx/html
COPY --from=build /usr/local/app/dist/mismatchresolver-frontend .
EXPOSE 80
