import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { resourceApi } from '../services/resource.api';

export const useResources = (workspaceId: string) => {
  return useQuery({
    queryKey: ['resources', workspaceId],
    queryFn: () => resourceApi.getAllResources(workspaceId),
    enabled: !!workspaceId,
  });
};

export const useResourceById = (workspaceId: string, resourceId: string) => {
  return useQuery({
    queryKey: ['resource', workspaceId, resourceId],
    queryFn: () => resourceApi.getResourceById(workspaceId, resourceId),
    enabled: !!workspaceId && !!resourceId,
  });
};

export const useResourceStatistics = (workspaceId: string) => {
  return useQuery({
    queryKey: ['resource-statistics', workspaceId],
    queryFn: () => resourceApi.getResourceStatistics(workspaceId),
    enabled: !!workspaceId,
  });
};

export const useAddResource = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      workspaceId,
      resourceData,
    }: {
      workspaceId: string;
      resourceData: { name: string; quantity: number; unit: string; threshold: number };
    }) => resourceApi.addResource(workspaceId, resourceData),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['resources', variables.workspaceId] });
      queryClient.invalidateQueries({ queryKey: ['resource-statistics', variables.workspaceId] });
      queryClient.invalidateQueries({ queryKey: ['workspaces'] });
    },
  });
};

export const useUpdateResourceQuantity = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      workspaceId,
      resourceId,
      quantity,
    }: {
      workspaceId: string;
      resourceId: string;
      quantity: number;
    }) => resourceApi.updateResourceQuantity(workspaceId, resourceId, quantity),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['resources', variables.workspaceId] });
      queryClient.invalidateQueries({ queryKey: ['resource', variables.workspaceId, variables.resourceId] });
      queryClient.invalidateQueries({ queryKey: ['resource-statistics', variables.workspaceId] });
      queryClient.invalidateQueries({ queryKey: ['workspaces'] });
    },
  });
};

export const useUpdateResource = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      workspaceId,
      resourceId,
      resourceData,
    }: {
      workspaceId: string;
      resourceId: string;
      resourceData: { name?: string; quantity?: number; unit?: string; threshold?: number };
    }) => resourceApi.updateResource(workspaceId, resourceId, resourceData),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['resources', variables.workspaceId] });
      queryClient.invalidateQueries({ queryKey: ['resource', variables.workspaceId, variables.resourceId] });
      queryClient.invalidateQueries({ queryKey: ['resource-statistics', variables.workspaceId] });
      queryClient.invalidateQueries({ queryKey: ['workspaces'] });
    },
  });
};

export const useDeleteResource = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      workspaceId,
      resourceId,
    }: {
      workspaceId: string;
      resourceId: string;
    }) => resourceApi.deleteResource(workspaceId, resourceId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['resources', variables.workspaceId] });
      queryClient.invalidateQueries({ queryKey: ['resource-statistics', variables.workspaceId] });
      queryClient.invalidateQueries({ queryKey: ['workspaces'] });
    },
  });
};

export const useBulkReplaceResources = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      workspaceId,
      resources,
    }: {
      workspaceId: string;
      resources: Array<{ name: string; quantity: number; unit: string; threshold: number }>;
    }) => resourceApi.bulkReplaceResources(workspaceId, resources),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['resources', variables.workspaceId] });
      queryClient.invalidateQueries({ queryKey: ['resource-statistics', variables.workspaceId] });
      queryClient.invalidateQueries({ queryKey: ['workspaces'] });
    },
  });
};

