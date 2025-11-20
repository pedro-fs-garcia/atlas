import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from "typeorm";
import { Country } from "./country.entity";

@Entity({ name: 'currencies' })
export class Currency {
    @PrimaryGeneratedColumn('increment')
    id!: number;

    @Column({ type: 'varchar', length: 100 })
    name!: string;

    @Column({ type: 'varchar', length: 10, nullable: true })
    code?: string;

    @Column({ type: 'varchar', length: 10, nullable: true })
    symbol?: string;

    @ManyToMany(() => Country, (country) => country.currencies)
    countries?: Country[];
}
