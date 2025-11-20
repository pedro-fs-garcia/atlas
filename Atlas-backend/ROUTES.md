**Domains Routes Reference**

This document describes the HTTP routes exposed by the `src/domains` routers and the shape of their responses. Keep this file updated when you change route handlers or response shapes.

**Continents**
- Base path: `/continents`

- GET `/continents`
  - Query: none
  - Response: 200 OK
  - Body: array of Continent objects

Example:
```json
[{
  "id": 1,
  "name": "África",
  "description": "O segundo maior continente..."
}]
```

- GET `/continents/:id`
  - Path param: `id` (number)
  - Response: 200 OK | 400 (invalid id) | 404 (not found)
  - Body: single Continent object (see example above)

- POST `/continents`
  - Body: { name: string, description?: string }
  - Response: 201 Created with created Continent object

- PUT `/continents/:id`
  - Body: partial { name?, description? }
  - Response: 200 OK with updated Continent

- DELETE `/continents/:id`
  - Response: 204 No Content on success

**Countries**
- Base path: `/countries`

- GET `/countries`
  - Query: none
  - Response: 200 OK
  - Body: array of formatted country DTOs (compact)

Formatted country object (GET /countries):
```json
{
  "id": 1,
  "name": "Brazil",
  "nativeName": "Brasil",
  "population": 213000000,
  "continent": "Américas",
  "capital": "Brasília",
  "languages": ["Portuguese"],
  "currencies": [{ "name": "Brazilian real", "symbol": "R$" }]
}
```

- GET `/countries/:id`
  - Path param: `id` (number)
  - Response: 200 OK | 400 | 404
  - Body: formatted country DTO with `cities` list (each `{ id, name }`)

Example (GET /countries/1):
```json
{
  "id": 1,
  "name": "Brazil",
  "nativeName": "Brasil",
  "population": 213000000,
  "continent": "Américas",
  "capital": "Brasília",
  "languages": ["Portuguese"],
  "currencies": [{ "name": "Brazilian real", "symbol": "R$" }],
  "cities": [{ "id": 123, "name": "São Paulo" }, { "id": 124, "name": "Rio de Janeiro" }]
}
```

- POST `/countries`
  - Body: accepts CreateCountryDTO (legacy DTO). Because countries now have relations for `languages` and `currencies`, prefer creating via dedicated endpoints or by creating related entities first.
  - Response: 201 Created with saved Country entity (contains relations if provided).

- PUT `/countries/:id`
  - Body: UpdateCountryDTO
  - Response: 200 OK with updated Country

- DELETE `/countries/:id`
  - Response: 204 No Content

**Cities**
- Base path: `/cities`

- GET `/cities`
  - Query params (optional): `country_id` (number), `continent_id` (number)
  - Response: 200 OK
  - Body: array of City entities

City object example:
```json
{
  "id": 123,
  "name": "São Paulo",
  "population": 12000000,
  "latitude": -23.55052,
  "longitude": -46.633308,
  "country_id": 1,
  "country": { /* full Country entity if relation loaded */ }
}
```

- GET `/cities/:id`
  - Response: 200 OK | 400 | 404
  - Body: City entity (includes `country` relation when loaded)

- POST `/cities`
  - Body: CreateCityDTO
  - Response: 201 Created with created City

- PUT `/cities/:id`
  - Body: UpdateCityDTO
  - Response: 200 OK with updated City

- DELETE `/cities/:id`
  - Response: 204 No Content

**Cultural Observations**
- Base path: `/cultural-observations`

- GET `/cultural-observations`
  - Query params (optional): `country_id`, `city_id`, `user_id` (numbers)
  - Response: 200 OK
  - Body: array of CulturalObservation entities

CulturalObservation example:
```json
{
  "id": 1,
  "country_id": 1,
  "city_id": 123,
  "user_id": 5,
  "observation": "Great food and music",
  "created_at": "2025-11-19T00:00:00.000Z",
  "updated_at": "2025-11-19T00:00:00.000Z",
  "country": { /* Country entity */ },
  "city": { /* City entity */ },
  "user": { /* User object (id, username, email) */ }
}
```

- GET `/cultural-observations/:id`
  - Response: 200 | 400 | 404

- POST `/cultural-observations` (protected)
  - Requires Authorization (JWT). Request body: { country_id, city_id?, observation }
  - Response: 201 Created with created observation

- PUT `/cultural-observations/:id` (protected)
  - Only the creating user may edit. Returns 200 updated observation.

- DELETE `/cultural-observations/:id` (protected)
  - Only the creating user may delete. Returns 204 on success.

**Auth (users)**
- Base path: `/auth`

- POST `/auth/register`
  - Body: { username, email, password }
  - Response: 201 Created with Auth response:
```json
{
  "token": "<jwt>",
  "user": { "id": 1, "username": "joe", "email": "joe@example.com" }
}
```

- POST `/auth/login`
  - Body: { email, password }
  - Response: 200 OK with the same Auth response shape as register

---

Notes & guidance
- Routes typically return full entity objects for POST/PUT responses (these may include relations depending on what was saved and the service implementation).
- For the `countries` GET endpoints we deliberately return a compact DTO: languages as `string[]` and currencies as `{ name, symbol }[]` to simplify frontend consumption.
- If you add new relations (languages, currencies, cities), update this document and the frontend mapping accordingly.

If you want, I can also generate OpenAPI (Swagger) docs from these shapes.
