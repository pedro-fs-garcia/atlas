import { Repository } from 'typeorm';
import { AppDataSource } from '../../database/data-source';
import { Country } from './country.entity';
import { CreateCountryDTO, UpdateCountryDTO } from './dto/create-country.dto';

export class CountryService {
  private repository: Repository<Country> = AppDataSource.getRepository(Country);

  async getAll(): Promise<Country[]> {
    // include continent relation for convenience
    return this.repository.find({ relations: ['continent'] });
  }

  async getById(id: number): Promise<Country | null> {
    return this.repository.findOne({ where: { id }, relations: ['continent'] });
  }

  async create(dto: CreateCountryDTO): Promise<Country> {
    const entity = this.repository.create(dto as Partial<Country>) as Country;
    return this.repository.save(entity);
  }

  async update(id: number, dto: UpdateCountryDTO): Promise<Country | null> {
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
