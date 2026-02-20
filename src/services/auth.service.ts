import api from './api';
import {
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  RegisterResponse,
} from '../types';

export const authService = {
  async login(data: LoginRequest): Promise<LoginResponse> {
    const response = await api.post<LoginResponse>('/auth/login', data);
    return response.data;
  },

  async register(data: RegisterRequest): Promise<RegisterResponse> {
    const response = await api.post<RegisterResponse>('/auth/register', data);
    return response.data;
  },

  async refresh(refreshToken: string): Promise<LoginResponse> {
    const response = await api.get<LoginResponse>(
      `/auth/refresh?refreshToken=${refreshToken}`
    );
    return response.data;
  },

  saveTokens(tokens: LoginResponse): void {
    localStorage.setItem('accessToken', tokens.accessToken);
    localStorage.setItem('refreshToken', tokens.refreshToken);
  },

  clearTokens(): void {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
  },

  getAccessToken(): string | null {
    return localStorage.getItem('accessToken');
  },

  getRefreshToken(): string | null {
    return localStorage.getItem('refreshToken');
  },

  isAuthenticated(): boolean {
    return !!this.getAccessToken();
  },

  logout(): void {
    this.clearTokens();
    window.location.href = '/login';
  },
};

export default authService;
