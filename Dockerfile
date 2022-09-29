FROM node:14.18.1 as build-stage
RUN mkdir /usr/src/psytribe
RUN apt install bash
WORKDIR /usr/src/psytribe
COPY package*.json /usr/src/psytribe/
RUN npm install
RUN npm install -g @vue/cli

COPY . .
RUN npm run build

FROM nginx:stable-alpine as production-stage
COPY --from=build-stage /usr/src/psytribe/dist /usr/share/nginx/html

RUN rm /etc/nginx/conf.d/default.conf
COPY ./docker/nginx/nginx.conf /etc/nginx/conf.d

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]

