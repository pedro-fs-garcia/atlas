import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Continent } from "../continents/continent.entity";

@Entity({name: 'countries'})
export class Country {
    @PrimaryGeneratedColumn ('increment')
    id!: number;

    @Column({type: 'varchar', length: 100})
    name!: string;

    @Column({type: 'int'})
    population!: number;

    @Column({type: 'varchar', length: 50})
    language!: string;

    @Column({type: 'varchar', length: 50})
    currency!: string;

    @Column({type: 'int', nullable: false})
    continent_id!: number;

    @ManyToOne(() => Continent, {nullable: false, onDelete: 'CASCADE'})
    @JoinColumn({name:'continent_id'})
    continent!: Continent;
}
