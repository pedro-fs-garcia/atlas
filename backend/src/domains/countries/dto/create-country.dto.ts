export type CreateCountryDTO = {
    name: string
    population: number
    language: string
    currency: string
    continent_id: number
}

export type UpdateCountryDTO = Partial<CreateCountryDTO>
