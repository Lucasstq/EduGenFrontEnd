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

  async logoutFromServer(): Promise<void> {
    const refreshToken = this.getRefreshToken();
    if (refreshToken) {
      try {
        await api.post(`/auth/logout?refreshToken=${refreshToken}`);
      } catch (error) {
        // Mesmo se falhar no servidor, limpamos localmente
        console.warn('Erro ao revogar token no servidor:', error);
      }
    }
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

  async logout(): Promise<void> {
    await this.logoutFromServer();
    this.clearTokens();
    window.location.href = '/login';
  },
};

export default authService;
