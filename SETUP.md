# Atlas Project - Database Initialization

## Quick Start

### 1. Setup Backend

```bash
cd backend
npm install
```

### 2. Configure Database

Create `.env` file in backend folder:

```env
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=your_password
DB_DATABASE=atlas_db

JWT_SECRET=your-secret-key
JWT_EXPIRES_IN=7d
PORT=3000
NODE_ENV=development
```

### 3. Seed Database with Real Data

```bash
npm run seed
```

This will populate your database with:
- **6 continents** (Africa, Americas, Antarctica, Asia, Europe, Oceania)
- **~250 countries** with real data from [REST Countries API](https://restcountries.com/)

### 4. Start Backend

```bash
npm run dev
```

Backend will run on `http://localhost:3000`

### 5. Start Frontend

```bash
cd ../Atlas-frontend
npm install
npm run dev
```

Frontend will run on `http://localhost:5173`

## What the Seed Script Does

The seed script (`backend/src/database/seed.ts`) automatically:

1. ✅ Connects to PostgreSQL database
2. ✅ Checks if data already exists (skips if yes)
3. ✅ Fetches real country data from REST Countries API
4. ✅ Creates 6 continents with descriptions
5. ✅ Creates ~250 countries with:
   - Official name
   - Current population
   - Primary language
   - Primary currency
   - Continent relationship

## Example Output

```
[INFO] Starting database seeding...
[INFO] Fetching countries from REST Countries API...
[INFO] Fetched 250 countries
[INFO] Creating continents...
[INFO] Created continent: Africa
[INFO] Created continent: Americas
[INFO] Creating countries...
[INFO] Progress: 50 countries created...
[INFO] Database seeding completed!
[INFO] Summary:
[INFO]   - Continents created: 6
[INFO]   - Countries created: 245
```

## Testing the API

```bash
# List continents
curl http://localhost:3000/continents

# List countries
curl http://localhost:3000/countries

# Get a specific country
curl http://localhost:3000/countries/1
```

## Documentation

- **Backend API**: [backend/README.md](backend/README.md)
- **Database Seeding**: [backend/DATABASE_SEED.md](backend/DATABASE_SEED.md)
- **Seed Examples**: [backend/SEED_EXAMPLE.md](backend/SEED_EXAMPLE.md)
- **Frontend**: [Atlas-frontend/README.md](Atlas-frontend/README.md)

## Features

### Backend
- ✅ JWT Authentication
- ✅ Full CRUD for Continents
- ✅ Full CRUD for Countries
- ✅ Cultural Observations with ownership control
- ✅ PostgreSQL with TypeORM
- ✅ **Automatic database seeding with real data**

### Frontend
- ✅ React 19 + TypeScript + Vite
- ✅ Authentication (Login/Register)
- ✅ Continents management
- ✅ Countries management
- ✅ Cultural observations with filters
- ✅ Responsive design (dark/light mode)

## Tech Stack

**Backend:**
- Node.js + TypeScript
- Express
- TypeORM + PostgreSQL
- JWT + bcrypt
- Axios (for REST Countries API)

**Frontend:**
- React 19 + TypeScript
- Vite
- React Router
- Axios
- Context API

## Data Source

Country data is fetched from the free [REST Countries API](https://restcountries.com/):
- No API key required
- Updated regularly
- Provides comprehensive country information
- ~250 countries worldwide
