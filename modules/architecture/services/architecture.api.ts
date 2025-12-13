import api from '../../../services/api';
import { GeneratedArchitecture } from '../../../types';

export const architectureApi = {
  getArchitecturePlan: async (workspaceId: string) => {
    const response = await api.get(`/workspaces/${workspaceId}/architecture`);
    return response.data.data;
  },

  saveArchitecturePlan: async (workspaceId: string, plan: any) => {
    const response = await api.post(
      `/workspaces/${workspaceId}/architecture`,
      plan
    );
    return response.data.data;
  },

  updateArchitecturePlan: async (workspaceId: string, plan: any) => {
    const response = await api.put(
      `/workspaces/${workspaceId}/architecture`,
      plan
    );
    return response.data.data;
  },

  deleteArchitecturePlan: async (workspaceId: string) => {
    const response = await api.delete(
      `/workspaces/${workspaceId}/architecture`
    );
    return response.data.data;
  },

  getArchitectureSections: async (workspaceId: string) => {
    const response = await api.get(
      `/workspaces/${workspaceId}/architecture/sections`
    );
    return response.data.data;
  },

  addArchitectureSection: async (
    workspaceId: string,
    section: { title: string; description: string }
  ) => {
    const response = await api.post(
      `/workspaces/${workspaceId}/architecture/sections`,
      section
    );
    return response.data.data;
  },

  getArchitectureMaterials: async (workspaceId: string) => {
    const response = await api.get(
      `/workspaces/${workspaceId}/architecture/materials`
    );
    return response.data.data;
  },

  addArchitectureMaterial: async (
    workspaceId: string,
    material: { name: string; quantity: string; specification: string }
  ) => {
    const response = await api.post(
      `/workspaces/${workspaceId}/architecture/materials`,
      material
    );
    return response.data.data;
  },

  getArchitectureStages: async (workspaceId: string) => {
    const response = await api.get(
      `/workspaces/${workspaceId}/architecture/stages`
    );
    return response.data.data;
  },

  addArchitectureStage: async (
    workspaceId: string,
    stage: { phase: string; duration: string; tasks: string[] }
  ) => {
    const response = await api.post(
      `/workspaces/${workspaceId}/architecture/stages`,
      stage
    );
    return response.data.data;
  },
};
