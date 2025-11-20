import { AppDataSource } from '../../database/data-source';
import { Continent } from './continent.entity';
import { CreateContinentDTO } from './dto/create-continent.dto';

export class ContinentService {
    private repository = AppDataSource.getRepository(Continent);

    async getAll(): Promise<Continent[]> {
        return this.repository.find();
    }

    async getById(id: number): Promise<Continent | null> {
        return this.repository.findOneBy({ id });
    }

    async create({ name, description }: CreateContinentDTO): Promise<Continent> {
        const entity = this.repository.create({ name, description } as Partial<Continent>);
        return this.repository.save(entity);
    }

    async update(id: number, dto: Partial<CreateContinentDTO>): Promise<Continent | null> {
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