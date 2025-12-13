import api from '../../../services/api';

export interface ResourceItemResponse {
  id: string;
  name: string;
  quantity: number;
  unit: string;
  threshold: number;
  status: 'Good' | 'Low' | 'Critical';
}

export interface ResourceStatistics {
  total: number;
  byStatus: {
    good: number;
    low: number;
    critical: number;
  };
  lowStockCount: number;
}

export const resourceApi = {
  getAllResources: async (workspaceId: string): Promise<ResourceItemResponse[]> => {
    const response = await api.get(`/workspaces/${workspaceId}/resources`);
    return response.data.data;
  },

  getResourceById: async (
    workspaceId: string,
    resourceId: string
  ): Promise<ResourceItemResponse> => {
    const response = await api.get(
      `/workspaces/${workspaceId}/resources/${resourceId}`
    );
    return response.data.data;
  },

  addResource: async (
    workspaceId: string,
    resourceData: { name: string; quantity: number; unit: string; threshold: number }
  ): Promise<ResourceItemResponse> => {
    const response = await api.post(`/workspaces/${workspaceId}/resources`, resourceData);
    return response.data.data;
  },

  updateResource: async (
    workspaceId: string,
    resourceId: string,
    resourceData: {
      name?: string;
      quantity?: number;
      unit?: string;
      threshold?: number;
    }
  ): Promise<ResourceItemResponse> => {
    const response = await api.put(
      `/workspaces/${workspaceId}/resources/${resourceId}`,
      resourceData
    );
    return response.data.data;
  },

  updateResourceQuantity: async (
    workspaceId: string,
    resourceId: string,
    quantity: number
  ): Promise<ResourceItemResponse> => {
    const response = await api.patch(
      `/workspaces/${workspaceId}/resources/${resourceId}/quantity`,
      { quantity }
    );
    return response.data.data;
  },

  deleteResource: async (workspaceId: string, resourceId: string): Promise<void> => {
    await api.delete(`/workspaces/${workspaceId}/resources/${resourceId}`);
  },

  bulkReplaceResources: async (
    workspaceId: string,
    resources: Array<{ name: string; quantity: number; unit: string; threshold: number }>
  ): Promise<ResourceItemResponse[]> => {
    const response = await api.put(`/workspaces/${workspaceId}/resources`, { resources });
    return response.data.data;
  },

  getResourceStatistics: async (workspaceId: string): Promise<ResourceStatistics> => {
    const response = await api.get(`/workspaces/${workspaceId}/resources/statistics`);
    return response.data.data;
  },
};

