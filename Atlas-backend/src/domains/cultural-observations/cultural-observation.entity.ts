import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { Country } from '../countries/country.entity';
import { City } from '../cities/city.entity';
import { User } from '../users/user.entity';

@Entity({ name: 'cultural_observations' })
export class CulturalObservation {
  @PrimaryGeneratedColumn('increment')
  id!: number;

  @Column({ type: 'int', nullable: true })
  country_id?: number;

  @Column({ type: 'int', nullable: true })
  city_id?: number;

  @Column({ type: 'int', nullable: false })
  user_id!: number;

  @Column({ type: 'text' })
  observation!: string;

  @CreateDateColumn()
  created_at!: Date;

  @UpdateDateColumn()
  updated_at!: Date;

  @ManyToOne(() => Country, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'country_id' })
  country?: Country;

  @ManyToOne(() => City, { nullable: true, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'city_id' })
  city?: City;

  @ManyToOne(() => User, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user!: User;
}
