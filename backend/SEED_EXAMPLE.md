# Exemplo de Uso - Script de Seed do Banco de Dados

## Passo a Passo Completo

### 1. Configurar o ambiente

```bash
cd backend

# Criar arquivo .env se não existir
cp .env.example .env

# Editar .env com suas credenciais do PostgreSQL
nano .env
```

### 2. Instalar dependências

```bash
npm install
```

### 3. Criar o banco de dados (se não existir)

```bash
# Conectar ao PostgreSQL
psql -U postgres

# Criar o banco
CREATE DATABASE atlas_db;

# Sair
\q
```

### 4. Executar o script de seed

```bash
npm run seed
```

### Saída esperada:

```
[INFO] Starting database seeding...
[INFO] Database connection initialized
[INFO] Fetching countries from REST Countries API...
[INFO] Fetched 250 countries
[INFO] Creating continents...
[INFO] Created continent: Africa
[INFO] Created continent: Americas
[INFO] Created continent: Antarctica
[INFO] Created continent: Asia
[INFO] Created continent: Europe
[INFO] Created continent: Oceania
[INFO] Creating countries...
[INFO] Progress: 50 countries created...
[INFO] Progress: 100 countries created...
[INFO] Progress: 150 countries created...
[INFO] Progress: 200 countries created...
[INFO] Database seeding completed!
[INFO] Summary:
[INFO]   - Continents created: 6
[INFO]   - Countries created: 245
[INFO]   - Countries skipped: 5
[INFO] Seeding process finished successfully
```

### 5. Verificar os dados no banco

```bash
# Conectar ao banco
psql -U postgres -d atlas_db

# Ver continentes
SELECT * FROM continents;

# Ver países (primeiros 10)
SELECT id, name, population, language, currency FROM countries LIMIT 10;

# Contar países por continente
SELECT c.name as continent, COUNT(co.*) as country_count
FROM continents c
LEFT JOIN countries co ON co.continent_id = c.id
GROUP BY c.name
ORDER BY country_count DESC;
```

### 6. Iniciar o servidor

```bash
npm run dev
```

### 7. Testar a API

```bash
# Listar continentes
curl http://localhost:3000/continents

# Listar países
curl http://localhost:3000/countries

# Buscar países da Europa
curl 'http://localhost:3000/countries' | jq '.[] | select(.continent.name == "Europe") | .name'
```

## Exemplos de Dados Populados

### Continentes

```json
[
  {
    "id": 1,
    "name": "Africa",
    "description": "The second-largest continent, known for its diverse wildlife, cultures, and rich history."
  },
  {
    "id": 2,
    "name": "Americas",
    "description": "Comprising North and South America, home to diverse landscapes from Arctic tundra to Amazon rainforest."
  }
]
```

### Países (exemplos)

```json
[
  {
    "id": 1,
    "name": "Brazil",
    "population": 212559409,
    "language": "Portuguese",
    "currency": "BRL",
    "continent_id": 2,
    "continent": {
      "id": 2,
      "name": "Americas"
    }
  },
  {
    "id": 2,
    "name": "Germany",
    "population": 83240525,
    "language": "German",
    "currency": "EUR",
    "continent_id": 5,
    "continent": {
      "id": 5,
      "name": "Europe"
    }
  }
]
```

## Resetar o Banco

Se você quiser repopular o banco do zero:

```bash
# Opção 1: Deletar apenas os dados
psql -U postgres -d atlas_db -c "TRUNCATE continents, countries CASCADE;"

# Opção 2: Dropar e recriar o banco
psql -U postgres -c "DROP DATABASE atlas_db;"
psql -U postgres -c "CREATE DATABASE atlas_db;"

# Executar seed novamente
npm run seed
```

## Integração com o Frontend

Após popular o banco:

1. Inicie o backend: `npm run dev` (porta 3000)
2. Em outro terminal, inicie o frontend:
   ```bash
   cd ../Atlas-frontend
   npm run dev
   ```
3. Acesse `http://localhost:5173`
4. Navegue para "Countries" e veja os países reais carregados!

## Dicas

- O script é **idempotente**: pode ser executado múltiplas vezes sem duplicar dados
- Os dados vêm da [REST Countries API](https://restcountries.com/) - sempre atualizados
- Cerca de **250 países** serão carregados com dados reais de população, idioma e moeda
- **6 continentes** com descrições em inglês
