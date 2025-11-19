# Database Seeding

Este script popula o banco de dados com dados reais de continentes e países usando a API [REST Countries](https://restcountries.com/).

## Como Usar

### 1. Certifique-se que o banco de dados está configurado

Verifique seu arquivo `.env` no backend:

```env
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=sua_senha
DB_DATABASE=atlas_db
```

### 2. Execute o script de seed

```bash
cd backend
npm run seed
```

## O Que o Script Faz

1. **Conecta ao banco de dados** usando TypeORM
2. **Verifica se já existe dados** - Se já houver continentes, o script não executa
3. **Busca dados da API REST Countries** - Obtém informações de ~250 países
4. **Cria continentes** com descrições:
   - Africa
   - Americas
   - Antarctica
   - Asia
   - Europe
   - Oceania

5. **Cria países** com informações reais:
   - Nome do país
   - População
   - Idioma principal
   - Moeda principal
   - Relacionamento com continente

## Dados Populados

### Continentes (6)
- África
- Américas
- Antártida
- Ásia
- Europa
- Oceania

### Países (~250)
Cada país inclui:
- Nome oficial
- População atual
- Idioma mais falado
- Moeda oficial
- Continente de pertencimento

## Exemplo de Saída

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

## Executar Múltiplas Vezes

O script verifica se o banco já foi populado. Se encontrar continentes existentes, ele pula a execução:

```
[INFO] Database already seeded. Skipping...
```

Para re-popular o banco:
1. Delete os dados existentes (manualmente ou via SQL)
2. Execute `npm run seed` novamente

## Tratamento de Erros

O script:
- ✅ Trata países sem região definida
- ✅ Trata países sem idioma ou moeda
- ✅ Registra erros individuais sem parar o processo
- ✅ Fornece resumo ao final (sucessos e falhas)

## API Utilizada

**REST Countries API v3.1**
- Endpoint: `https://restcountries.com/v3.1/all`
- Documentação: https://restcountries.com/
- Gratuita e sem necessidade de API key
- Dados atualizados regularmente

## Mapeamento de Regiões

A API REST Countries usa estas regiões que são mapeadas para continentes:

| Região API | Continente |
|------------|------------|
| Africa | Africa |
| Americas | Americas |
| Antarctic | Antarctica |
| Asia | Asia |
| Europe | Europe |
| Oceania | Oceania |

## Integração com a Aplicação

Após popular o banco:
1. Inicie o backend: `npm run dev`
2. Acesse o frontend em `http://localhost:5173`
3. Navegue para `/continents` ou `/countries`
4. Veja os dados reais carregados!

## Troubleshooting

### Erro de conexão com o banco
```
Error: connect ECONNREFUSED
```
**Solução:** Certifique-se que o PostgreSQL está rodando e as credenciais no `.env` estão corretas.

### Erro ao buscar API
```
Error fetching countries from REST Countries API
```
**Solução:** Verifique sua conexão com internet. A API pode estar temporariamente indisponível.

### Erro de duplicação
```
duplicate key value violates unique constraint
```
**Solução:** O banco já foi populado. Delete os dados existentes ou pule a execução.

## Customização

Para modificar os dados ou adicionar mais informações, edite o arquivo:
```
backend/src/database/seed.ts
```

Você pode:
- Alterar as descrições dos continentes
- Adicionar mais campos aos países
- Filtrar quais países incluir
- Modificar o mapeamento de regiões
