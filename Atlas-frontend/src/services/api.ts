import axios, { type AxiosInstance } from 'axios';
import type {
  AuthResponse,
  LoginDTO,
  RegisterDTO,
  Continent,
  Country,
  City,
  CulturalObservation,
  CreateContinentDTO,
  CreateCountryDTO,
  CreateCityDTO,
  CreateObservationDTO,
  RestCountryData,
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

  // Cities
  async getCities(filters?: { country_id?: number; continent_id?: number }): Promise<City[]> {
    const response = await this.client.get<City[]>('/cities', {
      params: filters,
    });
    return response.data;
  }

  async getCity(id: number): Promise<City> {
    const response = await this.client.get<City>(`/cities/${id}`);
    return response.data;
  }

  async createCity(data: CreateCityDTO): Promise<City> {
    const response = await this.client.post<City>('/cities', data);
    return response.data;
  }

  async updateCity(id: number, data: Partial<CreateCityDTO>): Promise<City> {
    const response = await this.client.put<City>(`/cities/${id}`, data);
    return response.data;
  }

  async deleteCity(id: number): Promise<void> {
    await this.client.delete(`/cities/${id}`);
  }

  // Cultural Observations
  async getObservations(filters?: { country_id?: number; city_id?: number; user_id?: number }): Promise<CulturalObservation[]> {
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

  // External APIs
  async getCountryInfo(countryName: string): Promise<RestCountryData> {
    const response = await this.client.get<RestCountryData>(`/external-apis/countries/${countryName}`);
    return response.data;
  }

  // Fetch simplified weather data from wttr.in for a city name.
  // Returns only the fields we care about: FeelsLikeC, humidity, temp_C
  async getWeather(cityName: string): Promise<import('../types').WeatherSimple | null> {
    try {
      const url = `https://wttr.in/${encodeURIComponent(cityName)}?format=j1`;
      const response = await this.client.get<any>(url);
      const data = response.data;
      const current = Array.isArray(data?.current_condition) ? data.current_condition[0] : undefined;
      if (!current) return null;
      return {
        FeelsLikeC: String(current.FeelsLikeC ?? current.FeelsLikeC ?? current.feelsLikeC ?? ''),
        humidity: String(current.humidity ?? current.Humidity ?? ''),
        temp_C: String(current.temp_C ?? current.tempC ?? ''),
      };
    } catch (err) {
      console.error('Failed to fetch weather from wttr.in', err);
      return null;
    }
  }
}

export const api = new ApiClient();
