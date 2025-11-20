import { Repository } from 'typeorm';
import { AppDataSource } from '../../database/data-source';
import { City } from './city.entity';
import { CreateCityDTO, UpdateCityDTO } from './dto/create-city.dto';

export class CityService {
  private repository: Repository<City> = AppDataSource.getRepository(City);

  async getAll(countryId?: number, continentId?: number): Promise<City[]> {
    const queryBuilder = this.repository
      .createQueryBuilder('city')
      .leftJoinAndSelect('city.country', 'country')
      .leftJoinAndSelect('country.continent', 'continent');

    if (countryId) {
      queryBuilder.andWhere('city.country_id = :countryId', { countryId });
    }

    if (continentId) {
      queryBuilder.andWhere('country.continent_id = :continentId', { continentId });
    }

    return queryBuilder.getMany();
  }

  async getById(id: number): Promise<City | null> {
    return this.repository.findOne({
      where: { id },
      relations: ['country', 'country.continent']
    });
  }

  async create(dto: CreateCityDTO): Promise<City> {
    const entity = this.repository.create(dto as Partial<City>) as City;
    return this.repository.save(entity);
  }

  async update(id: number, dto: UpdateCityDTO): Promise<City | null> {
    const existing = await this.repository.findOneBy({ id });
    if (!existing) return null;
    Object.assign(existing, dto);
    return this.repository.save(existing);
  }

  async delete(id: number): Promise<boolean> {
    const result = await this.repository.delete(id);
    return (result.affected ?? 0) > 0;
  }
}
