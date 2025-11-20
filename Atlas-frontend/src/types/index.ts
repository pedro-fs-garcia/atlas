// Type definitions for the backend API

export interface User {
  id: number;
  username: string;
  email: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface Continent {
  id: number;
  name: string;
  description?: string | null;
}

export interface Country {
  id: number;
  name: string;
  population: number;
  language: string;
  currency: string;
  continent_id: number;
  continent?: Continent;
}

export interface City {
  id: number;
  name: string;
  population: number;
  latitude: number;
  longitude: number;
  country_id: number;
  country?: Country;
}

export interface CulturalObservation {
  id: number;
  country_id: number;
  city_id?: number;
  user_id: number;
  observation: string;
  created_at: string;
  updated_at: string;
  country?: Country;
  city?: City;
  user?: User;
}

export interface RegisterDTO {
  username: string;
  email: string;
  password: string;
}

export interface LoginDTO {
  email: string;
  password: string;
}

export interface CreateContinentDTO {
  name: string;
  description?: string;
}

export interface CreateCountryDTO {
  name: string;
  population: number;
  language: string;
  currency: string;
  continent_id: number;
}

export interface CreateCityDTO {
  name: string;
  population: number;
  latitude: number;
  longitude: number;
  country_id: number;
}

export interface CreateObservationDTO {
  country_id: number;
  city_id?: number;
  observation: string;
}

// External APIs types
export interface WeatherData {
  current: {
    temperature_2m: number;
    relative_humidity_2m: number;
    apparent_temperature: number;
    precipitation: number;
    weather_code: number;
    weather_description: string;
    wind_speed_10m: number;
    wind_direction_10m: number;
  };
  current_units: {
    temperature_2m: string;
    relative_humidity_2m: string;
    apparent_temperature: string;
    precipitation: string;
    wind_speed_10m: string;
  };
}

export interface RestCountryData {
  name: {
    common: string;
    official: string;
  };
  population: number;
  flags: {
    png: string;
    svg: string;
    alt?: string;
  };
  capital?: string[];
  region: string;
  languages?: { [key: string]: string };
  currencies?: { [key: string]: { name: string; symbol: string } };
  timezones?: string[];
  latlng?: number[];
}
