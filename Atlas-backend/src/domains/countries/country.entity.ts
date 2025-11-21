import { Column, Entity, JoinColumn, ManyToMany, ManyToOne, OneToMany, OneToOne, JoinTable, PrimaryGeneratedColumn } from "typeorm";
import { Continent } from "../continents/continent.entity";
import { Language } from "./language.entity";
import { Currency } from "./currency.entity";
import { City } from "../cities/city.entity";

@Entity({name: 'countries'})
export class Country {
    @PrimaryGeneratedColumn ('increment')
    id!: number;

    @Column({type: 'varchar', length: 100})
    name!: string;

    @Column({type: 'varchar', length: 100, nullable: true})
    nativeName?: string;

    @Column({type: 'int'})
    population!: number;

    @Column({type: 'int', nullable: false})
    continent_id!: number;

    @Column({type: 'varchar', nullable: true, length: 255})
    flag_url?: string;

    @ManyToOne(() => Continent, {nullable: false, onDelete: 'CASCADE'})
    @JoinColumn({name:'continent_id'})
    continent!: Continent;

    @OneToMany(() => City, (city) => city.country, { cascade: true })
    cities?: City[];

    @ManyToMany(() => Language, (language) => language.countries, { cascade: true })
    @JoinTable({
        name: 'country_languages',
        joinColumn: { name: 'country_id', referencedColumnName: 'id' },
        inverseJoinColumn: { name: 'language_id', referencedColumnName: 'id' },
    })
    languages?: Language[];

    @ManyToMany(() => Currency, (currency) => currency.countries, { cascade: true })
    @JoinTable({
        name: 'country_currencies',
        joinColumn: { name: 'country_id', referencedColumnName: 'id' },
        inverseJoinColumn: { name: 'currency_id', referencedColumnName: 'id' },
    })
    currencies?: Currency[];

    @OneToOne(() => City, { nullable: true })
    @JoinColumn({ name: 'capital_id' })
    capital?: City;
}
