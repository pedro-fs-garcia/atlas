import axios, { type AxiosInstance } from 'axios';
import type {
  AuthResponse,
  LoginDTO,
  RegisterDTO,
  Continent,
  Country,
  CulturalObservation,
  CreateContinentDTO,
  CreateCountryDTO,
  CreateObservationDTO,
} from '../types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

class ApiClient {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: API_BASE_URL,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Add token to requests if available
    this.client.interceptors.request.use((config) => {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });
  }

  // Auth endpoints
  async register(data: RegisterDTO): Promise<AuthResponse> {
    const response = await this.client.post<AuthResponse>('/auth/register', data);
    return response.data;
  }

  async login(data: LoginDTO): Promise<AuthResponse> {
    const response = await this.client.post<AuthResponse>('/auth/login', data);
    return response.data;
  }

  // Continents
  async getContinents(): Promise<Continent[]> {
    const response = await this.client.get<Continent[]>('/continents');
    return response.data;
  }

  async getContinent(id: number): Promise<Continent> {
    const response = await this.client.get<Continent>(`/continents/${id}`);
    return response.data;
  }

  async createContinent(data: CreateContinentDTO): Promise<Continent> {
    const response = await this.client.post<Continent>('/continents', data);
    return response.data;
  }

  async updateContinent(id: number, data: Partial<CreateContinentDTO>): Promise<Continent> {
    const response = await this.client.put<Continent>(`/continents/${id}`, data);
    return response.data;
  }

  async deleteContinent(id: number): Promise<void> {
    await this.client.delete(`/continents/${id}`);
  }

  // Countries
  async getCountries(): Promise<Country[]> {
    const response = await this.client.get<Country[]>('/countries');
    return response.data;
  }

  async getCountry(id: number): Promise<Country> {
    const response = await this.client.get<Country>(`/countries/${id}`);
    return response.data;
  }

  async createCountry(data: CreateCountryDTO): Promise<Country> {
    const response = await this.client.post<Country>('/countries', data);
    return response.data;
  }

  async updateCountry(id: number, data: Partial<CreateCountryDTO>): Promise<Country> {
    const response = await this.client.put<Country>(`/countries/${id}`, data);
    return response.data;
  }

  async deleteCountry(id: number): Promise<void> {
    await this.client.delete(`/countries/${id}`);
  }

  // Cultural Observations
  async getObservations(filters?: { country_id?: number; user_id?: number }): Promise<CulturalObservation[]> {
    const response = await this.client.get<CulturalObservation[]>('/cultural-observations', {
      params: filters,
    });
    return response.data;
  }

  async getObservation(id: number): Promise<CulturalObservation> {
    const response = await this.client.get<CulturalObservation>(`/cultural-observations/${id}`);
    return response.data;
  }

  async createObservation(data: CreateObservationDTO): Promise<CulturalObservation> {
    const response = await this.client.post<CulturalObservation>('/cultural-observations', data);
    return response.data;
  }

  async updateObservation(id: number, data: Partial<CreateObservationDTO>): Promise<CulturalObservation> {
    const response = await this.client.put<CulturalObservation>(`/cultural-observations/${id}`, data);
    return response.data;
  }

  async deleteObservation(id: number): Promise<void> {
    await this.client.delete(`/cultural-observations/${id}`);
  }
}

export const api = new ApiClient();
