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

export interface CulturalObservation {
  id: number;
  country_id: number;
  user_id: number;
  city?: string;
  observation: string;
  created_at: string;
  updated_at: string;
  country?: Country;
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

export interface CreateObservationDTO {
  country_id: number;
  city?: string;
  observation: string;
}
