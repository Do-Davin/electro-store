# ---------- BUILD STAGE ----------
FROM node:20-alpine AS builder
WORKDIR /app

COPY package*.json ./
RUN npm install
RUN npm install -D @nestjs/cli

COPY . .
RUN npm run build


# ---------- RUNTIME STAGE ----------
FROM node:20-alpine
WORKDIR /app

COPY --from=builder /app/package*.json ./
RUN npm install --only=production

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/public ./public

# Ensure upload directories exist for multer at runtime
RUN mkdir -p public/uploads/products public/uploads/brands public/uploads/avatars

ENV PORT=3000
EXPOSE 3000

CMD ["node", "dist/main.js"]
