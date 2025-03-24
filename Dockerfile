FROM node:20-alpine as build-stage

WORKDIR /app
RUN npm config set registry https://mirrors.cloud.tencent.com/npm/

# RUN corepack enable
# RUN corepack prepare pnpm@latest --activate

RUN npm install -g pnpm

COPY .npmrc package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

COPY . .
# RUN pnpm build

FROM nginx:stable-alpine as production-stage

COPY nginx.conf /etc/nginx/conf.d/default.conf

COPY --from=build-stage /app/dist /usr/share/nginx/html/dist
EXPOSE 8849

CMD ["nginx", "-g", "daemon off;"]