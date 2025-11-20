export interface CreateCityDTO {
  name: string;
  population: number;
  latitude: number;
  longitude: number;
  country_id: number;
}

export interface UpdateCityDTO {
  name?: string;
  population?: number;
  latitude?: number;
  longitude?: number;
  country_id?: number;
}
