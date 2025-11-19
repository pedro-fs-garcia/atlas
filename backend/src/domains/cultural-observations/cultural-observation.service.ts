import { Repository } from 'typeorm';
import { AppDataSource } from '../../database/data-source';
import { CulturalObservation } from './cultural-observation.entity';
import { CreateObservationDTO, UpdateObservationDTO } from './dto/observation.dto';

export class CulturalObservationService {
  private repository: Repository<CulturalObservation> = AppDataSource.getRepository(CulturalObservation);

  async getAll(filters?: { country_id?: number; user_id?: number }): Promise<CulturalObservation[]> {
    const query = this.repository.createQueryBuilder('observation')
      .leftJoinAndSelect('observation.country', 'country')
      .leftJoinAndSelect('observation.user', 'user');

    if (filters?.country_id) {
      query.andWhere('observation.country_id = :country_id', { country_id: filters.country_id });
    }

    if (filters?.user_id) {
      query.andWhere('observation.user_id = :user_id', { user_id: filters.user_id });
    }

    return query.orderBy('observation.created_at', 'DESC').getMany();
  }

  async getById(id: number): Promise<CulturalObservation | null> {
    return this.repository.findOne({
      where: { id },
      relations: ['country', 'user'],
    });
  }

  async create(dto: CreateObservationDTO, userId: number): Promise<CulturalObservation> {
    const entity = this.repository.create({
      ...dto,
      user_id: userId,
    } as Partial<CulturalObservation>);

    return this.repository.save(entity);
  }

  async update(id: number, dto: UpdateObservationDTO, userId: number): Promise<CulturalObservation | null> {
    const existing = await this.repository.findOneBy({ id });

    if (!existing) return null;

    // Only the owner can update their observation
    if (existing.user_id !== userId) {
      throw new Error('Unauthorized: You can only update your own observations');
    }

    Object.assign(existing, dto);
    return this.repository.save(existing);
  }

  async delete(id: number, userId: number): Promise<boolean> {
    const existing = await this.repository.findOneBy({ id });

    if (!existing) return false;

    // Only the owner can delete their observation
    if (existing.user_id !== userId) {
      throw new Error('Unauthorized: You can only delete your own observations');
    }

    const result = await this.repository.delete(id);
    return (result.affected ?? 0) > 0;
  }
}
