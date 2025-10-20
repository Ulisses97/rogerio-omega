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

Estou enviando a collection do insomnia para fazer as requisições na api. Está no arquivo Insomnia_2025-10-20.json no diretorio do projeto.

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

**POST /api/auth/register** - Cadastrar usuário

1. Recebe: name, email, password
2. Valida os dados (express-validator)
3. Verifica se o email já existe
4. Cria hash da senha (bcrypt)
5. Salva no banco
6. Retorna usuário + token JWT

**POST /api/auth/login** - Login

1. Recebe: email, password
2. Valida os dados
3. Busca usuário no banco
4. Compara senha com hash (bcrypt)
5. Gera token JWT
6. Retorna usuário + token

### Usuários (requer JWT)

**GET /api/users** - Listar usuários

1. Middleware valida o token JWT
2. Busca todos os usuários no banco
3. Retorna lista (sem as senhas)

**GET /api/users/profile** - Perfil do usuário logado

1. Middleware valida o token JWT e extrai userId
2. Busca usuário no banco pelo ID
3. Retorna dados do usuário (sem a senha)

---

## Bibliotecas Utilizadas

### Produção

- **express** - Framework web para criar a API
- **pg** - Driver PostgreSQL para conectar no banco
- **jsonwebtoken** - Gera e valida tokens JWT para autenticação
- **bcrypt** - Cria hash seguro das senhas (não salva senha em texto puro)
- **express-validator** - Valida dados das requisições (email válido, senha mínima, etc)
- **dotenv** - Carrega variáveis de ambiente do arquivo .env
- **cors** - Permite requisições de outros domínios
- **helmet** - Adiciona headers de segurança HTTP
- **express-async-errors** - Captura erros automáticos em funções async

### Desenvolvimento

- **typescript** - Adiciona tipagem estática ao JavaScript
- **tsx** - Executa TypeScript diretamente (desenvolvimento)
- **jest** - Framework de testes
- **supertest** - Testa APIs HTTP
- **@types/** - Definições de tipos TypeScript para as bibliotecas

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

## Escolhas Técnicas

Escolhi Node.js com TypeScript porque é o que trabalho no dia a dia. TypeScript ajuda a pegar erros antes mesmo de rodar o código, e a tipagem facilita na hora de dar manutenção depois. Mesmo sendo um projeto "simples", preferi usar a separação de controller, service e repository para caso o projeto crescer, fica muito mais fácil adicionar features sem bagunçar. Também facilita testar cada camada separadamente.

Usei Postgres porque é robusto, open source e é bom para usar com Node.js.

Criei um banco separado só pra testes "omega_db_test" que é limpo antes de cada suite de testes. Assim os testes nunca interferem nos dados de desenvolvimento, e cada teste roda num ambiente limpo.

Escolhi express-validator porque ele já é middleware do Express, fica mais direto validar nas rotas. Evita criar schemas separados e já retorna os erros no padrão que o Express trabalha.

---

## Arquitetura

```
src/
├── controllers/      # Recebe requisições HTTP
├── services/         # Regras de negócio
├── repositories/     # Acesso ao banco de dados
├── middlewares/      # Autenticação e validação
├── routes/           # Definição de rotas
├── validators/       # Validações (express-validator)
├── database/         # Migrations
└── __tests__/        # Testes (21 testes)
```

### Fluxo de uma Requisição

```
1. Cliente faz requisição HTTP
   ↓
2. Route recebe e aplica validações (validators)
   ↓
3. Middleware de autenticação (se rota protegida)
   ↓
4. Controller recebe a requisição
   ↓
5. Service processa regras de negócio
   ↓
6. Repository acessa o banco de dados
   ↓
7. Resposta sobe a stack até o cliente
```

**Exemplo prático - POST /api/auth/register:**

1. Route aplica validações (nome, email, senha)
2. AuthController.register() recebe os dados
3. AuthService.register() verifica se email existe
4. UserRepository.create() salva no banco
5. AuthService gera o token JWT
6. Controller retorna resposta com usuário + token

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
