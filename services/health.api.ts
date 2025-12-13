import api from './api';

export interface HealthCheckResponse {
  status: string;
  timestamp: string;
}

export const healthApi = {
  check: async (): Promise<HealthCheckResponse> => {
    const response = await api.get('/health');
    return response.data;
  },
};

