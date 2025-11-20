import axios, { AxiosInstance } from "axios";

interface CountryApiResponse {
    flags: {
        png: string;
        svg: string;
        alt: string;
    };
    name: {
        common: string;
        official: string;
        nativeName: {
            [key: string]: {
                official: string;
                common: string;
            };
        };
    };
    currencies: {
        [currencyCode: string]: {
            name: string;
            symbol: string;
        };
    };
    capital: string[];
    region: string;
    languages: {
        [key: string]: string;
    };
    population: number;
}


interface ConvenientCountryData {
    name: string;
    nativeName?: string;
    population: number;
    region: string;
    capital?: string;
    flagUrl: string;
    languages: string[];
    currencies: { name: string; symbol?: string }[];
}


export class ApiClient {
    private client: AxiosInstance;

    constructor() {
        this.client = axios.create({
            baseURL: `https://restcountries.com/v3.1/all?fields=name,lang,population,region,currencies,capital,languages,flags`,
            headers: {
                'Content-Type': 'application/json',
            },
        });
    }

    async get_all_countries(): Promise<CountryApiResponse[]> {
        const response = await this.client.get<any[]>(``);
        return response.data;
    }

    async filter_convevient_data(): Promise<ConvenientCountryData[]> {
        const all_countries = await this.get_all_countries();
        const convenient = all_countries.map((c) => {
            const name = c.name?.common ?? c.name?.official ?? 'Unknown';

            let nativeName: string | undefined = undefined;
            if (c.name && c.name.nativeName) {
                const keys = Object.keys(c.name.nativeName);
                if (keys.length > 0) {
                    const first = c.name.nativeName[keys[0]];
                    nativeName = first?.common ?? first?.official;
                }
            }

            const population = c.population ?? 0;
            const region = c.region ?? '';
            const capital = Array.isArray(c.capital) && c.capital.length > 0 ? c.capital[0] : undefined;
            const flagUrl = c.flags?.png ?? c.flags?.svg ?? '';

            const languages: string[] = c.languages ? Object.values(c.languages) : [];

            const currencies: { name: string; symbol?: string }[] = [];
            if (c.currencies) {
                for (const code of Object.keys(c.currencies)) {
                    const cur = c.currencies[code];
                    if (cur && cur.name) {
                        currencies.push({ name: cur.name, symbol: cur.symbol });
                    }
                }
            }

            const item: ConvenientCountryData = {
                name,
                nativeName,
                population,
                region,
                capital,
                flagUrl,
                languages,
                currencies,
            };

            return item;
        });

        return convenient;
    }
}