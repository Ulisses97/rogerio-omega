# API REST - Autenticação JWT

API REST com autenticação JWT, desenvolvida em Node.js + TypeScript + PostgreSQL, rodando em containers Docker.

---

## Requisitos

- Docker
- Docker Compose

---

## Como Executar

### Subir a aplicação

```bash
docker-compose up --build
```

Aguarde a mensagem: `servidor on na porta: 3000`

API disponível em: **http://localhost:3000**

### Testar a API

Estou enviando a collection do insomnia para fazer as requisições na api

### Rodar testes

```bash
docker-compose --profile test up --build test
```

Executa 21 testes automatizados (Jest + Supertest).

### Parar containers

```bash
docker-compose down

# Limpar volumes
docker-compose down -v
```

---

## Endpoints

### Autenticação (público)

- `POST /api/auth/register` - Cadastrar usuário
- `POST /api/auth/login` - Login

### Usuários (requer JWT)

- `GET /api/users` - Listar usuários
- `GET /api/users/profile` - Perfil do usuário logado

---

## Tecnologias

- Node.js 18 + TypeScript
- Express.js
- PostgreSQL 16 (2 bancos: `omega_db` para produção, `omega_db_test` para testes)
- JWT (autenticação)
- Jest + Supertest (testes)
- Docker + Docker Compose
- bcrypt (hash de senhas)

---

## Arquitetura

```
src/
├── controllers/      # Lógica de negócio
├── services/         # Camada de serviços
├── repositories/     # Acesso ao banco
├── middlewares/      # Autenticação e validação
├── routes/           # Definição de rotas
├── validators/       # Validações (express-validator)
├── database/         # Migrations
└── __tests__/        # Testes (21 testes)
```

**Padrão:** Controllers → Services → Repositories

---

## Docker

### docker-compose.yml

- `postgres` - PostgreSQL com 2 bancos (`omega_db` e `omega_db_test`)
- `app` - Aplicação (target: production)
- `test` - Testes (profile: test, target: test)

### Dockerfile

Multi-stage build com 3 stages:

- `base` - Dependências compartilhadas
- `test` - Execução de testes
- `production` - Imagem final otimizada

---

## Desenvolvimento Local

```bash
# Instalar dependências
npm install

# Subir apenas o banco
docker-compose up postgres -d

# Criar .env
cp .env.example .env  # ou configure manualmente

# Rodar migrations
npm run migration:dev

# Iniciar app
npm run dev

# Rodar testes
npm test
```

---
