import { Repository } from "typeorm";
import { Currency } from "./currency.entity";
import { CreateCurrencyDTO, UpdateCurrencyDTO } from "./dto/currency.dto";
import { AppDataSource } from "../../database/data-source";

export class CurrencyService {
  private repository: Repository<Currency> = AppDataSource.getRepository(Currency);

  async getAll(): Promise<Currency[]> {
    // include continent relation for convenience
    return this.repository.find({ relations: ['continent'] });
  }

  async getById(id: number): Promise<Currency | null> {
    return this.repository.findOne({ where: { id }, relations: ['continent'] });
  }

  async create(dto: CreateCurrencyDTO): Promise<Currency> {
    const entity = this.repository.create(dto as Partial<Currency>) as Currency;
    return this.repository.save(entity);
  }

  async update(id: number, dto: UpdateCurrencyDTO): Promise<Currency | null> {
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
