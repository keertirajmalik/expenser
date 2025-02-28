# Step 1: Build Stage
FROM node:22-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm install --legacy-peer-deps

COPY . .
RUN npm run build

# Step 2: Serve Stage
FROM nginx:alpine

WORKDIR /usr/share/nginx/html

COPY --from=builder /app/dist .

COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
