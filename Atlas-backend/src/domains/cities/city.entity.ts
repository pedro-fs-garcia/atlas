import { Column, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Country } from "../countries/country.entity";

@Entity({name: 'cities'})
export class City {
    @PrimaryGeneratedColumn ('increment')
    id!: number;

    @Column({type: 'varchar', length: 100})
    name!: string;

    @Column({type: 'int'})
    population!: number;

    @Column({type: 'decimal', precision: 10, scale: 7})
    latitude!: number;

    @Column({type: 'decimal', precision: 10, scale: 7})
    longitude!: number;

    @Column({type: 'int', nullable: false})
    country_id!: number;

    @ManyToOne(() => Country, {nullable: false, onDelete: 'CASCADE'})
    @JoinColumn({name:'country_id'})
    country!: Country;

    @OneToOne(() => Country, (country) => country.capital)
    capitalOf?: Country;
}
