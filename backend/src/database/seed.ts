import axios from 'axios';
import { AppDataSource } from './data-source';
import { Continent } from '../domains/continents/continent.entity';
import { Country } from '../domains/countries/country.entity';
import { logger } from '../core/logger';

const REST_COUNTRIES_API = 'https://restcountries.com/v3.1/all';

interface RestCountry {
  name: {
    common: string;
    official: string;
  };
  population: number;
  languages?: { [key: string]: string };
  currencies?: { [key: string]: { name: string; symbol: string } };
  region: string;
  subregion?: string;
}

// Mapping of regions to continent names
const REGION_TO_CONTINENT: { [key: string]: string } = {
  Africa: 'Africa',
  Americas: 'Americas',
  Antarctic: 'Antarctica',
  Asia: 'Asia',
  Europe: 'Europe',
  Oceania: 'Oceania',
};

const CONTINENT_DESCRIPTIONS: { [key: string]: string } = {
  Africa: 'The second-largest continent, known for its diverse wildlife, cultures, and rich history.',
  Americas: 'Comprising North and South America, home to diverse landscapes from Arctic tundra to Amazon rainforest.',
  Antarctica: 'The southernmost continent, covered by ice and home to unique wildlife and research stations.',
  Asia: 'The largest and most populous continent, birthplace of many ancient civilizations.',
  Europe: 'A continent rich in history, art, and culture, known for its diverse nations and languages.',
  Oceania: 'A region of islands in the Pacific Ocean, including Australia, New Zealand, and Pacific island nations.',
};

export async function seedDatabase() {
  try {
    logger.info('Starting database seeding...');

    if (!AppDataSource.isInitialized) {
      await AppDataSource.initialize();
      logger.info('Database connection initialized');
    }

    const continentRepo = AppDataSource.getRepository(Continent);
    const countryRepo = AppDataSource.getRepository(Country);

    // Check if database is already seeded
    const existingContinents = await continentRepo.count();
    if (existingContinents > 0) {
      logger.info('Database already seeded. Skipping...');
      return;
    }

    logger.info('Fetching countries from REST Countries API...');
    const response = await axios.get<RestCountry[]>(REST_COUNTRIES_API);
    const countries = response.data;

    logger.info(`Fetched ${countries.length} countries`);

    // Create continents
    logger.info('Creating continents...');
    const continentMap = new Map<string, Continent>();

    for (const [region, continentName] of Object.entries(REGION_TO_CONTINENT)) {
      const continent = continentRepo.create({
        name: continentName,
        description: CONTINENT_DESCRIPTIONS[continentName],
      });
      const savedContinent = await continentRepo.save(continent);
      continentMap.set(region, savedContinent);
      logger.info(`Created continent: ${continentName}`);
    }

    // Create countries
    logger.info('Creating countries...');
    let successCount = 0;
    let skipCount = 0;

    for (const countryData of countries) {
      try {
        const region = countryData.region;
        const continent = continentMap.get(region);

        if (!continent) {
          logger.warn(`Skipping country ${countryData.name.common} - unknown region: ${region}`);
          skipCount++;
          continue;
        }

        // Get primary language
        const languages = countryData.languages || {};
        const primaryLanguage = Object.values(languages)[0] || 'N/A';

        // Get primary currency
        const currencies = countryData.currencies || {};
        const primaryCurrency = Object.keys(currencies)[0] || 'N/A';

        // Create country
        const country = countryRepo.create({
          name: countryData.name.common,
          population: countryData.population,
          language: primaryLanguage,
          currency: primaryCurrency,
          continent_id: continent.id,
        } as Partial<Country>);

        await countryRepo.save(country);
        successCount++;

        if (successCount % 50 === 0) {
          logger.info(`Progress: ${successCount} countries created...`);
        }
      } catch (error) {
        logger.error(`Error creating country ${countryData.name.common}: ${String(error)}`);
        skipCount++;
      }
    }

    logger.info('Database seeding completed!');
    logger.info(`Summary:`);
    logger.info(`  - Continents created: ${continentMap.size}`);
    logger.info(`  - Countries created: ${successCount}`);
    logger.info(`  - Countries skipped: ${skipCount}`);
  } catch (error) {
    logger.error(`Error seeding database: ${String(error)}`);
    throw error;
  }
}

// Run if executed directly
if (require.main === module) {
  seedDatabase()
    .then(() => {
      logger.info('Seeding process finished successfully');
      process.exit(0);
    })
    .catch((error) => {
      logger.error(`Seeding process failed: ${String(error)}`);
      process.exit(1);
    });
}
