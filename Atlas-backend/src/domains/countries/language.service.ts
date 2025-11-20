import { Repository } from "typeorm";
import { Language } from "./language.entity";
import { AppDataSource } from "../../database/data-source";
import { CreateLanguageDTO, UpdateLanguageDTO } from "./dto/language.dto";

export class LanguageService {
  private repository: Repository<Language> = AppDataSource.getRepository(Language);

  async getAll(): Promise<Language[]> {
    // include continent relation for convenience
    return this.repository.find({ relations: ['continent'] });
  }

  async getById(id: number): Promise<Language | null> {
    return this.repository.findOne({ where: { id }, relations: ['continent'] });
  }

  async create(dto: CreateLanguageDTO): Promise<Language> {
    const entity = this.repository.create(dto as Partial<Language>) as Language;
    return this.repository.save(entity);
  }

  async update(id: number, dto: UpdateLanguageDTO): Promise<Language | null> {
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
