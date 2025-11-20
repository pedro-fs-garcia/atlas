export type CreateCurrencyDTO = {
    name: string
    code: string
    symbol: string
}

export type UpdateCurrencyDTO = Partial<CreateCurrencyDTO>

