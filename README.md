<!-- README apresentado ao professor -->

# Atlas

Atlas é uma aplicação full‑stack desenvolvida como projeto acadêmico para gerenciar continentes, países, cidades e observações culturais. O objetivo é demonstrar conceitos de API REST, autenticação JWT, persistência com PostgreSQL/TypeORM e uma interface React moderna.

Principais pontos avaliados:

- Arquitetura em camadas (Router → Service → Entities)
- Autenticação e autorização (JWT)
- Relações de banco de dados (OneToMany, ManyToMany, OneToOne)
- Consumo de APIs externas (REST Countries para dados de países e wttr.in para clima)
- Seed idempotente para popular dados iniciais

---

**Tecnologias**

- Backend: Node.js, Express, TypeScript, TypeORM, PostgreSQL
- Frontend: React, Vite, TypeScript, Axios
- Autenticação: JSON Web Tokens (JWT)
- Ferramentas dev: ts-node-dev, eslint, prettier

---

## Como executar (ambiente de desenvolvimento)

Observação: os comandos abaixo são para Windows PowerShell (ambiente do professor/aluno).

1) Preparar o banco de dados PostgreSQL

 - Crie um banco PostgreSQL acessível (ex: localmente via Docker ou serviço instalado)
 - Crie um banco chamado `atlas` (ou ajuste variáveis de ambiente conforme abaixo)

2) Backend

Abra um terminal e execute:

```powershell
cd Atlas-backend
npm install
# criar arquivo .env com as variáveis descritas abaixo ou exportá-las no ambiente
npm run dev
```

Variáveis de ambiente úteis (`.env` na pasta `Atlas-backend`):

```
PORT=3000
POSTGRES_HOST=localhost
POSTGRES_PORT=5432
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres
POSTGRES_DB=atlas
CORS_ORIGINS=http://localhost:5173
```

3) Seeding do banco de dados

Com o backend e variáveis de ambiente configuradas, o script de inicialização do backend irá popular o banco automaticamente na primeira execução.

4) Frontend

Em outro terminal:

```powershell
cd Atlas-frontend
npm install
npm run dev
```

Se a variável `VITE_API_URL` não for fornecida, o frontend utiliza `http://localhost:3000` por padrão. Para apontar para outro backend, exporte `VITE_API_URL` antes de rodar o `dev`.

---

## Endpoints principais

Os endpoints seguem um padrão REST por domínio. Abaixo estão os recursos principais (resumido):

- `POST /auth/register` — registra usuário (retorna token)
- `POST /auth/login` — login (retorna token)
- `GET /continents` — lista continentes
- `POST /continents` — cria continente (autenticado)
- `PUT /continents/:id` — atualiza continente (autenticado)
- `DELETE /continents/:id` — remove continente (autenticado)
- `GET /countries` — lista países (formato simplificado com `languages[]`, `currencies[]`, `flagUrl`, `continent`)
- `POST /countries` — cria país (autenticado)
- `PUT /countries/:id` — atualiza país (autenticado)
- `DELETE /countries/:id` — remove país (autenticado)
- `GET /cities` — lista cidades (filtros por país/continente via query)
- `POST /cities` — cria cidade (autenticado)
- `GET /cultural-observations` — lista observações (filtros possivelmente aplicáveis)
- `POST /cultural-observations` — cria observação (autenticado)

Também há rotas internas para consumir APIs externas (backend faz chamadas a REST Countries e wttr.in para complementar dados).

---

## Consumo de APIs externas

- REST Countries: usado no processo de seed para obter dados de países (nomes, línguas, moedas, bandeiras).
- wttr.in: usado pela UI de cidades para buscar clima atual via `https://wttr.in/<cityName>?format=j1`. A aplicação extrai apenas `FeelsLikeC`, `humidity` e `temp_C` para exibir.

---

## Funcionalidades implementadas

- Autenticação (registro/login) com JWT
- CRUD para Continentes, Países e Cidades — operações de escrita protegidas (apenas usuários logados podem criar/editar/excluir)
- Listagem pública de continentes/países/cidades
- Observações culturais (usuário dono pode editar/excluir)
- Seeder para popular dados iniciais a partir da REST Countries API
- Exibição de bandeiras (backend pode fornecer `flagUrl` ou frontend busca via REST Countries)
- Integração com wttr.in para clima por cidade (campos essenciais)


