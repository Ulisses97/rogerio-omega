# ====================
# BASE STAGE
# ====================
FROM node:18-alpine AS base

WORKDIR /app

# Instalar dependências
COPY package*.json ./
RUN npm install

# Copiar código fonte
COPY . .

# ====================
# TEST STAGE
# ====================
FROM base AS test

ENV NODE_ENV=test

CMD ["npm", "test"]

# ====================
# PRODUCTION STAGE
# ====================
FROM base AS production

ENV NODE_ENV=production

# Tornar script executável
RUN chmod +x /app/start.sh

EXPOSE 3000

CMD ["/app/start.sh"]
