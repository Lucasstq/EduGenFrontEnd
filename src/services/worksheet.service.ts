import api from './api';
import {
  Worksheet,
  WorksheetsResponse,
  CreateWorksheetRequest,
  WorksheetVersion,
  CreateVersionRequest,
  VersionSpec,
  Subject,
  Audience,
} from '../types';

export const worksheetService = {
  async create(data: CreateWorksheetRequest): Promise<Worksheet> {
    const response = await api.post<Worksheet>('/worksheets', data);
    return response.data;
  },

  async getAll(
    page = 0,
    size = 20,
    subject?: Subject
  ): Promise<WorksheetsResponse> {
    const params = new URLSearchParams();
    params.append('page', page.toString());
    params.append('size', size.toString());
    if (subject) {
      params.append('subject', subject);
    }
    const response = await api.get<WorksheetsResponse>(
      `/worksheets?${params.toString()}`
    );
    return response.data;
  },

  async delete(id: number): Promise<void> {
    await api.delete(`/worksheets/${id}`);
  },

  async createVersion(
    worksheetId: number,
    data: CreateVersionRequest
  ): Promise<WorksheetVersion> {
    const response = await api.post<WorksheetVersion>(
      `/worksheets/${worksheetId}/versions`,
      data
    );
    return response.data;
  },

  async getVersionSpec(versionId: number): Promise<VersionSpec> {
    const response = await api.get<VersionSpec>(
      `/worksheets/versions/${versionId}/spec`
    );
    return response.data;
  },

  async downloadPdf(
    versionId: number,
    audience: Audience = Audience.STUDENTS
  ): Promise<Blob> {
    const response = await api.get(
      `/worksheets/versions/${versionId}/download?audience=${audience}`,
      { responseType: 'blob' }
    );
    return response.data;
  },

  openPdfInNewTab(blob: Blob): void {
    const url = window.URL.createObjectURL(blob);
    window.open(url, '_blank');
  },

  downloadPdfFile(blob: Blob, filename: string): void {
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  },
};

export default worksheetService;
