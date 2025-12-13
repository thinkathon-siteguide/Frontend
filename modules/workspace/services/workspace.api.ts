import api from '../../../services/api';

export interface CreateWorkspaceData {
  name: string;
  location: string;
  stage: string;
  type: string;
  budget: string;
}

export interface UpdateWorkspaceData {
  name?: string;
  location?: string;
  stage?: string;
  type?: string;
  budget?: string;
}

export interface WorkspaceResponse {
  _id: string;
  userId: string;
  name: string;
  location: string;
  stage: string;
  type: string;
  budget: string;
  status: 'Under Construction' | 'Finished';
  progress: number;
  safetyScore: number;
  lastUpdated: Date;
  resources: ResourceItemResponse[];
  architecturePlan?: ArchitecturePlanResponse;
  safetyReports: SafetyReportResponse[];
  createdAt: Date;
  updatedAt: Date;
}

export interface ResourceItemResponse {
  id: string;
  name: string;
  quantity: number;
  unit: string;
  threshold: number;
  status: 'Good' | 'Low' | 'Critical';
}

export interface ArchitecturePlanResponse {
  sections: Array<{ title: string; description: string }>;
  materials: Array<{ name: string; quantity: string; specification: string }>;
  stages: Array<{ phase: string; duration: string; tasks: string[] }>;
  summary: string;
  createdAt?: Date;
}

export interface SafetyReportResponse {
  id: string;
  date: string;
  riskScore: number;
  hazards: Array<{
    description: string;
    severity: 'Low' | 'Medium' | 'High';
    recommendation: string;
  }>;
  summary: string;
}

export const workspaceApi = {
  getAllWorkspaces: async (): Promise<WorkspaceResponse[]> => {
    const response = await api.get('/workspaces');
    return response.data.data;
  },

  getWorkspaceById: async (id: string): Promise<WorkspaceResponse> => {
    const response = await api.get(`/workspaces/${id}`);
    return response.data.data;
  },

  createWorkspace: async (data: CreateWorkspaceData): Promise<WorkspaceResponse> => {
    const response = await api.post('/workspaces', data);
    return response.data.data;
  },

  updateWorkspace: async (
    id: string,
    data: UpdateWorkspaceData
  ): Promise<WorkspaceResponse> => {
    const response = await api.put(`/workspaces/${id}`, data);
    return response.data.data;
  },

  deleteWorkspace: async (id: string): Promise<void> => {
    await api.delete(`/workspaces/${id}`);
  },

  updateProgress: async (id: string, progress: number): Promise<WorkspaceResponse> => {
    const response = await api.patch(`/workspaces/${id}/progress`, { progress });
    return response.data.data;
  },

  toggleStatus: async (id: string): Promise<WorkspaceResponse> => {
    const response = await api.patch(`/workspaces/${id}/status`);
    return response.data.data;
  },

  getAllResources: async (workspaceId: string): Promise<ResourceItemResponse[]> => {
    const response = await api.get(`/workspaces/${workspaceId}/resources`);
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

  getArchitecturePlan: async (
    workspaceId: string
  ): Promise<ArchitecturePlanResponse | null> => {
    const response = await api.get(`/workspaces/${workspaceId}/architecture`);
    return response.data.data;
  },

  saveArchitecturePlan: async (
    workspaceId: string,
    planData: {
      sections: Array<{ title: string; description: string }>;
      materials: Array<{ name: string; quantity: string; specification: string }>;
      stages: Array<{ phase: string; duration: string; tasks: string[] }>;
      summary: string;
    }
  ): Promise<ArchitecturePlanResponse> => {
    const response = await api.post(`/workspaces/${workspaceId}/architecture`, planData);
    return response.data.data;
  },

  getAllSafetyReports: async (workspaceId: string): Promise<SafetyReportResponse[]> => {
    const response = await api.get(`/workspaces/${workspaceId}/safety-reports`);
    return response.data.data;
  },

  saveSafetyReport: async (
    workspaceId: string,
    reportData: {
      riskScore: number;
      hazards: Array<{
        description: string;
        severity: 'Low' | 'Medium' | 'High';
        recommendation: string;
      }>;
      summary: string;
    }
  ): Promise<SafetyReportResponse> => {
    const response = await api.post(`/workspaces/${workspaceId}/safety-reports`, reportData);
    return response.data.data;
  },

  getSafetyReportById: async (
    workspaceId: string,
    reportId: string
  ): Promise<SafetyReportResponse> => {
    const response = await api.get(`/workspaces/${workspaceId}/safety-reports/${reportId}`);
    return response.data.data;
  }
};

