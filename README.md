# 🎯 API REST - Node.js + TypeScript + PostgreSQL

API REST com autenticação JWT, PostgreSQL e testes automatizados.

---

## 🚀 Como Rodar o Projeto

### Pré-requisitos

- **Node.js 18+** instalado
- **Docker Desktop** instalado e **rodando**

### Passo a Passo (copie e cole os comandos)

```powershell
# 1. Instalar dependências
npm install

# 2. Criar arquivo de configuração
Copy-Item .env.example .env

# 3. Subir o banco de dados
docker-compose up -d
Start-Sleep -Seconds 5

# 4. Criar banco de dados de teste
docker exec -it teste-omega psql -U omega_user -d omega_db -c "CREATE DATABASE omega_db_test;"

# 5. Executar migrations (banco de desenvolvimento)
npm run migration:dev

# 6. Executar migrations (banco de teste)
$env:DB_NAME="omega_db_test"; npm run migration:dev

# 7. Rodar os testes
npm test

# 8. Iniciar o servidor
npm run dev
```

### ✅ Resultado Esperado

- **Testes**: `Tests: 21 passed, 21 total` ✅
- **Servidor**: Rodando em `http://localhost:3000` ✅

---

## ⚡ Setup Automático (Opcional)

Se preferir, execute o script que faz tudo de uma vez:

```powershell
.\setup.ps1
```

Este script executa todos os passos acima automaticamente.

---

## 📌 Sobre os Arquivos

### `setup.ps1`

Script PowerShell que automatiza todo o processo de instalação. Use se quiser evitar copiar comando por comando.

### `.env.example`

Template de configuração. O passo 2 copia ele para `.env` que é usado pela aplicação.

---

## 🏗️ Tecnologias

- **Node.js** + **TypeScript**
- **Express.js**
- **PostgreSQL** (via Docker)
- **JWT** (autenticação)
- **Jest** + **Supertest** (testes)
- **bcrypt** (hash de senhas)

---

## 🔐 Endpoints da API

### Autenticação

- `POST /api/auth/register` - Registrar usuário
- `POST /api/auth/login` - Login

### Usuários (requer autenticação)

- `GET /api/users` - Listar usuários
- `GET /api/users/profile` - Perfil do usuário logado

---

## 🧪 Testes

O projeto tem **21 testes automatizados** que cobrem:

- Registro e login de usuários
- Validação de dados
- Autenticação JWT
- Casos de erro

**Importante**: Os testes usam um banco de dados separado (`omega_db_test`) que é limpo automaticamente, garantindo isolamento dos dados de desenvolvimento.

```powershell
# Rodar testes
npm test

# Rodar com coverage
npm run test:coverage

# Modo watch
npm run test:watch
```

---

## 🗂️ Estrutura do Projeto

```
src/
├── __tests__/          # Testes automatizados
├── controllers/        # Controllers (camada de apresentação)
├── services/           # Lógica de negócio
├── repositories/       # Acesso ao banco de dados
├── models/             # Modelos de dados
├── routes/             # Definição de rotas
├── middlewares/        # Middlewares (autenticação, validação)
├── validators/         # Schemas de validação
└── database/           # Conexão e migrations
```

**Arquitetura**: Controller → Service → Repository (separação de responsabilidades)

---

## 🐛 Problemas Comuns

### Erro: "Cannot connect to Docker"

**Solução**: Abra o Docker Desktop e aguarde ele inicializar completamente.

### Erro: "database omega_db_test does not exist"

**Solução**: Execute o comando do passo 4:

```powershell
docker exec -it teste-omega psql -U omega_user -d omega_db -c "CREATE DATABASE omega_db_test;"
```

### Erro: "Port 5432 already in use"

**Solução**: Você já tem um PostgreSQL rodando. Pare-o ou mude a porta no `docker-compose.yml`.

### Testes falhando

**Solução**: Recrie o ambiente do zero:

```powershell
docker-compose down -v
docker-compose up -d
Start-Sleep -Seconds 5
# Repita os passos 4, 5 e 6
```

---

## 📝 Scripts Disponíveis

| Comando                 | Descrição                               |
| ----------------------- | --------------------------------------- |
| `npm run dev`           | Inicia servidor em modo desenvolvimento |
| `npm test`              | Executa todos os testes                 |
| `npm run test:watch`    | Testes em modo watch                    |
| `npm run test:coverage` | Testes com relatório de cobertura       |
| `npm run migration:dev` | Executa migrations                      |

---

## 🎯 Destaques

- ✅ Arquitetura em camadas (SOLID)
- ✅ 21 testes automatizados
- ✅ Banco de dados isolado para testes
- ✅ Autenticação JWT
- ✅ Validação de dados
- ✅ TypeScript com tipagem forte
- ✅ Docker para fácil setup

---

**Desenvolvido por**: Rogério  
**Data**: Outubro 2025
