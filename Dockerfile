# frontend/Dockerfile
# 第一阶段：基础依赖安装（公共）
FROM node:20-alpine as base
WORKDIR /app
RUN npm config set registry https://registry.npmjs.org/
RUN npm install -g pnpm
COPY .npmrc package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile
COPY . .

# 第二阶段：开发环境（不构建，直接运行 dev server）
FROM base as dev
CMD ["pnpm", "dev"]

# 第三阶段：生产环境构建
FROM base as prod-build
RUN pnpm build

# 第四阶段：生产环境部署
FROM nginx:stable-alpine as prod
COPY --from=prod-build /app/dist /usr/share/nginx/html/dist
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 8849
CMD ["nginx", "-g", "daemon off;"]