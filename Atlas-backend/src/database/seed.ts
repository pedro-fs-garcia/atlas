import axios from 'axios';
import { AppDataSource } from './data-source';
import { Continent } from '../domains/continents/continent.entity';
import { Country } from '../domains/countries/country.entity';
import { logger } from '../core/logger';
import { ContinentService } from '../domains/continents/continent.service';
import { ApiClient } from '../core/api';
import { Language } from '../domains/countries/language.entity';
import { Currency } from '../domains/countries/currency.entity';
import { City } from '../domains/cities/city.entity';
import { Repository } from 'typeorm';

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

const CONTINENTS = [
  ["África", 'O segundo maior continente, conhecido por sua vida selvagem diversificada, culturas e rica história.'],
  ["Américas", 'Compreendendo a América do Norte e do Sul, lar de paisagens diversas, da tundra ártica à floresta amazônica.'],
  ['Antártica', 'O continente mais ao sul, coberto de gelo e lar de vida selvagem única e estações de pesquisa.'],
  ['Ásia', 'O maior e mais populoso continente, berço de muitas civilizações antigas.'],
  ['Europa', 'Um continente rico em história, arte e cultura, conhecido por suas diversas nações e idiomas.'],
  ['Oceania', 'Uma região de ilhas no Oceano Pacífico, incluindo Austrália, Nova Zelândia e nações insulares do Pacífico.'],
];


async function fetchCountriesFromApi() {
  const apiclient = new ApiClient();
  return apiclient.filter_convevient_data();
}

async function saveCountriesData() {
  const REGION_TO_CONTINENT = {
    Africa: 'África',
    Americas: 'Américas',
    Antarctic: 'Antártica',
    Asia: 'Ásia',
    Europe: 'Europa',
    Oceania: 'Oceania',
  };
  const apiclient = new ApiClient();
  const countries = await apiclient.filter_convevient_data();

  const continentService = new ContinentService();
  const continentList = await continentService.getAll();

  const languageRepo: Repository<Language> = AppDataSource.getRepository(Language);
  const currencyRepo: Repository<Currency> = AppDataSource.getRepository(Currency);
  const countryRepo = AppDataSource.getRepository(Country);
  const cityRepo: Repository<City> = AppDataSource.getRepository(City);

  for (const c of countries) {
    try {
      const continentName = (REGION_TO_CONTINENT as Record<string, string>)[c.region] ?? c.region ?? '';
      const continent = continentList.find((ct) => ct.name === continentName);
      if (!continent) {
        logger.info(`⚠️  Skipping country ${c.name} because continent mapping not found for region '${c.region}'`);
        continue;
      }

      // skip if country already exists
      const existing = await countryRepo.findOne({ where: { name: c.name } });
      if (existing) {
        logger.info(`⚠️ Country already exists: ${c.name}, skipping`);
        continue;
      }

      // ensure languages
      const savedLanguages: Language[] = [];
      for (const langName of c.languages ?? []) {
        let lang = await languageRepo.findOne({ where: { name: langName } });
        if (!lang) {
          lang = languageRepo.create({ name: langName, code: String(langName).slice(0, 3).toLowerCase() });
          lang = await languageRepo.save(lang);
        }
        savedLanguages.push(lang);
      }

      // ensure currencies
      const savedCurrencies: Currency[] = [];
      for (const cur of c.currencies ?? []) {
        let curEntity = await currencyRepo.findOne({ where: { name: cur.name } });
        if (!curEntity) {
          curEntity = currencyRepo.create({ name: cur.name, code: (cur.name || '').slice(0, 3).toUpperCase(), symbol: cur.symbol });
          curEntity = await currencyRepo.save(curEntity);
        }
        savedCurrencies.push(curEntity);
      }

      // create country
      const countryEntity = countryRepo.create({
        name: c.name,
        nativeName: c.nativeName ?? undefined,
        population: c.population,
        continent: continent,
        flag_url: c.flagUrl,
        languages: savedLanguages,
        currencies: savedCurrencies,
      } as any);

      const savedCountry = (await countryRepo.save(countryEntity)) as unknown as Country;

      // create capital city if provided (use defaults for population/coords)
      if (c.capital) {
        const cityEntity = cityRepo.create({
          name: c.capital,
          population: 0,
          latitude: 0,
          longitude: 0,
          country: savedCountry,
        } as any);
        const savedCity = (await cityRepo.save(cityEntity)) as unknown as City;

        savedCountry.capital = savedCity;
        await countryRepo.save(savedCountry);
      }

      logger.info(`✅ Country seeded: ${savedCountry.name}`);
    } catch (err) {
      logger.error(`Failed to save country ${c.name}: ${String(err)}`);
    }
  }
}


export async function seedDatabase() {
  try {
    logger.info('TODO: Inserir dados reais no banco de dados a partir de uma API pública ou arquivo local');
    const continentsService = new ContinentService();
    const existingContinents = await continentsService.getAll();
    const result = await AppDataSource.query("SHOW client_encoding");
    console.log("Client encoding:", result);


    for (const [name, description] of CONTINENTS) {
      if (existingContinents.find(c => c.name === name)) {
        logger.info(`⚠️ Continent already exists: ${name}, skipping`);
        continue;
      }
      const newContinent = await continentsService.create({ name, description });
      logger.info(`✅ Continent created: ${newContinent.name}`);
    }

    saveCountriesData();

  } catch (error) {
    logger.error(`❌ Error seeding database: ${String(error)}`);
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
