import api from './api';
import {
  UserProfile,
  DashboardData,
  RecentActivity,
  ActivitiesResponse,
  Subject,
} from '../types';

export const userService = {
  async getProfile(): Promise<UserProfile> {
    const response = await api.get<UserProfile>('/users/me');
    return response.data;
  },

  async updateProfile(username: string): Promise<UserProfile> {
    const response = await api.patch<UserProfile>('/users/me', { username });
    return response.data;
  },

  async getDashboard(): Promise<DashboardData> {
    const response = await api.get<DashboardData>('/users/me/dashboard');
    return response.data;
  },

  async getLatestActivities(): Promise<RecentActivity[]> {
    const response = await api.get<RecentActivity[]>(
      '/users/me/dashboard/activities/latest'
    );
    return response.data;
  },

  async getActivities(
    page = 0,
    size = 6,
    subject?: Subject
  ): Promise<ActivitiesResponse> {
    const params = new URLSearchParams();
    params.append('page', page.toString());
    params.append('size', size.toString());
    if (subject) {
      params.append('subject', subject);
    }
    const response = await api.get<ActivitiesResponse>(
      `/users/me/dashboard/activities?${params.toString()}`
    );
    return response.data;
  },
};

export default userService;
