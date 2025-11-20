export type CreateLanguageDTO = {
    name: string
    code: string
}

export type UpdateLanguageDTO = Partial<CreateLanguageDTO>

