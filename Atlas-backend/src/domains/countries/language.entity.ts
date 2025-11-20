import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from "typeorm";
import { Country } from "./country.entity";

@Entity({ name: 'languages' })
export class Language {
    @PrimaryGeneratedColumn('increment')
    id!: number;

    @Column({ type: 'varchar', length: 100 })
    name!: string;

    @Column({ type: 'varchar', length: 10 })
    code!: string;

    @ManyToMany(() => Country, (country) => country.languages)
    countries?: Country[];
}