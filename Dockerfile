# ---- build stage ----
FROM node:22-alpine AS build
WORKDIR /app
COPY package*.json ./
# optional quality-of-life tweaks, safe to keep/remove
RUN npm ci --no-audit --no-fund
COPY . .
RUN npm run build  # creates /app/dist or /app/build depending on your setup
 
# ---- serve stage ----
FROM nginx:alpine
COPY nginx.conf /etc/nginx/conf.d/default.conf
# If your build output is "dist" (Vite default), use /app/dist.
# If it's "build" (CRA), adjust accordingly.
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]