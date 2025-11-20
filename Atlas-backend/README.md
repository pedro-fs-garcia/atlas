# Atlas Backend API

Backend para o projeto Atlas com autenticação JWT e observações culturais.

## Estrutura do Projeto

O projeto segue uma combinação de DDD (Domain-Driven Design) e Clean Architecture:

```
backend/
├── src/
│   ├── domains/           # Domínios da aplicação
│   │   ├── users/         # Autenticação e usuários
│   │   ├── continents/    # CRUD de continentes
│   │   ├── countries/     # CRUD de países
│   │   └── cultural-observations/  # Observações culturais
│   ├── middleware/        # Middlewares (auth, etc.)
│   ├── database/          # Configuração do banco de dados
│   └── core/              # Utilitários (logger, etc.)
```

## Tecnologias

- **Node.js** com **TypeScript**
- **Express** para o servidor HTTP
- **TypeORM** para ORM e migrações
- **PostgreSQL** como banco de dados
- **JWT** para autenticação
- **bcrypt** para hash de senhas

## Configuração

### Variáveis de Ambiente

Crie um arquivo `.env` na raiz do backend:

```env
# Database
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=your_password
DB_DATABASE=atlas_db

# JWT
JWT_SECRET=your-super-secret-key-change-this-in-production
JWT_EXPIRES_IN=7d

# Server
PORT=3000
NODE_ENV=development
```

### Instalação

```bash
cd backend
npm install
```

### Popular o Banco de Dados (Seed)

Para popular o banco com dados reais de continentes e países da API REST Countries:

```bash
npm run seed
```

Este script irá:
- Criar 6 continentes com descrições
- Criar ~250 países com dados reais (nome, população, idioma, moeda)
- Buscar dados da API [REST Countries](https://restcountries.com/)

**Nota:** O script só executa se o banco estiver vazio. Ver [DATABASE_SEED.md](./DATABASE_SEED.md) para mais detalhes.

### Executar

```bash
# Desenvolvimento (hot reload)
npm run dev

# Build e produção
npm run build
npm start
```

## API Endpoints

### Autenticação

#### POST /auth/register
Registra um novo usuário.

**Body:**
```json
{
  "username": "joao",
  "email": "joao@example.com",
  "password": "senha123"
}
```

**Response (201):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "username": "joao",
    "email": "joao@example.com"
  }
}
```

#### POST /auth/login
Faz login de um usuário existente.

**Body:**
```json
{
  "email": "joao@example.com",
  "password": "senha123"
}
```

**Response (200):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "username": "joao",
    "email": "joao@example.com"
  }
}
```

---

### Continentes

#### GET /continents
Lista todos os continentes.

#### GET /continents/:id
Busca um continente por ID.

#### POST /continents
Cria um novo continente.

**Body:**
```json
{
  "name": "América do Sul",
  "description": "Continente sul-americano"
}
```

#### PUT /continents/:id
Atualiza um continente.

#### DELETE /continents/:id
Remove um continente.

---

### Países

#### GET /countries
Lista todos os países (com relação ao continente).

#### GET /countries/:id
Busca um país por ID.

#### POST /countries
Cria um novo país.

**Body:**
```json
{
  "name": "Brasil",
  "population": 215000000,
  "language": "Português",
  "currency": "Real",
  "continent_id": 1
}
```

#### PUT /countries/:id
Atualiza um país.

#### DELETE /countries/:id
Remove um país.

---

### Observações Culturais

#### GET /cultural-observations
Lista todas as observações culturais.

**Query Parameters:**
- `country_id` (opcional): Filtra por país
- `user_id` (opcional): Filtra por usuário

**Response:**
```json
[
  {
    "id": 1,
    "country_id": 1,
    "user_id": 1,
    "city": "Rio de Janeiro",
    "observation": "O carnaval é uma celebração única...",
    "created_at": "2025-11-19T10:00:00.000Z",
    "updated_at": "2025-11-19T10:00:00.000Z",
    "country": { "id": 1, "name": "Brasil", ... },
    "user": { "id": 1, "username": "joao", ... }
  }
]
```

#### GET /cultural-observations/:id
Busca uma observação por ID.

#### POST /cultural-observations (🔒 Protegido)
Cria uma nova observação cultural.

**Headers:**
```
Authorization: Bearer <token>
```

**Body:**
```json
{
  "country_id": 1,
  "city": "Rio de Janeiro",
  "observation": "O carnaval é uma celebração única que mistura música, dança e cultura."
}
```

#### PUT /cultural-observations/:id (🔒 Protegido)
Atualiza uma observação (apenas o autor pode atualizar).

**Headers:**
```
Authorization: Bearer <token>
```

**Body:**
```json
{
  "city": "São Paulo",
  "observation": "Texto atualizado da observação..."
}
```

#### DELETE /cultural-observations/:id (🔒 Protegido)
Remove uma observação (apenas o autor pode remover).

**Headers:**
```
Authorization: Bearer <token>
```

---

## Autenticação

Rotas protegidas requerem um token JWT no header:

```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

O token é retornado nos endpoints `/auth/register` e `/auth/login`.

## Modelo de Dados

### User
- `id`: number (PK)
- `username`: string (unique)
- `email`: string (unique)
- `password_hash`: string
- `created_at`: timestamp

### Continent
- `id`: number (PK)
- `name`: string (unique)
- `description`: string (nullable)

### Country
- `id`: number (PK)
- `name`: string
- `population`: number
- `language`: string
- `currency`: string
- `continent_id`: number (FK)

### CulturalObservation
- `id`: number (PK)
- `country_id`: number (FK)
- `user_id`: number (FK)
- `city`: string (opcional)
- `observation`: text
- `created_at`: timestamp
- `updated_at`: timestamp

## Segurança

- Senhas são hasheadas com **bcrypt** (10 rounds)
- Tokens JWT expiram em 7 dias (configurável)
- Validação de propriedade: usuários só podem editar/deletar suas próprias observações
- Middleware de autenticação valida tokens em rotas protegidas

## Próximos Passos

- [ ] Adicionar validação de entrada com class-validator
- [ ] Implementar testes unitários e de integração
- [ ] Adicionar paginação nas listagens
- [ ] Implementar rate limiting
- [ ] Adicionar documentação Swagger/OpenAPI
- [ ] Implementar refresh tokens
- [ ] Adicionar logs de auditoria
